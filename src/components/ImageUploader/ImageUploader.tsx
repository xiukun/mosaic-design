import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';

const ImageUploader: React.FC = () => {
  const { state, removeImage } = useApp();
  const { isDragging, handleDrop, handleDragOver, handleDragLeave, handleFiles } = useImageUpload();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="p-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />
        <div className="text-4xl mb-2">📷</div>
        <p className="text-slate-600 font-medium">拖拽图片或点击上传</p>
        <p className="text-slate-400 text-sm mt-1">支持 JPG, PNG, GIF 格式</p>
      </div>

      {state.images.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-slate-700 mb-3">已上传 ({state.images.length})</h3>
          <div className="grid grid-cols-2 gap-3">
            {state.images.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.src}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-lg shadow-sm"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;