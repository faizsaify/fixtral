import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import OpenAI from "openai";

async function main() {
  if (!process.env.DASHSCOPE_API_KEY) {
    console.error("Error: DASHSCOPE_API_KEY is not set in .env.local");
    process.exit(1);
  }

  const openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
  });

  console.log("Testing Qwen Image Edit API...");
  try {
    const response = await openai.chat.completions.create({
      model: "qwen-image-edit-plus",
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: "https://dashscope.oss-cn-beijing.aliyuncs.com/images/dog_and_girl.jpeg" } },
            { type: "text", text: "Make the dog wear sunglasses" },
          ]
        }
      ]
    });
    console.log("Response:", JSON.stringify(response, null, 2));
  } catch (error: any) {
    console.error("Error calling API:", error.message || error);
  }
}

main();
