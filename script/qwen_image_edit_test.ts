import fs from "fs";
import mime from "mime-types";
import DashScope, { MultiModalConversation } from "dashscope";

DashScope.baseHttpApiUrl = "https://dashscope-intl.aliyuncs.com/api/v1";

function encodeFile(filePath: string): string {
  const mimeType = mime.lookup(filePath);
  if (!mimeType || !mimeType.startsWith("image/")) throw new Error("Invalid image");
  const base64 = fs.readFileSync(filePath).toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

const image = encodeFile("/path/to/your/image.png");

const messages = [
  {
    role: "user",
    content: [
      { image },
      { text: "Generate an image of a bicycle..." }
    ]
  }
];

const apiKey = process.env.DASHSCOPE_API_KEY;

(async () => {
  const res = await MultiModalConversation.call({
    apiKey,
    model: "qwen-image-edit-plus",
    messages,
    stream: false,
    n: 2
  });

  console.log(res);
})();
