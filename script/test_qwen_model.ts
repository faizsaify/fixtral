import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import OpenAI from "openai";

const apiKey = process.env.DASHSCOPE_API_KEY;
const baseURL="https://dashscope-intl.aliyuncs.com/compatible-mode/v1";

if (!apiKey) {
    console.error("Error: DASHSCOPE_API_KEY environment variable is not set.");
    console.error("Please add DASHSCOPE_API_KEY to your .env.local file.");
    process.exit(1);
}

(async (): Promise<void> => {
    try {
        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL
        });
        const completion = await openai.chat.completions.create({
            model: "qwen-image-edit-plus",
           messages: [
            {
                "role": "user",
                "content": [
                    {
                        "image": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/fpakfo/image36.webp"
                    },
                    {
                        "text": "Generate an image that matches the depth map, following this description: A dilapidated red bicycle is parked on a muddy path with a dense primeval forest in the background."
                    }
                ]
            }
        ]
        });
        console.log(completion.choices[0].message.content);
    } catch (error: any) {
        console.log(`Error message: ${error}`);
        console.log("For more information, see https://www.alibabacloud.com/help/en/model-studio/developer-reference/error-code");
    }
})();