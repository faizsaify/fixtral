    async function editImageWithQwen(imageUrl, prompt, apiKey) {
      const response = await fetch('YOUR_QWEN_IMAGE_EDIT_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`, // Replace with your actual API key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'alibaba/qwen-image-edit', // Or the specific model identifier
          prompt: prompt,
          image: imageUrl, // URL or base64 encoded image
          // Other parameters as required by the API
        }),
      });

      const data = await response.json();
      console.log(data);
      return data;
    }

    // Example usage:
    const imageUrl = 'https://images.unsplash.com/photo-1756640837325-b8df8e2a02fa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D';
     const prompt = 'Change to black and white style';
    const yourApiKey = 'sk-f504032b4fb44608b4dbc79377e50765';
    editImageWithQwen(imageUrl, prompt, yourApiKey);