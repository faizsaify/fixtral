
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables.');
    process.exit(1);
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = 'Write a short creative caption for a photo of a cat wearing sunglasses.';
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('Gemini API response:', response.text());
  } catch (err) {
    console.error('Gemini API error:', err);
  }
}

testGemini();
