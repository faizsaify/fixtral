import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import axios from 'axios';

async function main() {
  if (!process.env.DASHSCOPE_API_KEY) {
    console.error("Error: DASHSCOPE_API_KEY is not set");
    process.exit(1);
  }

  const url = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  
  const payload = {
    model: "qwen-image-edit-plus",
    input: {
      messages: [
        {
          role: "user",
          content: [
            { image: "https://dashscope.oss-cn-beijing.aliyuncs.com/images/dog_and_girl.jpeg" },
            { text: "Make the dog wear sunglasses" }
          ]
        }
      ]
    },
    parameters: {
      n: 1
    }
  };

  console.log("Calling native DashScope API...");
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
    console.error("Error calling native API:", error.response?.data || error.message);
  }
}

main();
