# 拼接图设计器 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于React + Tailwind CSS + react-konva的图片拼接设计器，支持多种自动布局、背景调优和社交媒体分享功能

**Architecture:** 单页应用 + 客户端Canvas处理，使用Context API进行状态管理，组件化架构

**Tech Stack:** React 18, Vite, Tailwind CSS, react-konva, Cloudflare Pages

---

## 文件结构映射

```
mosaic-design/
├── src/
│   ├── components/
│   │   ├── CanvasEditor/
│   │   │   ├── index.tsx
│   │   │   └── CanvasEditor.tsx
│   │   ├── ImageUploader/
│   │   │   ├── index.tsx
│   │   │   └── ImageUploader.tsx
│   │   ├── LayoutSelector/
│   │   │   ├── index.tsx
│   │   │   └── LayoutSelector.tsx
│   │   ├── BackgroundControls/
│   │   │   ├── index.tsx
│   │   │   └── BackgroundControls.tsx
│   │   ├── EffectControls/
│   │   │   ├── index.tsx
│   │   │   └── EffectControls.tsx
│   │   ├── PlatformSelector/
│   │   │   ├── index.tsx
│   │   │   └── PlatformSelector.tsx
│   │   ├── Toolbar/
│   │   │   ├── index.tsx
│   │   │   └── Toolbar.tsx
│   │   └── Sidebar/
│   │       ├── index.tsx
│   │       ├── LeftSidebar.tsx
│   │       └── RightSidebar.tsx
│   ├── hooks/
│   │   ├── useImageUpload.ts
│   │   ├── useMosaicLayout.ts
│   │   ├── useGridLayout.ts
│   │   └── useExport.ts
│   ├── utils/
│   │   ├── imageProcessor.ts
│   │   ├── layoutAlgorithms.ts
│   │   └── constants.ts
│   ├── context/
│   │   └── AppContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md
```

---

## 实施任务

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

- [ ] **Step 1: 初始化Vite项目配置**

```bash
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: 安装依赖**

```bash
npm install
npm install konva react-konva
npm install -D tailwindcss postcss autoprefixer
```

- [ ] **Step 3: 初始化Tailwind配置**

```bash
npx tailwindcss init -p
```

- [ ] **Step 4: 配置tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      borderRadius: {
        'xl': '16px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: 创建src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-slate-800;
  }
}

@layer components {
  .card {
    @apply bg-white rounded-xl shadow-sm border border-slate-100;
  }
  
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
  }
  
  .btn-primary {
    @apply btn bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg;
  }
  
  .btn-secondary {
    @apply btn bg-slate-100 text-slate-700 hover:bg-slate-200;
  }
  
  .input {
    @apply w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500;
  }
}
```

- [ ] **Step 6: 创建基础App.tsx**

```tsx
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold text-center py-8">拼接图设计器</h1>
    </div>
  );
};

export default App;
```

- [ ] **Step 7: 创建main.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 8: 测试项目是否能正常运行**

```bash
npm run dev
```

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: init project with React + Vite + Tailwind"
```

---

### Task 2: 类型定义和常量

**Files:**
- Create: `src/types/index.ts`
- Create: `src/utils/constants.ts`

- [ ] **Step 1: 创建类型定义**

```typescript
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
```

- [ ] **Step 2: 创建常量文件**

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts src/utils/constants.ts
git commit -m "feat: add types and constants"
```

---

### Task 3: 应用状态管理

**Files:**
- Create: `src/context/AppContext.tsx`

- [ ] **Step 1: 创建AppContext**

```tsx
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
```

