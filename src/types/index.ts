export interface ImageItem {
  id: string;
  file: File;
  src: string;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundBlur: number;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export interface LayoutConfig {
  type: 'grid' | 'mosaic' | 'free';
  gridRows?: number;
  gridCols?: number;
  spacing?: number;
}

export interface PlatformPreset {
  name: string;
  icon: string;
  width: number;
  height: number;
}

export interface AppState {
  images: ImageItem[];
  canvasConfig: CanvasConfig;
  layoutConfig: LayoutConfig;
  selectedImageId: string | null;
}

export type AppAction =
  | { type: 'ADD_IMAGE'; payload: ImageItem }
  | { type: 'REMOVE_IMAGE'; payload: string }
  | { type: 'UPDATE_IMAGE'; payload: Partial<ImageItem> & { id: string } }
  | { type: 'SET_CANVAS_CONFIG'; payload: Partial<CanvasConfig> }
  | { type: 'SET_LAYOUT_CONFIG'; payload: Partial<LayoutConfig> }
  | { type: 'SELECT_IMAGE'; payload: string | null }
  | { type: 'APPLY_LAYOUT'; payload: ImageItem[] };