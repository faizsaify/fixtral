// script/test-nano-banana.ts
// Usage: npx ts-node script/test-nano-banana.ts
import * as dotenv from "dotenv";
dotenv.config({ path: '.env.local' });
import axios from 'axios';


const apiKey = process.env.NANO_BANANA_API_KEY;

class NanoBananaClient {
  apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  async fixImage({ imageUrl, prompt }: { imageUrl: string; prompt: string }) {
    // The URL is internal to the class and not exposed to the user
    const endpoint = 'https://api.nanobanana.com/v1/fix-image';
    const response = await axios.post(
      endpoint,
      { imageUrl, prompt },
      { headers: { 'Authorization': `Bearer ${this.apiKey}` } }
    );
    return response.data;
  }
}

async function testNanoBanana() {
  if (!apiKey) {
    console.error('Missing NANO_BANANA_API_KEY in environment.');
    process.exit(1);
  }

  const nanoBanana = new NanoBananaClient(apiKey);
  // Use a sample image and prompt for testing
  const imageUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';
  const prompt = 'Make the sky more dramatic and enhance the colors.';

  try {
    const data = await nanoBanana.fixImage({ imageUrl, prompt });
    console.log('Nano Banana API response:', data);
    if (data.processedImageUrl) {
      console.log('Processed image URL:', data.processedImageUrl);
    } else {
      console.error('No processedImageUrl in response:', data);
    }
  } catch (err: any) {
    console.error('Nano Banana API error:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
  }
}

testNanoBanana();
