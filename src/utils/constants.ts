import { PlatformPreset, CanvasConfig, LayoutConfig } from '../types';

export const PLATFORM_PRESETS: PlatformPreset[] = [
  { name: '小红书-竖屏', icon: '📕', width: 1080, height: 1440 },
  { name: '小红书-方形', icon: '📕', width: 1080, height: 1080 },
  { name: '小红书-横屏', icon: '📕', width: 1440, height: 1080 },
  { name: '抖音-竖屏', icon: '🎵', width: 1080, height: 1920 },
  { name: '抖音-横屏', icon: '🎵', width: 1920, height: 1080 },
];

export const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  width: 1080,
  height: 1080,
  backgroundColor: '#ffffff',
  backgroundBlur: 0,
  borderColor: '#e2e8f0',
  borderWidth: 0,
  borderRadius: 0,
  shadowColor: 'rgba(0,0,0,0.1)',
  shadowBlur: 10,
  shadowOffsetX: 0,
  shadowOffsetY: 4,
};

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  type: 'grid',
  gridRows: 2,
  gridCols: 2,
  spacing: 10,
};

export const LAYOUT_TYPES = [
  { type: 'grid', name: '网格布局', icon: '⊞' },
  { type: 'mosaic', name: '马赛克布局', icon: '🖼️' },
  { type: 'free', name: '自由拼接', icon: '✂️' },
];