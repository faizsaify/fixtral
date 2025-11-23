#!/usr/bin/env python3
"""
Test script to verify Qwen Image Edit 2509 4bit model is working correctly
"""
import sys
import torch
from PIL import Image
import os
from diffusers import QwenImageEditPlusPipeline

# Local model path
model_path = "/Users/amanzing/Desktop/project/Qwen-Image-Edit-2509-4bit"

print("=" * 60)
print("Qwen Image Edit 2509 4bit - Model Test Script")
print("=" * 60)

# Check 1: Check device availability
print("\n[1/4] Checking device availability...")
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"✓ Using device: {device}")
if torch.cuda.is_available():
    print(f"  - GPU: {torch.cuda.get_device_name(0)}")
    print(f"  - CUDA version: {torch.version.cuda}")
    print(f"  - Available memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")

# Check 2: Load pipeline
print("\n[2/4] Loading QwenImageEditPlusPipeline...")
try:
    pipeline = QwenImageEditPlusPipeline.from_pretrained(
        model_path,
        torch_dtype=torch.bfloat16
    )
    print("✓ Pipeline loaded successfully")
    pipeline.set_progress_bar_config(disable=None)
    pipeline.enable_model_cpu_offload()
    print("✓ CPU offload enabled")
except Exception as e:
    print(f"✗ Failed to load pipeline: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Check 3: Create test image
print("\n[3/4] Creating test image...")
try:
    test_image = Image.new('RGB', (512, 512), color='red')
    test_image.save("test_input.png")
    print(f"✓ Test image created: 512x512 red square")
except Exception as e:
    print(f"✗ Failed to create test image: {str(e)}")
    sys.exit(1)

# Check 4: Test inference
print("\n[4/4] Testing inference...")
try:
    image = Image.open("test_input.png").convert("RGB")
    prompt = "Change the color to blue"
    
    print(f"  - Input image size: {image.size}")
    print(f"  - Prompt: '{prompt}'")
    print("  - Running inference...")
    
    inputs = {
        "image": image,
        "prompt": prompt,
        "generator": torch.manual_seed(0),
        "true_cfg_scale": 4.0,
        "negative_prompt": " ",
        "num_inference_steps": 20,
    }
    
    with torch.inference_mode():
        output = pipeline(**inputs)
    
    output_image = output.images[0]
    output_image.save("output_image_edit.png")
    print(f"✓ Inference completed successfully")
    print(f"✓ Output saved to: {os.path.abspath('output_image_edit.png')}")
    
except Exception as e:
    print(f"✗ Inference failed: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 60)
print("✓ All tests passed! Model is working correctly.")
print("=" * 60)
print("\nYou can now use the model in your project.")
sys.exit(0)
