import { generateImageId } from '../domain/imageAlignment';
import { getTemplateById } from '../utils/templates';
import { AppState, ImageItem } from '../types';

type Image = ImageItem;

export interface UploadImageRequest {
  file: File;
  placeholderId: string;
  state: AppState;
  addImageWithPosition: (image: Image) => void;
}

export interface UploadImageResponse {
  success: boolean;
  image?: Image;
  error?: string;
}

const calculateImageFit = (
  imageWidth: number,
  imageHeight: number,
  placeholderWidth: number,
  placeholderHeight: number
) => {
  const scaleX = placeholderWidth / imageWidth;
  const scaleY = placeholderHeight / imageHeight;
  const scale = Math.max(scaleX, scaleY);

  return {
    scale,
    offsetX: 0,
    offsetY: 0,
  };
};

export class ImageUploadUseCase {
  async execute(request: UploadImageRequest): Promise<UploadImageResponse> {
    try {
      const { file, placeholderId, state, addImageWithPosition } = request;

      const src = await this.readFileAsDataURL(file);

      const img = await this.loadImage(src);

      const template = state.selectedTemplateId ? getTemplateById(state.selectedTemplateId) : null;
      const placeholder = template?.placeholders.find(p => p.id === placeholderId);
      
      if (!placeholder) {
        return {
          success: false,
          error: '占位符不存在'
        };
      }

      const imageId = generateImageId();

      const fit = calculateImageFit(
        img.width,
        img.height,
        placeholder.width,
        placeholder.height
      );

      const newImage: Image = {
        id: imageId,
        file,
        src,
        width: img.width,
        height: img.height,
        x: placeholder.x,
        y: placeholder.y,
        scale: fit.scale,
        rotation: placeholder.rotation,
        zIndex: placeholder.zIndex,
        placeholderId: placeholderId,
        offsetX: fit.offsetX,
        offsetY: fit.offsetY,
      };

      addImageWithPosition(newImage);

      return {
        success: true,
        image: newImage
      };
    } catch (error) {
      console.error('图片上传失败:', error);
      return {
        success: false,
        error: '图片上传失败'
      };
    }
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        resolve(src);
      };
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      reader.readAsDataURL(file);
    });
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
    });
  }
}

export class ImageTransformUseCase {
  execute(imageId: string, node: any, state: AppState): Partial<Image> {
    const originalImage = state.images.find(img => img.id === imageId);
    if (!originalImage) {
      return {};
    }

    const newScale = node.scaleX();

    return {
      x: node.x(),
      y: node.y(),
      scale: newScale,
      rotation: node.rotation()
    };
  }
}