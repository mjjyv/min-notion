import React, { useState } from 'react';
import { uploadImage } from '../../api/pageApi';
import { Loader2, Image as ImageIcon } from 'lucide-react';

const ImageBlock = ({ blockId, initialData, onChange }) => {
  const [url, setUrl] = useState(initialData?.url || '');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const data = await uploadImage(file);
      setUrl(data.url);
      onChange(blockId, { url: data.url });
    } catch (error) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (url) {
    return (
      <div className="relative group my-2">
        <img src={url} alt="Uploaded" className="max-w-full rounded-md shadow-sm" />
        {/* Nút xóa ảnh (hiện khi hover) */}
        <button 
          onClick={() => { setUrl(''); onChange(blockId, { url: '' }); }}
          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-neutral-800 rounded-md border border-neutral-700 my-2 flex items-center justify-center">
      {loading ? (
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Uploading...</span>
        </div>
      ) : (
        <label className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-gray-200">
          <ImageIcon className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Click to upload image</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>
      )}
    </div>
  );
};

export default ImageBlock;