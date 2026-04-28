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
  placeholderId?: string;
  offsetX?: number;
  offsetY?: number;
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
  borderRadius?: number;
}

export interface PlatformPreset {
  name: string;
  icon: string;
  width: number;
  height: number;
}

export interface TemplatePlaceholder {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
  rotation: number;
  zIndex: number;
}

export interface TemplateElement {
  id: string;
  type: 'text' | 'shape' | 'decoration';
  content: string;
  x: number;
  y: number;
  zIndex: number;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  isPopular: boolean;
  isNew: boolean;
  canvasConfig: CanvasConfig;
  placeholders: TemplatePlaceholder[];
  elements?: TemplateElement[];
}

export interface AppState {
  images: ImageItem[];
  canvasConfig: CanvasConfig;
  layoutConfig: LayoutConfig;
  selectedImageId: string | null;
  templates: Template[];
  selectedTemplateId: string | null;
  templateCategories: string[];
  isLoadingTemplates: boolean;
  favoriteTemplates: string[];
  recentTemplates: string[];
}

export type AppAction =
  | { type: 'ADD_IMAGE'; payload: ImageItem }
  | { type: 'ADD_IMAGE_WITH_POSITION'; payload: ImageItem }
  | { type: 'REMOVE_IMAGE'; payload: string }
  | { type: 'UPDATE_IMAGE'; payload: Partial<ImageItem> & { id: string } }
  | { type: 'SET_CANVAS_SIZE'; payload: { width: number; height: number } }
  | { type: 'SET_CANVAS_CONFIG'; payload: Partial<CanvasConfig> }
  | { type: 'SET_LAYOUT_CONFIG'; payload: Partial<LayoutConfig> }
  | { type: 'SELECT_IMAGE'; payload: string | null }
  | { type: 'APPLY_LAYOUT'; payload: ImageItem[] }
  | { type: 'LOAD_TEMPLATES'; payload: Template[] }
  | { type: 'SELECT_TEMPLATE'; payload: string | null }
  | { type: 'APPLY_TEMPLATE'; payload: Template }
  | { type: 'TOGGLE_FAVORITE_TEMPLATE'; payload: string }
  | { type: 'ADD_RECENT_TEMPLATE'; payload: string };