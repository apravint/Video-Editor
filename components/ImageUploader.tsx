
import React, { useRef } from 'react';
import { UploadCloudIcon, XIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  uploadedImage: { base64: string; mimeType: string; } | null;
  onRemoveImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImage, onRemoveImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  if (uploadedImage) {
    return (
      <div className="relative">
        <p className="block text-lg font-semibold text-gray-200 mb-2">Starting Image</p>
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-dashed border-gray-600">
            <img src={`data:${uploadedImage.mimeType};base64,${uploadedImage.base64}`} alt="Uploaded preview" className="w-full h-full object-contain" />
        </div>
        <button 
          onClick={onRemoveImage}
          className="absolute top-9 right-2 bg-gray-900/50 rounded-full p-1.5 text-white hover:bg-red-500 transition-colors"
          aria-label="Remove image"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-lg font-semibold text-gray-200 mb-2">
        Add a starting image (optional)
      </label>
      <div
        onClick={handleClick}
        onDrop={(e) => { e.preventDefault(); handleFileChange({ target: { files: e.dataTransfer.files } } as any); }}
        onDragOver={(e) => e.preventDefault()}
        className="flex justify-center items-center w-full px-6 py-10 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-700/50 hover:border-blue-500 transition-colors"
      >
        <div className="text-center">
          <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-400">
            <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
