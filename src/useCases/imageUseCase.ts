// 应用层：图片上传和对齐业务逻辑

import { calculateImagePosition, generateImageId } from '../domain/imageAlignment';
import { getTemplateById } from '../utils/templates';
import { AppState, ImageItem } from '../types';

type Image = ImageItem;

// 图片上传请求
export interface UploadImageRequest {
  file: File;
  placeholderId: string;
  state: AppState;
  addImageWithPosition: (image: Image) => void;
}

// 图片上传响应
export interface UploadImageResponse {
  success: boolean;
  image?: Image;
  error?: string;
}

/**
 * 处理图片上传和对齐的业务逻辑
 */
export class ImageUploadUseCase {
  /**
   * 执行图片上传和对齐
   */
  async execute(request: UploadImageRequest): Promise<UploadImageResponse> {
    try {
      const { file, placeholderId, state, addImageWithPosition } = request;

      // 读取图片文件
      const src = await this.readFileAsDataURL(file);
      
      // 加载图片以获取尺寸
      const img = await this.loadImage(src);

      // 获取模板和占位符
      const template = state.selectedTemplateId ? getTemplateById(state.selectedTemplateId) : null;
      const placeholder = template?.placeholders.find(p => p.id === placeholderId);
      
      if (!placeholder) {
        return {
          success: false,
          error: '占位符不存在'
        };
      }

      // 生成唯一的图片ID
      const imageId = generateImageId();

      // 计算图片位置和尺寸
      // 使用 cover 模式确保图片完全覆盖占位符
      const imagePosition = calculateImagePosition(
        {
          id: imageId,
          file,
          src,
          width: img.width,
          height: img.height
        },
        placeholder
      );

      // 创建新图片对象
      const newImage: Image = {
        id: imageId,
        file,
        src,
        width: img.width,
        height: img.height,
        x: imagePosition.x,
        y: imagePosition.y,
        scale: imagePosition.scale,
        rotation: placeholder.rotation,
        zIndex: 10 + state.images.length // 确保图片在占位符之上
      };

      // 添加图片到状态
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

  /**
   * 读取文件为DataURL
   */
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

  /**
   * 加载图片以获取尺寸
   */
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

/**
 * 处理图片变换的业务逻辑
 */
export class ImageTransformUseCase {
  /**
   * 计算变换后的图片状态
   */
  execute(imageId: string, node: any, state: AppState): Partial<Image> {
    const originalImage = state.images.find(img => img.id === imageId);
    if (!originalImage) {
      return {};
    }

    // 直接使用 node 的 scaleX 属性
    const newScale = node.scaleX();

    return {
      x: node.x(),
      y: node.y(),
      scale: newScale,
      rotation: node.rotation()
    };
  }
}