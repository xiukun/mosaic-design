import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Image {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

interface CanvasConfig {
  width: number;
  height: number;
  background: string;
}

interface LayoutConfig {
  type: 'grid' | 'masonry' | 'free';
  rows?: number;
  columns?: number;
  gap?: number;
}

interface AppState {
  images: Image[];
  canvasConfig: CanvasConfig;
  layoutConfig: LayoutConfig;
  selectedImageId: string | null;
}

type AppAction =
  | { type: 'ADD_IMAGE'; payload: Omit<Image, 'id' | 'zIndex'> }
  | { type: 'REMOVE_IMAGE'; payload: string }
  | { type: 'UPDATE_IMAGE'; payload: { id: string; updates: Partial<Image> } }
  | { type: 'SET_CANVAS_CONFIG'; payload: CanvasConfig }
  | { type: 'SET_LAYOUT_CONFIG'; payload: LayoutConfig }
  | { type: 'SELECT_IMAGE'; payload: string | null }
  | { type: 'APPLY_LAYOUT' };

const initialState: AppState = {
  images: [],
  canvasConfig: {
    width: 800,
    height: 600,
    background: '#ffffff',
  },
  layoutConfig: {
    type: 'free',
  },
  selectedImageId: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_IMAGE':
      const newImage: Image = {
        ...action.payload,
        id: `image-${Date.now()}`,
        zIndex: state.images.length + 1,
      };
      return {
        ...state,
        images: [...state.images, newImage],
        selectedImageId: newImage.id,
      };

    case 'REMOVE_IMAGE':
      return {
        ...state,
        images: state.images.filter(image => image.id !== action.payload),
        selectedImageId: state.selectedImageId === action.payload ? null : state.selectedImageId,
      };

    case 'UPDATE_IMAGE':
      return {
        ...state,
        images: state.images.map(image =>
          image.id === action.payload.id
            ? { ...image, ...action.payload.updates }
            : image
        ),
      };

    case 'SET_CANVAS_CONFIG':
      return {
        ...state,
        canvasConfig: action.payload,
      };

    case 'SET_LAYOUT_CONFIG':
      return {
        ...state,
        layoutConfig: action.payload,
      };

    case 'SELECT_IMAGE':
      return {
        ...state,
        selectedImageId: action.payload,
      };

    case 'APPLY_LAYOUT':
      if (state.layoutConfig.type === 'grid' && state.layoutConfig.rows && state.layoutConfig.columns) {
        const { rows, columns, gap = 10 } = state.layoutConfig;
        const cellWidth = (state.canvasConfig.width - (columns - 1) * gap) / columns;
        const cellHeight = (state.canvasConfig.height - (rows - 1) * gap) / rows;

        return {
          ...state,
          images: state.images.map((image, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            return {
              ...image,
              x: col * (cellWidth + gap),
              y: row * (cellHeight + gap),
              width: cellWidth,
              height: cellHeight,
              rotation: 0,
            };
          }),
        };
      }
      return state;

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  addImage: (image: Omit<Image, 'id' | 'zIndex'>) => void;
  removeImage: (id: string) => void;
  updateImage: (id: string, updates: Partial<Image>) => void;
  setCanvasConfig: (config: CanvasConfig) => void;
  setLayoutConfig: (config: LayoutConfig) => void;
  selectImage: (id: string | null) => void;
  applyLayout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addImage = (image: Omit<Image, 'id' | 'zIndex'>) => {
    dispatch({ type: 'ADD_IMAGE', payload: image });
  };

  const removeImage = (id: string) => {
    dispatch({ type: 'REMOVE_IMAGE', payload: id });
  };

  const updateImage = (id: string, updates: Partial<Image>) => {
    dispatch({ type: 'UPDATE_IMAGE', payload: { id, updates } });
  };

  const setCanvasConfig = (config: CanvasConfig) => {
    dispatch({ type: 'SET_CANVAS_CONFIG', payload: config });
  };

  const setLayoutConfig = (config: LayoutConfig) => {
    dispatch({ type: 'SET_LAYOUT_CONFIG', payload: config });
  };

  const selectImage = (id: string | null) => {
    dispatch({ type: 'SELECT_IMAGE', payload: id });
  };

  const applyLayout = () => {
    dispatch({ type: 'APPLY_LAYOUT' });
  };

  const value = {
    state,
    addImage,
    removeImage,
    updateImage,
    setCanvasConfig,
    setLayoutConfig,
    selectImage,
    applyLayout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
