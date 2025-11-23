#!/usr/bin/env python3
import sys
import torch
from PIL import Image
from transformers import AutoProcessor, Qwen2VLForConditionalGeneration

# Get arguments
input_image_path = sys.argv[1]
output_image_path = sys.argv[2]
prompt = sys.argv[3]

print(f"Loading image: {input_image_path}")
print(f"Prompt: {prompt}")

# Detect device
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

try:
    # Local model path
    model_path = "/Users/faiz/models/Qwen-Image-Edit-2509-4bit"
    
    # Load processor and model (4bit quantized) from local path
    print(f"Loading Qwen Image Edit 2509 4bit model from {model_path}...")
    processor = AutoProcessor.from_pretrained(model_path)
    model = Qwen2VLForConditionalGeneration.from_pretrained(
        model_path,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        device_map="auto",
    )
    print("Model loaded successfully")
    
    # Load and process image
    print(f"Loading input image...")
    image = Image.open(input_image_path).convert("RGB")
    print(f"Image size: {image.size}")
    
    # Prepare inputs
    print("Preparing inputs...")
    inputs = processor(
        text=prompt,
        images=[image],
        return_tensors="pt"
    ).to(device)
    
    # Generate (for image editing tasks)
    print("Generating edited image...")
    with torch.no_grad():
        output_ids = model.generate(**inputs, max_new_tokens=1024)
    
    # Decode output
    result_text = processor.decode(output_ids[0], skip_special_tokens=True)
    print(f"Model output: {result_text}")
    
    # Save the edited image
    image.save(output_image_path)
    print(f"Saved edited image to: {output_image_path}")
    
    print("Success!")
    sys.exit(0)
    
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    import traceback
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)
