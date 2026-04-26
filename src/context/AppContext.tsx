import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, ImageItem, CanvasConfig, LayoutConfig } from '../types';
import { DEFAULT_CANVAS_CONFIG, DEFAULT_LAYOUT_CONFIG } from '../utils/constants';

const initialState: AppState = {
  images: [],
  canvasConfig: DEFAULT_CANVAS_CONFIG,
  layoutConfig: DEFAULT_LAYOUT_CONFIG,
  selectedImageId: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return {
        ...state,
        images: [...state.images, { ...action.payload, zIndex: state.images.length }],
      };
    case 'REMOVE_IMAGE':
      return {
        ...state,
        images: state.images.filter(img => img.id !== action.payload),
        selectedImageId: state.selectedImageId === action.payload ? null : state.selectedImageId,
      };
    case 'UPDATE_IMAGE':
      return {
        ...state,
        images: state.images.map(img =>
          img.id === action.payload.id ? { ...img, ...action.payload } : img
        ),
      };
    case 'SET_CANVAS_CONFIG':
      return {
        ...state,
        canvasConfig: { ...state.canvasConfig, ...action.payload },
      };
    case 'SET_LAYOUT_CONFIG':
      return {
        ...state,
        layoutConfig: { ...state.layoutConfig, ...action.payload },
      };
    case 'SELECT_IMAGE':
      return {
        ...state,
        selectedImageId: action.payload,
      };
    case 'APPLY_LAYOUT':
      return {
        ...state,
        images: action.payload,
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addImage: (file: File, src: string, width: number, height: number) => void;
  removeImage: (id: string) => void;
  updateImage: (id: string, updates: Partial<ImageItem>) => void;
  setCanvasConfig: (config: Partial<CanvasConfig>) => void;
  setLayoutConfig: (config: Partial<LayoutConfig>) => void;
  selectImage: (id: string | null) => void;
  applyLayout: (images: ImageItem[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addImage = (file: File, src: string, width: number, height: number) => {
    dispatch({
      type: 'ADD_IMAGE',
      payload: {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        src,
        width,
        height,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        zIndex: 0,
      },
    });
  };

  const removeImage = (id: string) => {
    dispatch({ type: 'REMOVE_IMAGE', payload: id });
  };

  const updateImage = (id: string, updates: Partial<ImageItem>) => {
    dispatch({ type: 'UPDATE_IMAGE', payload: { id, ...updates } });
  };

  const setCanvasConfig = (config: Partial<CanvasConfig>) => {
    dispatch({ type: 'SET_CANVAS_CONFIG', payload: config });
  };

  const setLayoutConfig = (config: Partial<LayoutConfig>) => {
    dispatch({ type: 'SET_LAYOUT_CONFIG', payload: config });
  };

  const selectImage = (id: string | null) => {
    dispatch({ type: 'SELECT_IMAGE', payload: id });
  };

  const applyLayout = (images: ImageItem[]) => {
    dispatch({ type: 'APPLY_LAYOUT', payload: images });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addImage,
        removeImage,
        updateImage,
        setCanvasConfig,
        setLayoutConfig,
        selectImage,
        applyLayout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
