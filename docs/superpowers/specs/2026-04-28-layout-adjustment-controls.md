# 布局交互控制面板 设计文档

## 项目概述
为拼接图设计器添加布局交互控制面板，支持实时调整图片间距和圆角。

## 功能设计

### 核心功能

#### 1. 间距调整
- 滑块组件，范围 0-100%
- 实时调整所有图片之间的间距
- 默认值：10%

#### 2. 圆角调整
- 滑块组件，范围 0-100%
- 实时调整所有图片的圆角大小
- 默认值：10%

#### 3. 实时预览
- 拖动滑块即时更新画布
- 无需额外确认操作

## 技术实现方案

### 1. 数据结构扩展

**文件**: [`src/types/index.ts`](file:///Users/mac/Desktop/traedemo/mosaic-design/src/types/index.ts)

```typescript
export interface LayoutConfig {
  type: 'grid' | 'mosaic' | 'free';
  gridRows?: number;
  gridCols?: number;
  spacing?: number;      // 新增：间距百分比 0-100
  borderRadius?: number; // 新增：圆角百分比 0-100
}

export interface AppState {
  // ... 现有字段
  layoutConfig: LayoutConfig;
  // ...
}

export type AppAction =
  // ... 现有 actions
  | { type: 'SET_LAYOUT_CONFIG'; payload: Partial<LayoutConfig> };
  // ...
```

### 2. 状态管理更新

**文件**: [`src/context/AppContext.tsx`](file:///Users/mac/Desktop/traedemo/mosaic-design/src/context/AppContext.tsx)

- 初始化默认值：`spacing: 10, borderRadius: 10`
- 更新 reducer 处理 `SET_LAYOUT_CONFIG` action

### 3. 组件设计

#### 3.1 新建 LayoutAdjustControls 组件

**文件**: [`src/components/LayoutAdjustControls/LayoutAdjustControls.tsx`](file:///Users/mac/Desktop/traedemo/mosaic-design/src/components/LayoutAdjustControls/LayoutAdjustControls.tsx)

```typescript
import React from 'react';
import { useApp } from '../../context/AppContext';

const LayoutAdjustControls: React.FC = () => {
  const { state, dispatch } = useApp();
  const { layoutConfig } = state;

  const handleSpacingChange = (value: number) => {
    dispatch({ 
      type: 'SET_LAYOUT_CONFIG', 
      payload: { spacing: value } 
    });
  };

  const handleBorderRadiusChange = (value: number) => {
    dispatch({ 
      type: 'SET_LAYOUT_CONFIG', 
      payload: { borderRadius: value } 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          间距: {layoutConfig.spacing || 10}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={layoutConfig.spacing || 10}
          onChange={(e) => handleSpacingChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          圆角: {layoutConfig.borderRadius || 10}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={layoutConfig.borderRadius || 10}
          onChange={(e) => handleBorderRadiusChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>
    </div>
  );
};

export default LayoutAdjustControls;
```

#### 3.2 更新 RightSidebar 组件

**文件**: [`src/components/Sidebar/RightSidebar.tsx`](file:///Users/mac/Desktop/traedemo/mosaic-design/src/components/Sidebar/RightSidebar.tsx)

在 LayoutSelector 下方添加 LayoutAdjustControls 组件。

### 4. 布局算法更新

**文件**: [`src/hooks/useGridLayout.ts`](file:///Users/mac/Desktop/traedemo/mosaic-design/src/hooks/useGridLayout.ts)

更新网格布局计算，考虑 spacing 参数：

```typescript
// 在计算图片位置时考虑间距
const spacing = layoutConfig.spacing || 10;
const spacingPx = (spacing / 100) * Math.min(canvasWidth, canvasHeight) * 0.1;
```

### 5. Canvas 渲染更新

**文件**: [`src/components/CanvasEditor/CanvasEditor.tsx`](file:///Users/mac/Desktop/traedemo/mosaic-design/src/components/CanvasEditor/CanvasEditor.tsx)

更新图片渲染，使用 borderRadius 参数：

```typescript
// 计算圆角大小
const borderRadius = layoutConfig.borderRadius || 10;
const maxRadius = Math.min(img.width * img.scale, img.height * img.scale) / 2;
const cornerRadius = (borderRadius / 100) * maxRadius;

// 在 KonvaImage 中应用
<KonvaImage
  // ... 其他属性
  cornerRadius={cornerRadius}
/>
```

## 实施阶段

### 阶段 1：数据结构和状态管理
- 更新类型定义
- 更新初始化状态
- 更新 reducer

### 阶段 2：UI 组件
- 创建 LayoutAdjustControls 组件
- 集成到 RightSidebar

### 阶段 3：布局算法更新
- 更新 useGridLayout 支持间距
- 验证布局计算

### 阶段 4：Canvas 渲染
- 更新 CanvasEditor 支持圆角
- 测试实时预览

### 阶段 5：测试和优化
- 完整功能测试
- 性能优化
- 边界情况处理

## 性能优化
- 使用 requestAnimationFrame 优化重绘
- 防抖处理滑块输入（可选）
- 确保只在必要时重新计算布局

## 成功指标
- 滑块拖动响应流畅，无明显延迟
- 间距和圆角调整准确反映在画布上
- 支持主流浏览器（Chrome, Firefox, Safari, Edge）
