import { useApp } from '../context/AppContext';
import { Template, ImageItem } from '../types';

export const useTemplateApplication = () => {
  const { state, dispatch, applyLayout } = useApp();

  const applyTemplateWithImages = (template: Template) => {
    dispatch({ type: 'SET_CANVAS_CONFIG', payload: template.canvasConfig });
    dispatch({ type: 'SELECT_TEMPLATE', payload: template.id });
    dispatch({ type: 'ADD_RECENT_TEMPLATE', payload: template.id });

    const allocatedImages = allocateImagesToPlaceholders(state.images, template.placeholders);

    applyLayout(allocatedImages);
  };

  const calculateImageFit = (
    imageWidth: number,
    imageHeight: number,
    placeholderWidth: number,
    placeholderHeight: number
  ) => {
    const scaleX = placeholderWidth / imageWidth;
    const scaleY = placeholderHeight / imageHeight;
    const scale = Math.max(scaleX, scaleY);

    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;

    const offsetX = (placeholderWidth - scaledWidth) / 2;
    const offsetY = (placeholderHeight - scaledHeight) / 2;

    return {
      scale,
      offsetX,
      offsetY,
    };
  };

  const allocateImagesToPlaceholders = (images: ImageItem[], placeholders: any[]): ImageItem[] => {
    const allocated: ImageItem[] = [];
    const usedImageIndices = new Set<number>();

    placeholders.forEach((placeholder) => {
      let bestImageIndex = -1;
      let bestMatchScore = -1;

      images.forEach((image, imageIndex) => {
        if (!usedImageIndices.has(imageIndex)) {
          const imageRatio = image.width / image.height;
          const placeholderRatio = placeholder.aspectRatio;
          const ratioDifference = Math.abs(imageRatio - placeholderRatio);
          const matchScore = 1 / (1 + ratioDifference);

          if (matchScore > bestMatchScore) {
            bestMatchScore = matchScore;
            bestImageIndex = imageIndex;
          }
        }
      });

      if (bestImageIndex !== -1) {
        usedImageIndices.add(bestImageIndex);
        const image = images[bestImageIndex];

        const fit = calculateImageFit(
          image.width,
          image.height,
          placeholder.width,
          placeholder.height
        );

        allocated.push({
          ...image,
          placeholderId: placeholder.id,
          x: placeholder.x,
          y: placeholder.y,
          scale: fit.scale,
          rotation: placeholder.rotation,
          zIndex: placeholder.zIndex,
          offsetX: fit.offsetX,
          offsetY: fit.offsetY,
        });
      }
    });

    return allocated;
  };

  return {
    applyTemplateWithImages,
    allocateImagesToPlaceholders,
  };
};