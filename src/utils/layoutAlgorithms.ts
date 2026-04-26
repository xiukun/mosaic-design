import { ImageItem } from '../types';

export interface GridLayoutOptions {
  width: number;
  height: number;
  rows: number;
  cols: number;
  spacing: number;
}

export interface MosaicLayoutOptions {
  width: number;
  height: number;
  spacing: number;
}

export const calculateGridLayout = (
  images: ImageItem[],
  options: GridLayoutOptions
): ImageItem[] => {
  const { width, height, rows, cols, spacing } = options;
  const totalSpacingX = (cols - 1) * spacing;
  const totalSpacingY = (rows - 1) * spacing;
  const cellWidth = (width - totalSpacingX) / cols;
  const cellHeight = (height - totalSpacingY) / rows;

  return images.map((img, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    if (row >= rows || col >= cols) return img;

    const x = col * (cellWidth + spacing);
    const y = row * (cellHeight + spacing);

    const imgRatio = img.width / img.height;
    const cellRatio = cellWidth / cellHeight;

    let scaleWidth, scaleHeight;
    if (imgRatio > cellRatio) {
      scaleWidth = cellWidth;
      scaleHeight = cellWidth / imgRatio;
    } else {
      scaleHeight = cellHeight;
      scaleWidth = cellHeight * imgRatio;
    }

    const offsetX = (cellWidth - scaleWidth) / 2;
    const offsetY = (cellHeight - scaleHeight) / 2;

    return {
      ...img,
      x: x + offsetX,
      y: y + offsetY,
      scale: Math.min(scaleWidth / img.width, scaleHeight / img.height),
    };
  });
};

export const calculateMosaicLayout = (
  images: ImageItem[],
  options: MosaicLayoutOptions
): ImageItem[] => {
  const { width, height, spacing } = options;
  const result = [...images];
  const usedAreas: { x: number; y: number; w: number; h: number }[] = [];

  const tryPlace = (x: number, y: number, w: number, h: number): boolean => {
    if (x + w > width || y + h > height) return false;
    for (const area of usedAreas) {
      if (x < area.x + area.w && x + w > area.x && y < area.y + area.h && y + h > area.y) {
        return false;
      }
    }
    return true;
  };

  const sortedImages = [...images].sort((a, b) => (b.width * b.height) - (a.width * a.height));

  for (const img of sortedImages) {
    const maxSize = Math.min(width * 0.5, height * 0.5);
    const scale = Math.min(maxSize / img.width, maxSize / img.height);
    const imgW = img.width * scale;
    const imgH = img.height * scale;

    let placed = false;
    for (let x = spacing; x < width - imgW - spacing && !placed; x += 20) {
      for (let y = spacing; y < height - imgH - spacing && !placed; y += 20) {
        if (tryPlace(x, y, imgW, imgH)) {
          const index = result.findIndex(i => i.id === img.id);
          if (index !== -1) {
            result[index] = {
              ...result[index],
              x,
              y,
              scale,
            };
          }
          usedAreas.push({ x, y, w: imgW, h: imgH });
          placed = true;
        }
      }
    }

    if (!placed) {
      const randX = spacing + Math.random() * (width - imgW - spacing * 2);
      const randY = spacing + Math.random() * (height - imgH - spacing * 2);
      const index = result.findIndex(i => i.id === img.id);
      if (index !== -1) {
        result[index] = {
          ...result[index],
          x: randX,
          y: randY,
          scale,
        };
      }
    }
  }

  return result;
};
