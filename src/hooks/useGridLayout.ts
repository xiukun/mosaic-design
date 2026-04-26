import { useState, useEffect } from 'react';
import { calculateGridLayout, GridItem, LayoutOptions } from '../utils/layoutAlgorithms';

export interface UseGridLayoutOptions extends LayoutOptions {
  items: Array<{ id: string; width: number; height: number }>;
}

export function useGridLayout(options: UseGridLayoutOptions) {
  const [layout, setLayout] = useState<GridItem[]>([]);
  
  useEffect(() => {
    const newLayout = calculateGridLayout(options.items, {
      containerWidth: options.containerWidth,
      gap: options.gap,
      algorithm: options.algorithm,
      columns: options.columns
    });
    setLayout(newLayout);
  }, [options]);
  
  return layout;
}
