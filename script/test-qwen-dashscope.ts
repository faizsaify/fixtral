import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
// @ts-ignore
import DashScope, { MultiModalConversation } from "dashscope";

async function main() {
  if (!process.env.DASHSCOPE_API_KEY) {
    console.error("Error: DASHSCOPE_API_KEY is not set");
    process.exit(1);
  }

  // Set the base URL for international region as per the existing test script
  DashScope.baseHttpApiUrl = "https://dashscope-intl.aliyuncs.com/api/v1";

  console.log("Testing Qwen Image Edit Plus via DashScope SDK...");
  
  const messages = [
    {
      role: "user",
      content: [
        { image: "https://dashscope.oss-cn-beijing.aliyuncs.com/images/dog_and_girl.jpeg" },
        { text: "Make the dog wear sunglasses" }
      ]
    }
  ];

  try {
    const res = await MultiModalConversation.call({
      apiKey: process.env.DASHSCOPE_API_KEY,
      model: "qwen-image-edit-plus",
      messages,
    });

    console.log("Result:", JSON.stringify(res, null, 2));
  } catch (error: any) {
    console.error("Error:", error.message || error);
  }
}

main();
