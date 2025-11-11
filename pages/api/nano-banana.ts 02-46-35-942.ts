

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

class NanoBananaClient {
  apiKey: string;
  apiUrl: string;
  constructor(apiKey: string, apiUrl?: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || 'https://api.nanobanana.com/v1/fix-image';
  }
  async fixImage({ imageUrl, prompt }: { imageUrl: string; prompt: string }) {
    const response = await axios.post(
      this.apiUrl,
      { imageUrl, prompt },
      { headers: { 'Authorization': `Bearer ${this.apiKey}` } }
    );
    return response.data;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { imageUrl, prompt, useGemini } = req.body;
  if (!imageUrl || !prompt) {
    return res.status(400).json({ error: 'Missing imageUrl or prompt' });
  }
  try {
    let finalPrompt = prompt;
    // If useGemini is true, enhance the prompt with Gemini 2.5 Flash
    if (useGemini) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const geminiPrompt = `Given the following user prompt for image editing, improve it for an AI image editing model.\n\nUser Prompt: ${prompt}\nImage URL: ${imageUrl}\n\nImproved Prompt:`;
      const result = await model.generateContent(geminiPrompt);
      const response = await result.response;
      finalPrompt = response.text().trim();
    }
  // Use NanoBananaClient helper instead of direct URL
  const apiKey = process.env.NANO_BANANA_API_KEY;
  const nanoBanana = new NanoBananaClient(apiKey!);
  const data = await nanoBanana.fixImage({ imageUrl, prompt: finalPrompt });
  // Assume the processed image URL is in data.processedImageUrl
  res.status(200).json({ processedImageUrl: data.processedImageUrl, usedPrompt: finalPrompt });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process image', details: String(err) });
  }
}
