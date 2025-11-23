import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Buffer } from 'buffer';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Helper to download image buffer and detect mime
async function downloadImageBuffer(imageUrl: string): Promise<{ buffer: Buffer; mime: string }> {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'binary');
  let mime = response.headers['content-type'] || 'image/png';
  if (!mime || !mime.startsWith('image/')) {
    const lower = imageUrl.toLowerCase();
    if (lower.endsWith('.png')) mime = 'image/png';
    else if (lower.endsWith('.webp')) mime = 'image/webp';
    else if (lower.endsWith('.gif')) mime = 'image/gif';
    else mime = 'image/jpeg';
  }
  return { buffer, mime };
}

// Helper to convert buffer to data URI
function bufferToDataUri(buffer: Buffer, mime: string) {
  const b64 = buffer.toString('base64');
  return `data:${mime};base64,${b64}`;
}

// Helper to run Python script with Qwen model
async function runQwenModelLocally(imageBuffer: Buffer, prompt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), 'script', 'qwen_edit.py');
    const tempInputPath = path.join('/tmp', `input_${Date.now()}.png`);
    const tempOutputPath = path.join('/tmp', `output_${Date.now()}.png`);
    
    // Save input image
    fs.writeFileSync(tempInputPath, imageBuffer);
    
    console.log('Running Qwen Image Edit 4bit locally...');
    const python = spawn('python3', [pythonScript, tempInputPath, tempOutputPath, prompt]);
    
    let errorOutput = '';
    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('Python stderr:', data.toString());
    });
    
    python.stdout.on('data', (data) => {
      console.log('Python stdout:', data.toString());
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        try { fs.unlinkSync(tempInputPath); } catch (e) {}
        reject(new Error(`Python failed with code ${code}: ${errorOutput}`));
        return;
      }
      
      try {
        const outputBuffer = fs.readFileSync(tempOutputPath);
        fs.unlinkSync(tempInputPath);
        fs.unlinkSync(tempOutputPath);
        resolve(outputBuffer);
      } catch (e) {
        reject(e);
      }
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl, prompt } = req.body;
  console.log('Received request:', {
    imageUrl: imageUrl ? (imageUrl.length > 120 ? imageUrl.substring(0, 120) + '...' : imageUrl) : 'missing',
    prompt: prompt ? (prompt.length > 200 ? prompt.substring(0, 200) + '...' : prompt) : 'missing',
  });

  if (!imageUrl || !prompt) {
    return res.status(400).json({ error: 'Missing imageUrl or prompt' });
  }

  try {
    // Download input image
    console.log('Downloading image...');
    const { buffer } = await downloadImageBuffer(imageUrl);
    
    // Run local Qwen model
    console.log('Processing with local Qwen Image Edit 4bit model...');
    const outputBuffer = await runQwenModelLocally(buffer, prompt);
    
    // Convert to base64 data URI
    const outputBase64 = outputBuffer.toString('base64');
    const editedImageBase64 = `data:image/png;base64,${outputBase64}`;
    
    console.log('Image edit completed successfully');
    return res.status(200).json({
      processedImageUrl: editedImageBase64,
      editedImage: editedImageBase64,
      provider: 'qwen-local-4bit',
    });
  } catch (err: any) {
    console.error('Local Qwen error:', err?.message ?? err);
    return res.status(500).json({
      error: 'Failed to process image with local Qwen model',
      details: err?.message ?? String(err),
    });
  }
}
