// 领域层：图片对齐核心算法

// 导入图片模型类型
import { ImageItem } from '../types';

// 占位符模型
export interface Placeholder {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
  rotation: number;
  zIndex: number;
}

// 图片位置计算结果
export interface ImagePosition {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

/**
 * 计算图片在占位符中的最佳位置和尺寸
 * 使用 cover 模式，确保图片完全覆盖占位符
 */
export function calculateImagePosition(image: Omit<ImageItem, 'x' | 'y' | 'scale' | 'zIndex' | 'rotation'>, placeholder: Placeholder): ImagePosition {
  // 计算缩放比例
  const scaleX = placeholder.width / image.width;
  const scaleY = placeholder.height / image.height;
  const scale = Math.max(scaleX, scaleY); // 使用较大的比例确保覆盖整个占位符

  // 计算缩放后的尺寸
  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;

  // 计算居中位置
  const x = placeholder.x + (placeholder.width - scaledWidth) / 2;
  const y = placeholder.y + (placeholder.height - scaledHeight) / 2;

  return {
    x,
    y,
    scale,
    width: scaledWidth,
    height: scaledHeight
  };
}

/**
 * 计算图片在占位符中的最佳位置和尺寸（fit 模式）
 * 确保图片完全适应占位符，保持原始宽高比
 */
export function calculateImagePositionFit(image: Omit<ImageItem, 'x' | 'y' | 'scale' | 'zIndex' | 'rotation'>, placeholder: Placeholder): ImagePosition {
  // 计算缩放比例
  const scaleX = placeholder.width / image.width;
  const scaleY = placeholder.height / image.height;
  const scale = Math.min(scaleX, scaleY); // 使用较小的比例确保图片完全适应占位符

  // 计算缩放后的尺寸
  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;

  // 计算居中位置
  const x = placeholder.x + (placeholder.width - scaledWidth) / 2;
  const y = placeholder.y + (placeholder.height - scaledHeight) / 2;

  return {
    x,
    y,
    scale,
    width: scaledWidth,
    height: scaledHeight
  };
}

/**
 * 生成唯一的图片ID
 */
export function generateImageId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 检查图片是否在占位符区域内
 */
export function isImageInPlaceholder(image: ImageItem, placeholder: Placeholder): boolean {
  const imgCenterX = image.x + (image.width * image.scale) / 2;
  const imgCenterY = image.y + (image.height * image.scale) / 2;
  const placeholderCenterX = placeholder.x + placeholder.width / 2;
  const placeholderCenterY = placeholder.y + placeholder.height / 2;
  
  // 检查中心点是否接近
  const xOverlap = Math.abs(imgCenterX - placeholderCenterX) < placeholder.width / 2;
  const yOverlap = Math.abs(imgCenterY - placeholderCenterY) < placeholder.height / 2;
  
  return xOverlap && yOverlap;
}