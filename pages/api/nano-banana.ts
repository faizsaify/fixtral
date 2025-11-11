
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Buffer } from 'buffer';

// Helper to download image and convert to base64
async function imageUrlToBase64(imageUrl: string): Promise<string> {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const base64 = Buffer.from(response.data, 'binary').toString('base64');
  // Try to detect mime type from url extension (fallback to jpeg)
  let mime = 'image/jpeg';
  if (imageUrl.endsWith('.png')) mime = 'image/png';
  else if (imageUrl.endsWith('.webp')) mime = 'image/webp';
  else if (imageUrl.endsWith('.gif')) mime = 'image/gif';
  return `data:${mime};base64,${base64}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { imageUrl, prompt } = req.body;
  console.log('Received request:', { 
    imageUrl: imageUrl ? imageUrl.substring(0, 50) + '...' : 'missing', 
    prompt: prompt || 'missing',
  });

  if (!imageUrl || !prompt) {
    return res.status(400).json({ error: 'Missing imageUrl or prompt' });
  }

  try {
    // Download and convert image to base64
    console.log('Downloading image...');
    const base64Image = await imageUrlToBase64(imageUrl);
    console.log('Image downloaded and converted to base64');

    // Validate base64 image
    if (!base64Image.startsWith('data:image/')) {
      throw new Error('Invalid image format');
    }

    // Use Gemini 2.5 Flash for image editing
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    console.log('Initializing Gemini model...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.1,  // More deterministic
        topP: 1,
        topK: 32,
        maxOutputTokens: 2048,
      }
    });

    // Prepare the generation request
    const mimeType = base64Image.split(';')[0].replace('data:', '');
    const imageData = base64Image.split(',')[1];
    
    // Format the prompt to explicitly request image generation
    const formattedPrompt = `You are an expert image editor. I will provide an image and editing instructions.

EDITING REQUEST: ${prompt}

SYSTEM INSTRUCTIONS:
1. Process the provided image according to the editing request
2. Generate a modified version of the image
3. Return ONLY the edited image as a base64-encoded PNG
4. The response must start with "data:image/png;base64,"
5. Do not include any explanations or text

IMPORTANT: Your entire response should be just the base64 image data.`;

    console.log('Sending request to Gemini...');
    const result = await model.generateContent([
      { text: formattedPrompt },
      { inlineData: { mimeType, data: imageData } }
    ]);

    console.log('Received response from Gemini');
    const response = await result.response;
    
    // Get the response text
    let text = response.text().trim();
    console.log('Response length:', text.length);
    
    // Try to extract base64 image from Gemini's response
    let editedImageBase64 = null;
    
    console.log('Analyzing response for image data...');
    // Log the first part of the response for debugging
    console.log('Response starts with:', text.substring(0, 50));
    
    // First, look for a complete data URI
    const fullDataUriMatch = text.match(/data:image\/(png|jpeg|jpg|webp|gif);base64,([A-Za-z0-9+/=\s\n\r]+)/);
    if (fullDataUriMatch) {
      console.log('Found complete data URI');
      // Remove whitespace/newlines from base64 part
      const cleanBase64 = fullDataUriMatch[1].replace(/[\s\n\r]/g, '');
      try {
        Buffer.from(cleanBase64, 'base64');
        editedImageBase64 = `data:image/png;base64,${cleanBase64}`;
        console.log('Found and cleaned full data URI');
      } catch (e) {
        console.log('Invalid base64 in data URI');
      }
    }
    // If no valid data URI found, look for a large base64 string
    if (!editedImageBase64) {
      console.log('No complete data URI found, looking for base64 data...');
      const base64OnlyMatch = text.match(/([A-Za-z0-9+/=\s\n\r]{100,})/);
      if (base64OnlyMatch) {
        try {
          console.log('Found potential base64 data, validating...');
          const cleanBase64 = base64OnlyMatch[1].replace(/[\s\n\r]/g, '');
          Buffer.from(cleanBase64, 'base64');
          editedImageBase64 = `data:image/png;base64,${cleanBase64}`;
          console.log('Successfully validated and cleaned base64 data');
        } catch (e) {
          console.log('Invalid base64 data');
        }
      } else {
        console.log('No base64 data found in response');
      }
    }

    // If we still don't have an image, log the full response for debugging
    if (!editedImageBase64) {
      console.log('No valid image data found in response');
      console.log('Full response:', text);
    }

    const response_data = {
      processedImageUrl: editedImageBase64,
      editedImage: editedImageBase64,
      geminiText: text
    };
    
    console.log('Sending response:', {
      hasProcessedImage: !!editedImageBase64,
      textLength: text.length,
      firstChars: text.substring(0, 20)
    });
    
    res.status(200).json(response_data);
  } catch (err: any) {
    console.error('Error in nano-banana:', err);
    res.status(500).json({ 
      error: 'Failed to process image with Gemini 2.5 Flash', 
      details: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined
    });
  }
}
