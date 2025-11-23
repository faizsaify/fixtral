import OpenAI from "openai";

// Load DashScope API key from environment variable
const apiKey = process.env.DASHSCOPE_API_KEY;
const baseURL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";

if (!apiKey) {
    console.error("Error: DASHSCOPE_API_KEY environment variable is not set.");
    console.error("Please add DASHSCOPE_API_KEY to your .env.local file.");
    process.exit(1);
}

(async () => {
    try {
        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL
        });
        const completion = await openai.chat.completions.create({
            model: "qwen-plus",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Who are you?" }
            ],
        });
        console.log(completion.choices[0].message.content);
    } catch (error) {
        console.log(`Error message: ${error}`);
        console.log("For more information, see https://www.alibabacloud.com/help/en/model-studio/developer-reference/error-code");
    }
})();