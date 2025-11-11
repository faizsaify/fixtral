"use client";
import { useEffect, useState } from 'react';

interface ImagePreviewModalProps {
  url: string;
  title: string;
  open: boolean;
  onClose: () => void;
  onGeneratePrompt: () => void;
  onEditPrompt: () => void;
  generatedPrompt: string;
  setGeneratedPrompt: (p: string) => void;
  loadingPrompt: boolean;
  editingPrompt: boolean;
  onProcessImage: () => void;
  processingImage: boolean;
  processedImageUrl: string;
}

function ImagePreviewModal(props: ImagePreviewModalProps) {
  const {
    url,
    title,
    open,
    onClose,
    onGeneratePrompt,
    onEditPrompt,
    generatedPrompt,
    setGeneratedPrompt,
    loadingPrompt,
    editingPrompt,
    onProcessImage,
    processingImage,
    processedImageUrl,
  } = props;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      style={{ backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full" onClick={e => e.stopPropagation()}>
        {/* Show before/after side by side if processedImageUrl exists */}
        {processedImageUrl ? (
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div className="flex-1 flex flex-col items-center">
              <div className="font-bold mb-2">Before</div>
              <img 
                src={url} 
                alt="Original" 
                className="w-full h-auto max-h-[40vh] object-contain border-2 border-gray-400" 
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="font-bold mb-2">After</div>
              <div className="relative w-full">
                <img 
                  src={processedImageUrl} 
                  alt="Edited output" 
                  className="w-full h-auto max-h-[40vh] object-contain border-2 border-green-600" 
                  onError={(e) => {
                    console.error('Error loading edited image');
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const error = document.createElement('div');
                      error.className = 'text-red-500 text-center p-4';
                      error.textContent = 'Error loading edited image';
                      parent.appendChild(error);
                    }
                  }}
                />
                <a 
                  href={processedImageUrl}
                  download="edited-image.png"
                  className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded font-bold transition-colors hover:bg-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    // For base64 images, create a temporary link and trigger download
                    if (processedImageUrl.startsWith('data:')) {
                      e.preventDefault();
                      const link = document.createElement('a');
                      link.href = processedImageUrl;
                      link.download = 'edited-image.png';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                >
                  Download Edited Image
                </a>
              </div>
            </div>
          </div>
        ) : (
          <img 
            src={url} 
            alt={title} 
            className="w-full h-auto max-h-[60vh] object-contain" 
          />
        )}
        <div className="mt-4 text-lg font-bold text-center">Original Prompt</div>
        <div className="text-center text-gray-700 mb-4">{title}</div>
        <div className="flex justify-center gap-4 mt-4">
          {!generatedPrompt ? (
            <button
              className={`px-6 py-2 rounded font-bold transition-colors ${loadingPrompt ? 'bg-black text-white' : 'bg-accent text-white hover:bg-black'} ${loadingPrompt ? 'cursor-wait' : ''}`}
              onClick={onGeneratePrompt}
              disabled={loadingPrompt}
            >
              {loadingPrompt ? 'Generating...' : 'Generate Prompt'}
            </button>
          ) : (
            <>
              <button
                className={`px-6 py-2 rounded font-bold transition-colors ${editingPrompt ? 'bg-black text-white' : 'bg-accent text-white hover:bg-black'} ${editingPrompt ? 'cursor-wait' : ''}`}
                onClick={onEditPrompt}
                disabled={editingPrompt}
              >
                {editingPrompt ? 'Editing...' : 'Edit'}
              </button>
              <button
                className={`px-6 py-2 rounded font-bold transition-colors ${processingImage ? 'bg-black text-white' : 'bg-green-600 text-white hover:bg-black'} ${processingImage ? 'cursor-wait' : ''}`}
                onClick={onProcessImage}
                disabled={processingImage}
              >
                {processingImage ? 'Processing...' : 'Process Image'}
              </button>
            </>
          )}
          <button className="px-6 py-2 bg-gray-300 text-black rounded font-bold" onClick={onClose}>
            Close
          </button>
        </div>
        {generatedPrompt && (
          <div className="mt-6">
            <div className="font-bold mb-2">Generated Prompt</div>
            <textarea
              className="w-full border rounded p-2 text-black"
              rows={3}
              value={generatedPrompt}
              onChange={e => setGeneratedPrompt(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
type Post = {
  id: string;
  title: string;
  url: string;
  author: string;
  created_utc: number;
};

export default function PhotoshopRequestQueue() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [errorPopup, setErrorPopup] = useState('');

  const fetchPosts = (refresh = false) => {
    setLoading(true);
    fetch(`/api/photoshop-request${refresh ? '?refresh=true' : ''}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div>Loading Reddit queue...</div>;

  // Handler for generating prompt
  const handleGeneratePrompt = async () => {
    if (!preview) return;
    setLoadingPrompt(true);
    setGeneratedPrompt('');
    setProcessedImageUrl('');
    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: preview.title, imageUrl: preview.url })
      });
      const data = await res.json();
      setGeneratedPrompt(data.prompt || '');
    } catch (e) {
      setGeneratedPrompt('Failed to generate prompt.');
    }
    setLoadingPrompt(false);
  };

  // Handler for editing prompt (send to Gemini 2.5 Flash for enhancement)
  const handleEditPrompt = async () => {
    if (!preview || !generatedPrompt) return;
    setEditingPrompt(true);
    setProcessedImageUrl('');
    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: generatedPrompt, imageUrl: preview.url })
      });
      const data = await res.json();
      setGeneratedPrompt(data.prompt || '');
    } catch (e) {
      setGeneratedPrompt('Failed to edit prompt.');
    }
    setEditingPrompt(false);
  };

  // Handler for processing image
  const handleProcessImage = async () => {
    if (!preview || !generatedPrompt) return;
    console.log('Sending prompt to nano-banana:', generatedPrompt);
    setProcessingImage(true);
    setProcessedImageUrl('');
    setErrorPopup('');
    try {
      const res = await fetch('/api/nano-banana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: preview.url, prompt: generatedPrompt, useGemini: true })
      });
      const data = await res.json();
      console.log('Received response:', {
        ok: res.ok,
        hasProcessedUrl: !!data.processedImageUrl,
        hasEditedImage: !!data.editedImage,
        geminiTextLength: data.geminiText?.length
      });

      if (!res.ok) {
        setErrorPopup(data.error || 'Failed to process image.');
        setProcessedImageUrl('');
      } else if (data.processedImageUrl || data.editedImage) {
        const imageData = data.processedImageUrl || data.editedImage;
        console.log('Setting processed image URL, starts with:', imageData.substring(0, 30));
        
        // Ensure it's a valid data URL or web URL
        if (imageData.startsWith('data:image/') || imageData.startsWith('http')) {
          setProcessedImageUrl(imageData);
        } else {
          console.error('Invalid image data received');
          setErrorPopup('Invalid image data received from AI.');
          setProcessedImageUrl('');
        }
      } else {
        console.log('No image data found in response');
        setErrorPopup('No image was returned from the AI.');
        setProcessedImageUrl('');
      }
    } catch (e) {
      setProcessedImageUrl('');
      setErrorPopup('Failed to process image.');
    }
    setProcessingImage(false);
  };

  return (
    <div className="space-y-4">
      {errorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-red-600 text-white px-6 py-4 rounded shadow-lg flex flex-col items-center">
            <div className="font-bold text-lg mb-2">Error</div>
            <div className="mb-4">{errorPopup}</div>
            <button className="px-4 py-2 bg-white text-red-600 rounded font-bold" onClick={() => setErrorPopup('')}>Close</button>
          </div>
        </div>
      )}
      <div className="flex justify-end mb-2">
        <button
          className="px-4 py-2 bg-accent text-white rounded font-bold hover:bg-black disabled:opacity-60 transition-colors"
          onClick={() => { setRefreshing(true); fetchPosts(true); }}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Feed'}
        </button>
      </div>
      {posts.map((post, index) => (
        <div
          key={post.id}
          className={`brutalist-panel${index === 0 ? ' border-2 border-black' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setPreview({ url: post.url, title: post.title })}
        >
          <div className="flex items-center gap-6">
            <div className="text-2xl font-bold w-12">#{index + 1}</div>
            <div className="relative group w-24 h-24">
              <img
                src={post.url}
                alt={post.title}
                className="w-24 h-24 object-cover border-2 border-black transition duration-200 group-hover:blur-sm"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold uppercase mb-2">{post.title}</h3>
              <p className="font-bold uppercase text-sm tracking-wide text-gray-600">
                FROM u/{post.author}
              </p>
            </div>
          </div>
        </div>
      ))}
      <ImagePreviewModal
        url={preview?.url || ''}
        title={preview?.title || ''}
        open={!!preview}
        onClose={() => {
          setPreview(null);
          setGeneratedPrompt('');
          setLoadingPrompt(false);
          setEditingPrompt(false);
          setProcessingImage(false);
          setProcessedImageUrl('');
        }}
        onGeneratePrompt={handleGeneratePrompt}
        onEditPrompt={handleEditPrompt}
        generatedPrompt={generatedPrompt}
        setGeneratedPrompt={setGeneratedPrompt}
        loadingPrompt={loadingPrompt}
        editingPrompt={editingPrompt}
        onProcessImage={handleProcessImage}
        processingImage={processingImage}
        processedImageUrl={processedImageUrl}
      />
    </div>
  );
}

