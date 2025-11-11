// script/test-gemini-flash.ts
// Usage: npx ts-node script/test-gemini-flash.ts
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

async function testGeminiFlash() {
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY in environment.');
    process.exit(1);
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const title = 'Remove the background and make the subject pop.';
  const imageUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';
  const prompt = `Given the following Reddit post title for an image editing request, generate a clear, concise, and effective prompt for an AI image editing model. You may use the title and image context if available.\n\nTitle: ${title}\nImage URL: ${imageUrl}\n\nPrompt:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedPrompt = response.text().trim();
    console.log('Gemini 2.5 Flash generated prompt:', generatedPrompt);
  } catch (err: any) {
    console.error('Gemini 2.5 Flash API error:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
  }
}

testGeminiFlash();
