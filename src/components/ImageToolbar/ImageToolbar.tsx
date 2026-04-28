import React from 'react';
import { useApp } from '../../context/AppContext';
import { ImageItem } from '../../types';
import { getTemplateById } from '../../utils/templates';

interface ImageToolbarProps {
  image: ImageItem;
}

const ImageToolbar: React.FC<ImageToolbarProps> = ({ image }) => {
  const { state, dispatch } = useApp();

  const handleRotate = () => {
    const newRotation = (image.rotation + 90) % 360;
    
    // 如果是绑定图片，旋转后需要重新计算缩放
    if (image.placeholderId) {
      const template = state.selectedTemplateId ? getTemplateById(state.selectedTemplateId) : null;
      const placeholder = template?.placeholders.find(p => p.id === image.placeholderId);
      
      if (placeholder) {
        // 计算旋转后的有效宽高（90/270度时宽高交换）
        const isRotated90or270 = (newRotation % 180) === 90;
        const effectiveWidth = isRotated90or270 ? image.height : image.width;
        const effectiveHeight = isRotated90or270 ? image.width : image.height;
        
        // 重新计算缩放（cover模式）
        const scaleX = placeholder.width / effectiveWidth;
        const scaleY = placeholder.height / effectiveHeight;
        const newScale = Math.max(scaleX, scaleY);
        
        dispatch({ 
          type: 'UPDATE_IMAGE', 
          payload: { 
            id: image.id, 
            rotation: newRotation,
            scale: newScale,
            offsetX: 0,
            offsetY: 0
          } 
        });
        return;
      }
    }
    
    // 自由图片直接旋转
    dispatch({ type: 'UPDATE_IMAGE', payload: { id: image.id, rotation: newRotation } });
  };

  const handleDelete = () => {
    dispatch({ type: 'REMOVE_IMAGE', payload: image.id });
    dispatch({ type: 'SELECT_IMAGE', payload: null });
  };

  return (
    <div
      className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20"
      style={{
        top: '-56px'
      }}
    >
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 px-2 py-1.5">
        <button
          onClick={handleRotate}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-700 hover:text-slate-900"
          title="旋转"
        >
          <span className="text-lg">⟳</span>
        </button>
        
        <div className="w-px h-6 bg-slate-200"></div>
        
        <button
          onClick={handleDelete}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors text-slate-700 hover:text-red-600"
          title="删除"
        >
          <span className="text-lg">✕</span>
        </button>
      </div>
    </div>
  );
};

export default ImageToolbar;