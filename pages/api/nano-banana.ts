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

// Helper to run Python script with Qwen model (Legacy/Local)
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

// Helper to run Qwen via Native DashScope API (Axios)
async function runQwenViaNativeAPI(imageUrl: string, prompt: string): Promise<string> {
  const endpoint = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  
  console.log('Calling Qwen Native API with model: qwen-image-edit-plus');
  
  const payload = {
    model: "qwen-image-edit-plus",
    input: {
      messages: [
        {
          role: "user",
          content: [
            { image: imageUrl },
            { text: prompt }
          ]
        }
      ]
    },
    parameters: {
      n: 1
    }
  };

  const response = await axios.post(endpoint, payload, {
    headers: {
      'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('Qwen Native API Response Status:', response.status);
  
  // Extract image URL from native response structure:
  // output.choices[0].message.content[0].image
  const choices = response.data?.output?.choices;
  if (!choices || choices.length === 0) {
    throw new Error('No choices in Qwen response: ' + JSON.stringify(response.data));
  }
  
  const content = choices[0].message?.content;
  if (!content || !Array.isArray(content)) {
    throw new Error('Invalid content in Qwen response');
  }
  
  const imageItem = content.find((item: any) => item.image);
  if (imageItem && imageItem.image) {
    return imageItem.image;
  }
  
  throw new Error('No image found in Qwen response content');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl, prompt, provider } = req.body;
  console.log('Received request:', {
    imageUrl: imageUrl ? (imageUrl.length > 120 ? imageUrl.substring(0, 120) + '...' : imageUrl) : 'missing',
    prompt: prompt ? (prompt.length > 200 ? prompt.substring(0, 200) + '...' : prompt) : 'missing',
    provider
  });

  if (!imageUrl || !prompt) {
    return res.status(400).json({ error: 'Missing imageUrl or prompt' });
  }

  try {
    if (provider === 'openai' || provider === 'qwen') {
       // Use Qwen / OpenAI compatible API
       if (!process.env.DASHSCOPE_API_KEY) {
         throw new Error('DASHSCOPE_API_KEY is not set');
       }
       
       const result = await runQwenViaNativeAPI(imageUrl, prompt);
       
       // If result is a URL, we can return it directly or download and convert to base64 if needed.
       // Frontend handles both http and data: urls.
       return res.status(200).json({
         processedImageUrl: result,
         editedImage: result,
         provider: 'qwen-api'
       });
       
    } else {
      // Default to local nano-banana
      console.log('Downloading image...');
      const { buffer } = await downloadImageBuffer(imageUrl);
      
      console.log('Processing with local Qwen Image Edit 4bit model...');
      const outputBuffer = await runQwenModelLocally(buffer, prompt);
      
      const outputBase64 = outputBuffer.toString('base64');
      const editedImageBase64 = `data:image/png;base64,${outputBase64}`;
      
      console.log('Image edit completed successfully');
      return res.status(200).json({
        processedImageUrl: editedImageBase64,
        editedImage: editedImageBase64,
        provider: 'qwen-local-4bit',
      });
    }
  } catch (err: any) {
    console.error('Processing error:', err?.message ?? err);
    // Handle Axios errors specifically to show more details
    if (axios.isAxiosError(err)) {
       console.error('Axios error details:', err.response?.data);
       return res.status(500).json({
         error: 'Failed to process image (API Error)',
         details: JSON.stringify(err.response?.data || err.message)
       });
    }
    
    return res.status(500).json({
      error: 'Failed to process image',
      details: err?.message ?? String(err),
    });
  }
}
