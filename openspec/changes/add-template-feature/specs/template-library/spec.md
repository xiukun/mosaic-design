# 模板库功能规范

## 功能概述
模板库功能允许用户浏览、搜索和选择预设模板，为拼接图设计提供快速入门选项。

## 功能需求

### 1. 模板分类
- 支持按类别分类模板（如基础布局、社交媒体、创意、主题等）
- 提供热门推荐和最新添加的模板筛选
- 支持模板搜索功能

### 2. 模板展示
- 以网格形式展示模板预览图
- 每个模板显示名称和分类信息
- 支持模板预览图的懒加载

### 3. 模板选择
- 点击模板预览图选择模板
- 显示模板详情和预览
- 支持模板收藏功能

### 4. 模板数据
- 内置基础模板数据
- 模板数据结构包含：
  - 模板ID
  - 名称
  - 分类
  - 预览图
  - 是否热门
  - 是否新增
  - 画布配置
  - 占位符信息
  - 可选元素

## 技术实现

### 1. 组件设计
- `TemplateSelector` 组件：主模板选择器组件
- `TemplateCategoryNav` 组件：模板分类导航
- `TemplateGrid` 组件：模板网格展示
- `TemplatePreview` 组件：模板预览

### 2. 数据结构
```typescript
interface Template {
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

interface TemplatePlaceholder {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
  rotation: number;
  zIndex: number;
}

interface TemplateElement {
  id: string;
  type: 'text' | 'shape' | 'decoration';
  content: string;
  x: number;
  y: number;
  zIndex: number;
  // 其他属性根据元素类型而定
}
```

### 3. 状态管理
- 在AppContext中添加模板相关状态
- 模板加载和筛选逻辑

### 4. 性能优化
- 模板预览图懒加载
- 虚拟滚动展示模板列表
- 模板数据缓存