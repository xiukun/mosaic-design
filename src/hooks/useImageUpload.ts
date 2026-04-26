import React, { useCallback, useState } from 'react';
import { useApp } from '../context/AppContext';

export const useImageUpload = () => {
  const { addImage } = useApp();
  const [isDragging, setIsDragging] = useState(false);

  const processFile = React.useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      console.warn('Only image files are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        addImage(file, img.src, img.width, img.height);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [addImage]);

  const handleFiles = React.useCallback((files: FileList) => {
    Array.from(files).forEach(processFile);
  }, [processFile]);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFiles,
  };
};