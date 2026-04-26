import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMosaicLayout } from '../utils/layoutAlgorithms';

export const useMosaicLayout = () => {
  const { state, applyLayout } = useApp();

  const applyMosaicLayout = useCallback(() => {
    if (state.images.length === 0) return;

    const { width, height } = state.canvasConfig;
    const { spacing = 10 } = state.layoutConfig;

    const layoutImages = calculateMosaicLayout(state.images, {
      width,
      height,
      spacing,
    });

    applyLayout(layoutImages);
  }, [state, applyLayout]);

  return {
    applyMosaicLayout,
  };
};