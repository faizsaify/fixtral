import type { NextApiRequest, NextApiResponse } from 'next';
import 'dotenv/config';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { title, imageUrl } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ error: 'Missing title or imageUrl' });
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Given the following Reddit post title for an image editing request, generate a clear, concise, and effective prompt for an AI image editing model. You may use the title and image context if available.\n\nTitle: ${title}\nImage URL: ${imageUrl}\n\nPrompt:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedPrompt = response.text().trim();
    console.log('Generated prompt:', generatedPrompt);
    res.status(200).json({ prompt: generatedPrompt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate prompt', details: String(err) });
  }
}
