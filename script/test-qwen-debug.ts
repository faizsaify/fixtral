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

  console.log("Testing Qwen VL Max (Baseline)...");
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
    console.log("VL Max Response Object:", JSON.stringify(response, null, 2));
    const msg = response.choices[0]?.message;
    if (msg) {
      console.log("Message Keys:", Object.keys(msg));
      console.log("VL Max Content:", msg.content);
      // Check for other potential fields
      console.log("Full Message:", JSON.stringify(msg, null, 2));
    } else {
      console.log("No message found");
    }
  } catch (error: any) {
    console.error("Error calling VL Max:", error.message || error);
  }
}

main();
