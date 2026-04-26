import { useCallback } from 'react';
import { useApp } from '../context/AppContext';

function useImageUpload() {
  const { addImage } = useApp();

  const processFile = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFiles = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const src = await processFile(file);
          addImage({
            src,
            x: 50 + Math.random() * 200,
            y: 50 + Math.random() * 200,
            width: 200,
            height: 200,
            rotation: 0,
          });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    }
  }, [processFile, addImage]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return {
    handleFiles,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  };
}

export default useImageUpload;