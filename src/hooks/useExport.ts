import { useCallback } from 'react';

export const useExport = () => {
  const exportAsPNG = useCallback((canvas: HTMLCanvasElement, filename: string = 'mosaic') => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      },
      'image/png'
    );
  }, []);

  const exportAsJPG = useCallback((canvas: HTMLCanvasElement, filename: string = 'mosaic', quality: number = 0.9) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}.jpg`;
          a.click();
          URL.revokeObjectURL(url);
        }
      },
      'image/jpeg',
      quality
    );
  }, []);

  return { exportAsPNG, exportAsJPG };
};
