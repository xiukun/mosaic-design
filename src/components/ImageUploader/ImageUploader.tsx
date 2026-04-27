import React from 'react';
import { useApp } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Upload, X, Plus } from 'lucide-react';

const ImageUploader: React.FC = () => {
  const { state, removeImage } = useApp();
  const { isDragging, handleDrop, handleDragOver, handleDragLeave, handleFiles } = useImageUpload();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer rounded-2xl p-6 text-center transition-all duration-300 border-2 border-dashed
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/80 scale-105 shadow-lg' 
            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        
        <div className={`
          w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-all duration-300
          ${isDragging ? 'bg-blue-500/20 text-blue-600' : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-500'}
        `}>
          <Upload className={`w-7 h-7 ${isDragging ? 'animate-bounce' : ''}`} />
        </div>
        
        <p className="font-medium text-slate-700 mb-1">
          {isDragging ? '松开上传图片' : '拖拽或点击上传'}
        </p>
        <p className="text-xs text-slate-400">
          JPG, PNG, GIF • 最多 100 张
        </p>
        
        <div className="absolute -top-3 -right-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Plus className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      {state.images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              已上传 {state.images.length} 张
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {state.images.map((img, index) => (
              <div key={img.id} className="group relative aspect-square">
                <img
                  src={img.src}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl shadow-sm ring-1 ring-slate-100"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-2 left-2 w-5 h-5 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
