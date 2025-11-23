import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import axios from 'axios';

async function main() {
  if (!process.env.DASHSCOPE_API_KEY) {
    console.error("Error: DASHSCOPE_API_KEY is not set");
    process.exit(1);
  }

  const url = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions";
  
  const payload = {
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
  };

  console.log("Calling raw API...");
  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Raw Status:", response.status);
    console.log("Raw Data:", JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error("Error calling raw API:", error.response?.data || error.message);
  }
}

main();