- [ ] **Step 2: 更新main.tsx，添加AppProvider**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
```

- [ ] **Step 3: Commit**

```bash
git add src/context/AppContext.tsx src/main.tsx
git commit -m "feat: add app state management with context"
```

---

### Task 4: 图片上传Hook

**Files:**
- Create: `src/hooks/useImageUpload.ts`

- [ ] **Step 1: 创建useImageUpload Hook**

```typescript
import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export const useImageUpload = () => {
  const { addImage } = useApp();
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      console.warn('Only image files are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        addImage(file, img.src, img.width, img.height);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [addImage]);

  const handleFiles = useCallback((files: FileList) => {
    Array.from(files).forEach(processFile);
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFiles,
  };
};
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useImageUpload.ts
git commit -m "feat: add image upload hook"
```

---

### Task 5: 图片上传组件

**Files:**
- Create: `src/components/ImageUploader/ImageUploader.tsx`
- Create: `src/components/ImageUploader/index.tsx`

- [ ] **Step 1: 创建ImageUploader组件**

```tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';

const ImageUploader: React.FC = () => {
  const { state, removeImage } = useApp();
  const { isDragging, handleDrop, handleDragOver, handleDragLeave, handleFiles } = useImageUpload();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="p-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="text-4xl mb-2">📷</div>
        <p className="text-slate-600 font-medium">拖拽图片或点击上传</p>
        <p className="text-slate-400 text-sm mt-1">支持 JPG, PNG, GIF 格式</p>
      </div>

      {state.images.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-slate-700 mb-3">已上传 ({state.images.length})</h3>
          <div className="grid grid-cols-2 gap-3">
            {state.images.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.src}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-lg shadow-sm"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
```

- [ ] **Step 2: 创建导出文件**

```typescript
export { default } from './ImageUploader';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ImageUploader/ImageUploader.tsx src/components/ImageUploader/index.tsx
git commit -m "feat: add image uploader component"
```

---

### Task 6: 网格布局算法

**Files:**
- Create: `src/utils/layoutAlgorithms.ts`
- Create: `src/hooks/useGridLayout.ts`

- [ ] **Step 1: 创建布局算法工具**

```typescript
import { ImageItem } from '../types';

export interface GridLayoutOptions {
  width: number;
  height: number;
  rows: number;
  cols: number;
  spacing: number;
}

export const calculateGridLayout = (
  images: ImageItem[],
  options: GridLayoutOptions
): ImageItem[] => {
  const { width, height, rows, cols, spacing } = options;
  const totalSpacingX = (cols - 1) * spacing;
  const totalSpacingY = (rows - 1) * spacing;
  const cellWidth = (width - totalSpacingX) / cols;
  const cellHeight = (height - totalSpacingY) / rows;

  return images.map((img, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    if (row >= rows || col >= cols) return img;

    const x = col * (cellWidth + spacing);
    const y = row * (cellHeight + spacing);

    const imgRatio = img.width / img.height;
    const cellRatio = cellWidth / cellHeight;

    let scaleWidth, scaleHeight;
    if (imgRatio > cellRatio) {
      scaleWidth = cellWidth;
      scaleHeight = cellWidth / imgRatio;
    } else {
      scaleHeight = cellHeight;
      scaleWidth = cellHeight * imgRatio;
    }

    const offsetX = (cellWidth - scaleWidth) / 2;
    const offsetY = (cellHeight - scaleHeight) / 2;

    return {
      ...img,
      x: x + offsetX,
      y: y + offsetY,
      scale: Math.min(scaleWidth / img.width, scaleHeight / img.height),
    };
  });
};
```

- [ ] **Step 2: 创建useGridLayout Hook**

```typescript
import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { calculateGridLayout } from '../utils/layoutAlgorithms';

export const useGridLayout = () => {
  const { state, applyLayout } = useApp();

  const applyGridLayout = useCallback(() => {
    if (state.images.length === 0) return;

    const { width, height } = state.canvasConfig;
    const { gridRows = 2, gridCols = 2, spacing = 10 } = state.layoutConfig;

    const layoutImages = calculateGridLayout(state.images, {
      width,
      height,
      rows: gridRows,
      cols: gridCols,
      spacing,
    });

    applyLayout(layoutImages);
  }, [state, applyLayout]);

  return {
    applyGridLayout,
  };
};
```

- [ ] **Step 3: Commit**

```bash
git add src/utils/layoutAlgorithms.ts src/hooks/useGridLayout.ts
git commit -m "feat: add grid layout algorithm"
```

---

### Task 7: Canvas编辑器组件

**Files:**
- Create: `src/components/CanvasEditor/CanvasEditor.tsx`
- Create: `src/components/CanvasEditor/index.tsx`

- [ ] **Step 1: 创建CanvasEditor组件**

```tsx
import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Transformer } from 'react-konva';
import { useApp } from '../../context/AppContext';
import { useGridLayout } from '../../hooks/useGridLayout';

const CanvasEditor: React.FC = () => {
  const { state, updateImage, selectImage } = useApp();
  const { applyGridLayout } = useGridLayout();
  const imageRefs = useRef<{ [key: string]: any }>({});
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (state.images.length > 0 && state.layoutConfig.type === 'grid') {
      applyGridLayout();
    }
  }, [state.images.length, state.layoutConfig.type]);

  useEffect(() => {
    if (trRef.current && state.selectedImageId) {
      const nodes = [imageRefs.current[state.selectedImageId]];
      trRef.current.nodes(nodes);
      trRef.current.getLayer()?.batchDraw();
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [state.selectedImageId]);

  const handleImageClick = (e: any, id: string) => {
    e.cancelBubble = true;
    selectImage(id);
  };

  const handleStageClick = () => {
    selectImage(null);
  };

  const handleTransformEnd = (e: any, id: string) => {
    const node = e.target;
    updateImage(id, {
      x: node.x(),
      y: node.y(),
      scale: node.scaleX(),
      rotation: node.rotation(),
    });
  };

  const { canvasConfig, images } = state;
  const scale = Math.min(600 / canvasConfig.width, 400 / canvasConfig.height, 1);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-100 min-h-full">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <Stage
          width={canvasConfig.width * scale}
          height={canvasConfig.height * scale}
          scaleX={scale}
          scaleY={scale}
          onClick={handleStageClick}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              width={canvasConfig.width}
              height={canvasConfig.height}
              fill={canvasConfig.backgroundColor}
              cornerRadius={canvasConfig.borderRadius}
              stroke={canvasConfig.borderColor}
              strokeWidth={canvasConfig.borderWidth}
              shadowColor={canvasConfig.shadowColor}
              shadowBlur={canvasConfig.shadowBlur}
              shadowOffsetX={canvasConfig.shadowOffsetX}
              shadowOffsetY={canvasConfig.shadowOffsetY}
            />
            {images.map((img) => {
              const konvaImg = new window.Image();
              konvaImg.src = img.src;
              
              return (
                <KonvaImage
                  key={img.id}
                  ref={(node) => {
                    if (node) imageRefs.current[img.id] = node;
                  }}
                  image={konvaImg}
                  x={img.x}
                  y={img.y}
                  width={img.width}
                  height={img.height}
                  scaleX={img.scale}
                  scaleY={img.scale}
                  rotation={img.rotation}
                  draggable={state.layoutConfig.type === 'free'}
                  onClick={(e) => handleImageClick(e, img.id)}
                  onTransformEnd={(e) => handleTransformEnd(e, img.id)}
                  zIndex={img.zIndex}
                />
              );
            })}
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => newBox}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CanvasEditor;
```

- [ ] **Step 2: 创建导出文件**

```typescript
export { default } from './CanvasEditor';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CanvasEditor/CanvasEditor.tsx src/components/CanvasEditor/index.tsx
git commit -m "feat: add canvas editor component"
```

---

### Task 8: 布局选择组件

**Files:**
- Create: `src/components/LayoutSelector/LayoutSelector.tsx`
- Create: `src/components/LayoutSelector/index.tsx`

- [ ] **Step 1: 创建LayoutSelector组件**

```tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { useGridLayout } from '../../hooks/useGridLayout';
import { LAYOUT_TYPES } from '../../utils/constants';

const LayoutSelector: React.FC = () => {
  const { state, setLayoutConfig } = useApp();
  const { applyGridLayout } = useGridLayout();

  const handleLayoutChange = (type: 'grid' | 'mosaic' | 'free') => {
    setLayoutConfig({ type });
    if (type === 'grid') {
      setTimeout(applyGridLayout, 0);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h3 className="font-semibold text-slate-700 mb-3">布局选择</h3>
      <div className="grid grid-cols-3 gap-2">
        {LAYOUT_TYPES.map((layout) => (
          <button
            key={layout.type}
            onClick={() => handleLayoutChange(layout.type as any)}
            className={`
              p-3 rounded-lg text-center transition-all
              ${state.layoutConfig.type === layout.type
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
            `}
          >
            <div className="text-2xl mb-1">{layout.icon}</div>
            <div className="text-sm">{layout.name}</div>
          </button>
        ))}
      </div>

      {state.layoutConfig.type === 'grid' && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">行数</label>
            <input
              type="number"
              min="1"
              max="10"
              value={state.layoutConfig.gridRows}
              onChange={(e) => {
                setLayoutConfig({ gridRows: parseInt(e.target.value) || 2 });
                setTimeout(applyGridLayout, 0);
              }}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">列数</label>
            <input
              type="number"
              min="1"
              max="10"
              value={state.layoutConfig.gridCols}
              onChange={(e) => {
                setLayoutConfig({ gridCols: parseInt(e.target.value) || 2 });
                setTimeout(applyGridLayout, 0);
              }}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              间距: {state.layoutConfig.spacing}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={state.layoutConfig.spacing}
              onChange={(e) => {
                setLayoutConfig({ spacing: parseInt(e.target.value) || 10 });
                setTimeout(applyGridLayout, 0);
              }}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutSelector;
```

- [ ] **Step 2: 创建导出文件**

```typescript
export { default } from './LayoutSelector';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LayoutSelector/LayoutSelector.tsx src/components/LayoutSelector/index.tsx
git commit -m "feat: add layout selector component"
```

---

### Task 9: 背景控制组件

**Files:**
- Create: `src/components/BackgroundControls/BackgroundControls.tsx`
- Create: `src/components/BackgroundControls/index.tsx`

- [ ] **Step 1: 创建BackgroundControls组件**

```tsx
import React from 'react';
import { useApp } from '../../context/AppContext';

const BackgroundControls: React.FC = () => {
  const { state, setCanvasConfig } = useApp();

  return (
    <div className="card p-4 mb-4">
      <h3 className="font-semibold text-slate-700 mb-3">背景设置</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">背景颜色</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={state.canvasConfig.backgroundColor}
              onChange={(e) => setCanvasConfig({ backgroundColor: e.target.value })}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={state.canvasConfig.backgroundColor}
              onChange={(e) => setCanvasConfig({ backgroundColor: e.target.value })}
              className="input flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            背景模糊: {state.canvasConfig.backgroundBlur}px
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={state.canvasConfig.backgroundBlur}
            onChange={(e) => setCanvasConfig({ backgroundBlur: parseInt(e.target.value) || 0 })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">圆角</label>
          <input
            type="range"
            min="0"
            max="50"
            value={state.canvasConfig.borderRadius}
            onChange={(e) => setCanvasConfig({ borderRadius: parseInt(e.target.value) || 0 })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundControls;
```

- [ ] **Step 2: 创建导出文件**

```typescript
export { default } from './BackgroundControls';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/BackgroundControls/BackgroundControls.tsx src/components/BackgroundControls/index.tsx
git commit -m "feat: add background controls component"
```

---

### Task 10: 平台选择组件

**Files:**
- Create: `src/components/PlatformSelector/PlatformSelector.tsx`
- Create: `src/components/PlatformSelector/index.tsx`

- [ ] **Step 1: 创建PlatformSelector组件**

```tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { PLATFORM_PRESETS } from '../../utils/constants';

const PlatformSelector: React.FC = () => {
  const { state, setCanvasConfig } = useApp();

  const handlePresetSelect = (width: number, height: number) => {
    setCanvasConfig({ width, height });
  };

  return (
    <div className="card p-4 mb-4">
      <h3 className="font-semibold text-slate-700 mb-3">平台预设</h3>
      
      <div className="space-y-2 mb-4">
        {PLATFORM_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetSelect(preset.width, preset.height)}
            className={`
              w-full p-3 rounded-lg text-left transition-all flex items-center gap-3
              ${state.canvasConfig.width === preset.width && state.canvasConfig.height === preset.height
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'}
            `}
          >
            <span className="text-2xl">{preset.icon}</span>
            <div>
              <div className="font-medium text-slate-700">{preset.name}</div>
              <div className="text-sm text-slate-500">{preset.width} × {preset.height}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-sm font-medium text-slate-600 mb-3">自定义尺寸</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">宽度</label>
            <input
              type="number"
              min="200"
              max="4000"
              value={state.canvasConfig.width}
              onChange={(e) => setCanvasConfig({ width: parseInt(e.target.value) || 1080 })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">高度</label>
            <input
              type="number"
              min="200"
              max="4000"
              value={state.canvasConfig.height}
              onChange={(e) => setCanvasConfig({ height: parseInt(e.target.value) || 1080 })}
              className="input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelector;
```

- [ ] **Step 2: 创建导出文件**

```typescript
export { default } from './PlatformSelector';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PlatformSelector/PlatformSelector.tsx src/components/PlatformSelector/index.tsx
git commit -m "feat: add platform selector component"
```

---

### Task 11: 工具栏组件

**Files:**
- Create: `src/components/Toolbar/Toolbar.tsx`
- Create: `src/components/Toolbar/index.tsx`
- Create: `src/hooks/useExport.ts`

- [ ] **Step 1: 创建useExport Hook**

```typescript
import { useCallback } from 'react';
import { useApp } from '../context/AppContext';

export const useExport = () => {
  const { state } = useApp();

  const exportAsImage = useCallback((format: 'png' | 'jpeg' = 'png', quality = 0.9) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = state.canvasConfig.width;
    canvas.height = state.canvasConfig.height;

    ctx.fillStyle = state.canvasConfig.backgroundColor;
    ctx.beginPath();
    if (state.canvasConfig.borderRadius > 0) {
      ctx.roundRect(0, 0, canvas.width, canvas.height, state.canvasConfig.borderRadius);
    } else {
      ctx.rect(0, 0, canvas.width, canvas.height);
    }
    ctx.fill();

    if (state.canvasConfig.borderWidth > 0) {
      ctx.strokeStyle = state.canvasConfig.borderColor;
      ctx.lineWidth = state.canvasConfig.borderWidth;
      ctx.stroke();
    }

    const imagesToLoad = state.images.length;
    let loadedCount = 0;

    state.images.forEach((img) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        ctx.save();
        ctx.translate(img.x + (img.width * img.scale) / 2, img.y + (img.height * img.scale) / 2);
        ctx.rotate((img.rotation * Math.PI) / 180);
        ctx.scale(img.scale, img.scale);
        ctx.drawImage(image, -img.width / 2, -img.height / 2);
        ctx.restore();

        loadedCount++;
        if (loadedCount === imagesToLoad) {
          const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(mimeType, quality);
          
          const link = document.createElement('a');
          link.download = `mosaic-design-${Date.now()}.${format}`;
          link.href = dataUrl;
          link.click();
        }
      };
      image.src = img.src;
    });

    if (state.images.length === 0) {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      const link = document.createElement('a');
      link.download = `mosaic-design-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    }
  }, [state]);

  return {
    exportAsImage,
  };
};
```

- [ ] **Step 2: 创建Toolbar组件**

```tsx
import React from 'react';
import { useExport } from '../../hooks/useExport';

const Toolbar: React.FC = () => {
  const { exportAsImage } = useExport();

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-2xl">🎨</div>
        <h1 className="text-xl font-bold text-slate-800">拼接图设计器</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => exportAsImage('png')}
          className="btn-secondary flex items-center gap-2"
        >
          <span>📥</span>
          <span>导出 PNG</span>
        </button>
        <button
          onClick={() => exportAsImage('jpeg', 0.9)}
          className="btn-primary flex items-center gap-2"
        >
          <span>📤</span>
          <span>导出 JPG</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
```

- [ ] **Step 3: 创建导出文件**

```typescript
export { default } from './Toolbar';
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useExport.ts src/components/Toolbar/Toolbar.tsx src/components/Toolbar/index.tsx
git commit -m "feat: add toolbar and export functionality"
```

---

### Task 12: 侧边栏组件和主界面

**Files:**
- Create: `src/components/Sidebar/LeftSidebar.tsx`
- Create: `src/components/Sidebar/RightSidebar.tsx`
- Create: `src/components/Sidebar/index.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 创建LeftSidebar组件**

```tsx
import React from 'react';
import ImageUploader from '../ImageUploader';

const LeftSidebar: React.FC = () => {
  return (
    <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-700">图片管理</h2>
      </div>
      <ImageUploader />
    </div>
  );
};

export default LeftSidebar;
```

- [ ] **Step 2: 创建RightSidebar组件**

```tsx
import React from 'react';
import LayoutSelector from '../LayoutSelector';
import BackgroundControls from '../BackgroundControls';
import PlatformSelector from '../PlatformSelector';

const RightSidebar: React.FC = () => {
  return (
    <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
      <div className="p-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-700">属性设置</h2>
      </div>
      <div className="p-4">
        <PlatformSelector />
        <LayoutSelector />
        <BackgroundControls />
      </div>
    </div>
  );
};

export default RightSidebar;
```

- [ ] **Step 3: 创建Sidebar导出文件**

```typescript
export { default as LeftSidebar } from './LeftSidebar';
export { default as RightSidebar } from './RightSidebar';
```

- [ ] **Step 4: 更新App.tsx**

```tsx
import React from 'react';
import Toolbar from './components/Toolbar';
import CanvasEditor from './components/CanvasEditor';
import { LeftSidebar, RightSidebar } from './components/Sidebar';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 overflow-auto">
          <CanvasEditor />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default App;
```

- [ ] **Step 5: 测试运行应用**

```bash
npm run dev
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Sidebar/LeftSidebar.tsx src/components/Sidebar/RightSidebar.tsx src/components/Sidebar/index.tsx src/App.tsx
git commit -m "feat: complete main app layout and components"
```

---

### Task 13: 马赛克布局算法

**Files:**
- Modify: `src/utils/layoutAlgorithms.ts`
- Create: `src/hooks/useMosaicLayout.ts`
- Modify: `src/components/LayoutSelector/LayoutSelector.tsx`

- [ ] **Step 1: 添加马赛克布局算法**

```typescript
import { ImageItem } from '../types';

export interface GridLayoutOptions {
  width: number;
  height: number;
  rows: number;
  cols: number;
  spacing: number;
}

export interface MosaicLayoutOptions {
  width: number;
  height: number;
  spacing: number;
}

export const calculateGridLayout = (
  images: ImageItem[],
  options: GridLayoutOptions
): ImageItem[] => {
  const { width, height, rows, cols, spacing } = options;
  const totalSpacingX = (cols - 1) * spacing;
  const totalSpacingY = (rows - 1) * spacing;
  const cellWidth = (width - totalSpacingX) / cols;
  const cellHeight = (height - totalSpacingY) / rows;

  return images.map((img, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    if (row >= rows || col >= cols) return img;

    const x = col * (cellWidth + spacing);
    const y = row * (cellHeight + spacing);

    const imgRatio = img.width / img.height;
    const cellRatio = cellWidth / cellHeight;

    let scaleWidth, scaleHeight;
    if (imgRatio > cellRatio) {
      scaleWidth = cellWidth;
      scaleHeight = cellWidth / imgRatio;
    } else {
      scaleHeight = cellHeight;
      scaleWidth = cellHeight * imgRatio;
    }

    const offsetX = (cellWidth - scaleWidth) / 2;
    const offsetY = (cellHeight - scaleHeight) / 2;

    return {
      ...img,
      x: x + offsetX,
      y: y + offsetY,
      scale: Math.min(scaleWidth / img.width, scaleHeight / img.height),
    };
  });
};

export const calculateMosaicLayout = (
  images: ImageItem[],
  options: MosaicLayoutOptions
): ImageItem[] => {
  const { width, height, spacing } = options;
  const result = [...images];
  const usedAreas: { x: number; y: number; w: number; h: number }[] = [];

  const tryPlace = (x: number, y: number, w: number, h: number): boolean => {
    if (x + w > width || y + h > height) return false;
    for (const area of usedAreas) {
      if (x < area.x + area.w && x + w > area.x && y < area.y + area.h && y + h > area.y) {
        return false;
      }
    }
    return true;
  };

  const sortedImages = [...images].sort((a, b) => (b.width * b.height) - (a.width * a.height));

  for (const img of sortedImages) {
    const maxSize = Math.min(width * 0.5, height * 0.5);
    const scale = Math.min(maxSize / img.width, maxSize / img.height);
    const imgW = img.width * scale;
    const imgH = img.height * scale;

    let placed = false;
    for (let x = spacing; x < width - imgW - spacing && !placed; x += 20) {
      for (let y = spacing; y < height - imgH - spacing && !placed; y += 20) {
        if (tryPlace(x, y, imgW, imgH)) {
          const index = result.findIndex(i => i.id === img.id);
          if (index !== -1) {
            result[index] = {
              ...result[index],
              x,
              y,
              scale,
            };
          }
          usedAreas.push({ x, y, w: imgW, h: imgH });
          placed = true;
        }
      }
    }

    if (!placed) {
      const randX = spacing + Math.random() * (width - imgW - spacing * 2);
      const randY = spacing + Math.random() * (height - imgH - spacing * 2);
      const index = result.findIndex(i => i.id === img.id);
      if (index !== -1) {
        result[index] = {
          ...result[index],
          x: randX,
          y: randY,
          scale,
        };
      }
    }
  }

  return result;
};
```

- [ ] **Step 2: 创建useMosaicLayout Hook**

```typescript
import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMosaicLayout } from '../utils/layoutAlgorithms';

export const useMosaicLayout = () => {
  const { state, applyLayout } = useApp();

  const applyMosaicLayout = useCallback(() => {
    if (state.images.length === 0) return;

    const { width, height } = state.canvasConfig;
    const { spacing = 10 } = state.layoutConfig;

    const layoutImages = calculateMosaicLayout(state.images, {
      width,
      height,
      spacing,
    });

    applyLayout(layoutImages);
  }, [state, applyLayout]);

  return {
    applyMosaicLayout,
  };
};
```

- [ ] **Step 3: 更新LayoutSelector组件，添加马赛克布局支持**

```tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { useGridLayout } from '../../hooks/useGridLayout';
import { useMosaicLayout } from '../../hooks/useMosaicLayout';
import { LAYOUT_TYPES } from '../../utils/constants';

const LayoutSelector: React.FC = () => {
  const { state, setLayoutConfig } = useApp();
  const { applyGridLayout } = useGridLayout();
  const { applyMosaicLayout } = useMosaicLayout();

  const handleLayoutChange = (type: 'grid' | 'mosaic' | 'free') => {
    setLayoutConfig({ type });
    if (type === 'grid') {
      setTimeout(applyGridLayout, 0);
    } else if (type === 'mosaic') {
      setTimeout(applyMosaicLayout, 0);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h3 className="font-semibold text-slate-700 mb-3">布局选择</h3>
      <div className="grid grid-cols-3 gap-2">
        {LAYOUT_TYPES.map((layout) => (
          <button
            key={layout.type}
            onClick={() => handleLayoutChange(layout.type as any)}
            className={`
              p-3 rounded-lg text-center transition-all
              ${state.layoutConfig.type === layout.type
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
            `}
          >
            <div className="text-2xl mb-1">{layout.icon}</div>
            <div className="text-sm">{layout.name}</div>
          </button>
        ))}
      </div>

      {state.layoutConfig.type === 'grid' && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">行数</label>
            <input
              type="number"
              min="1"
              max="10"
              value={state.layoutConfig.gridRows}
              onChange={(e) => {
                setLayoutConfig({ gridRows: parseInt(e.target.value) || 2 });
                setTimeout(applyGridLayout, 0);
              }}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">列数</label>
            <input
              type="number"
              min="1"
              max="10"
              value={state.layoutConfig.gridCols}
              onChange={(e) => {
                setLayoutConfig({ gridCols: parseInt(e.target.value) || 2 });
                setTimeout(applyGridLayout, 0);
              }}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              间距: {state.layoutConfig.spacing}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={state.layoutConfig.spacing}
              onChange={(e) => {
                setLayoutConfig({ spacing: parseInt(e.target.value) || 10 });
                if (state.layoutConfig.type === 'grid') {
                  setTimeout(applyGridLayout, 0);
                } else if (state.layoutConfig.type === 'mosaic') {
                  setTimeout(applyMosaicLayout, 0);
                }
              }}
              className="w-full"
            />
          </div>
        </div>
      )}

      {state.layoutConfig.type === 'mosaic' && (
        <div className="mt-4">
          <button
            onClick={applyMosaicLayout}
            className="btn-secondary w-full"
          >
            🔄 重新生成马赛克布局
          </button>
        </div>
      )}
    </div>
  );
};

export default LayoutSelector;
```

- [ ] **Step 4: Commit**

```bash
git add src/utils/layoutAlgorithms.ts src/hooks/useMosaicLayout.ts src/components/LayoutSelector/LayoutSelector.tsx
git commit -m "feat: add mosaic layout algorithm"
```

---

### Task 14: 创建README和项目文档

**Files:**
- Create: `README.md`

- [ ] **Step 1: 创建README.md**

```markdown
# 拼接图设计器

一个基于React + Tailwind CSS + react-konva的图片拼接设计器，支持多种自动布局、背景调优和社交媒体分享功能。

## 功能特性

- 📷 多图片上传和管理
- 🎨 三种布局方式：
  - 网格布局（可配置行列数）
  - 马赛克布局（艺术化自动布局）
  - 自由拼接（拖拽调整）
- 🌈 背景调优：
  - 背景颜色选择
  - 圆角调整
  - 背景模糊
- 📱 平台预设：
  - 小红书（竖屏/方形/横屏）
  - 抖音（竖屏/横屏）
- 📤 导出功能：
  - PNG格式
  - JPG格式（可调节质量）

## 技术栈

- React 18
- Vite
- Tailwind CSS
- react-konva (Canvas渲染)
- TypeScript

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署

项目可直接部署到 Cloudflare Pages：

```bash
# 构建项目
npm run build

# 使用 wrangler 部署
npm install -g wrangler
wrangler pages deploy dist
```

## 使用说明

1. 点击或拖拽上传图片
2. 选择平台预设或自定义尺寸
3. 选择布局方式
4. 调整背景设置
5. 导出为图片分享

## 项目结构

```
src/
├── components/          # React组件
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
├── context/            # Context状态管理
├── types/              # TypeScript类型定义
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README"
```

---

## 最终检查

- [ ] 所有功能是否都已实现
- [ ] 代码是否能正常编译运行
- [ ] 测试基本功能（上传图片、选择布局、调整设置、导出）

---

## 部署准备

### 准备Cloudflare Pages配置

**Files:**
- Create: `wrangler.toml` (optional)

- [ ] **Step 1: 构建项目**

```bash
npm run build
```

- [ ] **Step 2: 验证构建产物**

检查 `dist/` 目录是否生成正确

- [ ] **Step 3: (可选) 创建Cloudflare Pages配置**

```toml
name = "mosaic-design"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"
publish = "dist"
```

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-26-mosaic-design-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
