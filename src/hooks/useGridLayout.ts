import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { calculateGridLayout } from '../utils/layoutAlgorithms';

export const useGridLayout = () => {
  const { state, applyLayout } = useApp();

  const applyGridLayout = useCallback(() => {
    if (state.images.length === 0) return;

    const { width, height } = state.canvasConfig;
    const { gridRows = 2, gridCols = 2, spacing = 10 } = state.layoutConfig;

    const layoutImages = calculateGridLayout(state.images, {
      width,
      height,
      rows: gridRows,
      cols: gridCols,
      spacing,
    });

    applyLayout(layoutImages);
  }, [state, applyLayout]);

  return {
    applyGridLayout,
  };
}
