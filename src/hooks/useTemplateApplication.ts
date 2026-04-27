import { useApp } from '../context/AppContext';
import { Template, ImageItem } from '../types';

export const useTemplateApplication = () => {
  const { state, dispatch, applyLayout } = useApp();

  // 应用模板并分配图片
  const applyTemplateWithImages = (template: Template) => {
    // 1. 应用模板的画布配置
    dispatch({ type: 'SET_CANVAS_CONFIG', payload: template.canvasConfig });
    dispatch({ type: 'SELECT_TEMPLATE', payload: template.id });
    dispatch({ type: 'ADD_RECENT_TEMPLATE', payload: template.id });

    // 2. 分配图片到占位符
    const allocatedImages = allocateImagesToPlaceholders(state.images, template.placeholders);

    // 3. 应用分配的图片
    applyLayout(allocatedImages);
  };

  // 图片分配算法
  const allocateImagesToPlaceholders = (images: ImageItem[], placeholders: any[]): ImageItem[] => {
    const allocated: ImageItem[] = [];
    const usedImageIndices = new Set<number>();

    // 为每个占位符分配图片
    placeholders.forEach((placeholder) => {
      // 找到最合适的图片
      let bestImageIndex = -1;
      let bestMatchScore = -1;

      images.forEach((image, imageIndex) => {
        if (!usedImageIndices.has(imageIndex)) {
          // 计算图片比例与占位符比例的匹配度
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

      // 如果找到合适的图片，分配它
      if (bestImageIndex !== -1) {
        usedImageIndices.add(bestImageIndex);
        const image = images[bestImageIndex];

        // 计算图片的缩放比例，确保图片完全填充占位符
        const scaleX = placeholder.width / image.width;
        const scaleY = placeholder.height / image.height;
        const scale = Math.max(scaleX, scaleY);

        allocated.push({
          ...image,
          x: placeholder.x + (placeholder.width - image.width * scale) / 2,
          y: placeholder.y + (placeholder.height - image.height * scale) / 2,
          width: image.width,
          height: image.height,
          scale,
          rotation: placeholder.rotation,
          zIndex: placeholder.zIndex,
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