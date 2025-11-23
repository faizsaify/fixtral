import json
import os
import dashscope
from dashscope import MultiModalConversation
import base64
import mimetypes
import sys
import requests

# The following is the URL for the Singapore region. If you use a model in the Beijing region, replace the URL with: https://dashscope.aliyuncs.com/api/v1
dashscope.base_http_api_url = 'https://dashscope-intl.aliyuncs.com/api/v1'


# --- For Base64 encoding ---
# Format: data:{mime_type};base64,{base64_data}
def encode_file(file_path):
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type or not mime_type.startswith("image/"):
        raise ValueError("Unsupported or unrecognized image format")

    try:
        with open(file_path, "rb") as image_file:
            encoded_string = base64.b64encode(
                image_file.read()).decode('utf-8')
        return f"data:{mime_type};base64,{encoded_string}"
    except IOError as e:
        raise IOError(f"Error reading file: {file_path}, Error: {str(e)}")


# --- Download image from URL ---
def download_image(image_url, save_path):
    response = requests.get(image_url)
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            f.write(response.content)
        return save_path
    else:
        raise Exception(f"Failed to download image: {response.status_code}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python qwen_image_edit.py <image_url> <prompt>"}))
        sys.exit(1)
    image_url = sys.argv[1]
    prompt = sys.argv[2]
    api_key = os.getenv("DASHSCOPE_API_KEY")
    if not api_key:
        print(json.dumps({"error": "DASHSCOPE_API_KEY not set"}))
        sys.exit(1)
    # Download image from URL
    local_image_path = "temp_image.png"
    try:
        download_image(image_url, local_image_path)
        image = encode_file(local_image_path)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
    messages = [
        {
            "role": "user",
            "content": [
                {"image": image},
                {"text": prompt}
            ]
        }
    ]
    response = MultiModalConversation.call(
        api_key=api_key,
        model="qwen-image-edit-plus",
        messages=messages,
        stream=False,
        n=2,
        watermark=False,
        negative_prompt=" ",
        prompt_extend=True,
    )
    if response.status_code == 200:
        output_images = [content['image'] for content in response.output.choices[0].message.content]
        print(json.dumps({"images": output_images}))
    else:
        print(json.dumps({
            "http_status": response.status_code,
            "error_code": response.code,
            "error_message": response.message
        }))
    # Clean up temp image
    if os.path.exists(local_image_path):
        os.remove(local_image_path)

