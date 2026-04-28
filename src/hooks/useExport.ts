import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getTemplateById } from '../utils/templates';

export const useExport = () => {
  const { state } = useApp();

  const exportAsImage = useCallback((format: 'png' | 'jpeg' = 'png', quality = 0.9) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = state.canvasConfig.width;
    canvas.height = state.canvasConfig.height;

    ctx.fillStyle = state.canvasConfig.backgroundColor;
    ctx.beginPath();
    if (state.canvasConfig.borderRadius > 0) {
      ctx.roundRect(0, 0, canvas.width, canvas.height, state.canvasConfig.borderRadius);
    } else {
      ctx.rect(0, 0, canvas.width, canvas.height);
    }
    ctx.fill();

    if (state.canvasConfig.borderWidth > 0) {
      ctx.strokeStyle = state.canvasConfig.borderColor;
      ctx.lineWidth = state.canvasConfig.borderWidth;
      ctx.stroke();
    }

    // 获取模板信息用于计算绑定图片的位置
    const template = state.selectedTemplateId ? getTemplateById(state.selectedTemplateId) : null;
    const placeholders = template?.placeholders || [];

    const imagesToLoad = state.images.length;
    let loadedCount = 0;

    state.images.forEach((img) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        ctx.save();
        
        // 计算图片中心位置
        let centerX: number;
        let centerY: number;
        
        if (img.placeholderId) {
          // 绑定图片：基于占位符中心计算
          const placeholder = placeholders.find(p => p.id === img.placeholderId);
          if (placeholder) {
            centerX = placeholder.x + placeholder.width / 2 + (img.offsetX || 0);
            centerY = placeholder.y + placeholder.height / 2 + (img.offsetY || 0);
            
            // 设置裁剪区域（只显示占位符内的部分）
            ctx.beginPath();
            ctx.rect(placeholder.x, placeholder.y, placeholder.width, placeholder.height);
            ctx.clip();
          } else {
            centerX = img.x;
            centerY = img.y;
          }
        } else {
          // 自由图片：直接使用图片位置
          centerX = img.x;
          centerY = img.y;
        }
        
        ctx.translate(centerX, centerY);
        ctx.rotate((img.rotation * Math.PI) / 180);
        ctx.scale(img.scale, img.scale);
        ctx.drawImage(image, -img.width / 2, -img.height / 2);
        ctx.restore();

        loadedCount++;
        if (loadedCount === imagesToLoad) {
          const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(mimeType, quality);
          
          const link = document.createElement('a');
          link.download = `mosaic-design-${Date.now()}.${format}`;
          link.href = dataUrl;
          link.click();
        }
      };
      image.src = img.src;
    });

    if (state.images.length === 0) {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      const link = document.createElement('a');
      link.download = `mosaic-design-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    }
  }, [state]);

  return {
    exportAsImage,
  };
};