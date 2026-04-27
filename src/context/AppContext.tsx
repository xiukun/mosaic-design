import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, AppAction, ImageItem, CanvasConfig, LayoutConfig, Template } from '../types';
import { DEFAULT_CANVAS_CONFIG, DEFAULT_LAYOUT_CONFIG } from '../utils/constants';
import { templates, getTemplateCategories } from '../utils/templates';

const initialState: AppState = {
  images: [],
  canvasConfig: DEFAULT_CANVAS_CONFIG,
  layoutConfig: DEFAULT_LAYOUT_CONFIG,
  selectedImageId: null,
  templates: [],
  selectedTemplateId: null,
  templateCategories: [],
  isLoadingTemplates: false,
  favoriteTemplates: [],
  recentTemplates: [],
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return {
        ...state,
        images: [...state.images, { ...action.payload, zIndex: state.images.length + 10 }],
      };
    case 'ADD_IMAGE_WITH_POSITION':
      return {
        ...state,
        images: [...state.images, { ...action.payload }],
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
    case 'LOAD_TEMPLATES':
      return {
        ...state,
        templates: action.payload,
        templateCategories: getTemplateCategories(),
        isLoadingTemplates: false,
      };
    case 'SELECT_TEMPLATE':
      return {
        ...state,
        selectedTemplateId: action.payload,
      };
    case 'APPLY_TEMPLATE':
      return {
        ...state,
        canvasConfig: action.payload.canvasConfig,
        selectedTemplateId: action.payload.id,
      };
    case 'TOGGLE_FAVORITE_TEMPLATE':
      const isFavorite = state.favoriteTemplates.includes(action.payload);
      return {
        ...state,
        favoriteTemplates: isFavorite
          ? state.favoriteTemplates.filter(id => id !== action.payload)
          : [...state.favoriteTemplates, action.payload],
      };
    case 'ADD_RECENT_TEMPLATE':
      // 移除已存在的模板，然后添加到最前面
      const filteredRecent = state.recentTemplates.filter(id => id !== action.payload);
      return {
        ...state,
        recentTemplates: [action.payload, ...filteredRecent].slice(0, 10), // 只保留最近10个
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addImage: (file: File, src: string, width: number, height: number) => void;
  addImageWithPosition: (image: ImageItem) => void;
  removeImage: (id: string) => void;
  updateImage: (id: string, updates: Partial<ImageItem>) => void;
  setCanvasConfig: (config: Partial<CanvasConfig>) => void;
  setLayoutConfig: (config: Partial<LayoutConfig>) => void;
  selectImage: (id: string | null) => void;
  applyLayout: (images: ImageItem[]) => void;
  loadTemplates: () => void;
  selectTemplate: (id: string | null) => void;
  applyTemplate: (template: Template) => void;
  toggleFavoriteTemplate: (id: string) => void;
  addRecentTemplate: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 加载模板
  useEffect(() => {
    loadTemplates();
  }, []);

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
        zIndex: state.images.length + 10,
      },
    });
  };

  const addImageWithPosition = (image: ImageItem) => {
    dispatch({
      type: 'ADD_IMAGE_WITH_POSITION',
      payload: image,
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
    
    // 如果选择了图片，将其移动到最顶层
    if (id) {
      const maxZIndex = Math.max(...state.images.map(img => img.zIndex), 0);
      dispatch({
        type: 'UPDATE_IMAGE',
        payload: {
          id,
          zIndex: maxZIndex + 1
        }
      });
    }
  };

  const applyLayout = (images: ImageItem[]) => {
    dispatch({ type: 'APPLY_LAYOUT', payload: images });
  };

  const loadTemplates = () => {
    dispatch({ type: 'LOAD_TEMPLATES', payload: templates });
  };

  const selectTemplate = (id: string | null) => {
    dispatch({ type: 'SELECT_TEMPLATE', payload: id });
  };

  const applyTemplate = (template: Template) => {
    dispatch({ type: 'APPLY_TEMPLATE', payload: template });
    addRecentTemplate(template.id);
  };

  const toggleFavoriteTemplate = (id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE_TEMPLATE', payload: id });
  };

  const addRecentTemplate = (id: string) => {
    dispatch({ type: 'ADD_RECENT_TEMPLATE', payload: id });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addImage,
        addImageWithPosition,
        removeImage,
        updateImage,
        setCanvasConfig,
        setLayoutConfig,
        selectImage,
        applyLayout,
        loadTemplates,
        selectTemplate,
        applyTemplate,
        toggleFavoriteTemplate,
        addRecentTemplate,
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
