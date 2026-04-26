import { useCallback } from 'react';
import { useApp } from '../context/AppContext';

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

    const imagesToLoad = state.images.length;
    let loadedCount = 0;

    state.images.forEach((img) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        ctx.save();
        ctx.translate(img.x + (img.width * img.scale) / 2, img.y + (img.height * img.scale) / 2);
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
