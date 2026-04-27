# 模板功能设计规格

## 项目概述
为现有的拼接图设计器添加模板功能，允许用户选择预设模板，替换和调整图片，实现类似Fotojet的模板功能。

## 技术栈
- **前端**: React 18 + Vite + Tailwind CSS
- **Canvas**: react-konva
- **状态管理**: React Context API + useReducer
- **模板数据**: 内置基础模板 + 可选API获取

## 功能设计

### 核心功能

#### 1. 模板库
- **模板类型**:
  - 基础布局模板: 简单的网格和拼贴布局
  - 社交媒体模板: 针对不同平台（Instagram、Facebook、TikTok等）优化的模板
  - 创意模板: 艺术化的不规则布局
  - 主题模板: 包含背景、文字、装饰元素的完整主题模板

- **模板分类**:
  - 按类别分类（如节日、生活、旅行、商务等）
  - 热门推荐
  - 最新添加
  - 搜索功能

#### 2. 模板应用
- 点击模板预览图应用模板
- 应用模板时自动调整画布尺寸和布局
- 保留已上传的图片，智能分配到模板的占位符

#### 3. 图片操作
- **点击替换**: 点击模板中的图片占位符来替换图片
- **拖拽替换**: 从上传区拖拽图片到模板中的占位符
- **调整大小**: 允许调整图片在模板中的大小和位置
- **滤镜效果**: 为模板中的图片应用基础滤镜效果

#### 4. 模板管理
- 模板预览和选择
- 模板收藏功能
- 模板历史记录

## 技术实现方案

### 1. 模板数据结构

```typescript
// 模板定义
export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string; // 模板预览图
  isPopular: boolean;
  isNew: boolean;
  canvasConfig: CanvasConfig;
  placeholders: TemplatePlaceholder[];
  elements?: TemplateElement[]; // 可选的装饰元素
}

// 模板占位符
export interface TemplatePlaceholder {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number; // 宽高比
  rotation: number;
  zIndex: number;
}

// 模板元素（如文字、装饰等）
export interface TemplateElement {
  id: string;
  type: 'text' | 'shape' | 'decoration';
  content: string;
  x: number;
  y: number;
  zIndex: number;
  // 其他属性根据元素类型而定
}
```

### 2. 状态管理扩展

在现有AppState中添加模板相关状态：

```typescript
export interface AppState {
  images: ImageItem[];
  canvasConfig: CanvasConfig;
  layoutConfig: LayoutConfig;
  selectedImageId: string | null;
  // 新增模板相关状态
  templates: Template[];
  selectedTemplateId: string | null;
  templateCategories: string[];
  isLoadingTemplates: boolean;
}
```

### 3. 组件设计

#### 1. 模板选择器组件 (TemplateSelector)
- 模板分类导航
- 模板网格展示
- 模板搜索功能
- 模板预览

#### 2. 模板应用组件 (TemplateApplier)
- 模板应用逻辑
- 图片自动分配
- 画布尺寸调整

#### 3. 模板编辑组件 (TemplateEditor)
- 占位符编辑
- 元素添加和编辑
- 模板保存功能

### 4. 界面布局

在左侧面板添加模板选项：

```
┌─────────────────────────────────────────────────────────────┐
│ 顶部导航栏          [LOGO]  [保存] [导出] [分享]            │
├─────────────────────────────────────────────────────────────┤
│             │                                   │            │
│  左侧面板   │         中央画布区域              │  右侧面板   │
│             │                                   │            │
│  [模板]     │                                   │  [布局]    │
│  [上传区]   │                                   │  [背景]    │
│  [缩略图]   │                                   │  [效果]    │
│  [图层]     │                                   │  [平台]    │
│             │                                   │            │
│             │                                   │            │
└─────────────────────────────────────────────────────────────┘
```

### 5. 数据流

1. **模板加载**:
   - 初始化时加载内置模板
   - 可选：从API获取更多模板

2. **模板选择**:
   - 用户选择模板
   - 应用模板到画布
   - 调整画布配置
   - 分配图片到占位符

3. **图片操作**:
   - 用户替换或调整图片
   - 更新图片状态
   - 重新渲染画布

## 实施阶段

### 阶段1: 基础模板库
- 定义模板数据结构
- 创建内置基础模板
- 实现模板选择器组件

### 阶段2: 模板应用功能
- 实现模板应用逻辑
- 图片自动分配算法
- 画布尺寸调整

### 阶段3: 图片操作功能
- 实现点击替换图片
- 实现拖拽替换图片
- 实现图片调整功能

### 阶段4: 高级功能
- 实现滤镜效果
- 实现模板收藏
- 实现模板搜索

### 阶段5: API集成
- 实现从API获取模板
- 实现模板更新机制

## 性能优化

1. **模板加载优化**:
   - 懒加载模板预览图
   - 缓存模板数据
   - 分页加载模板

2. **渲染优化**:
   - 使用虚拟滚动展示模板列表
   - 优化Canvas渲染
   - 防抖处理用户操作

3. **内存管理**:
   - 及时释放未使用的模板数据
   - 限制同时加载的模板数量

## 成功指标

- 支持至少50个内置模板
- 模板应用响应时间 < 500ms
- 图片替换操作流畅无卡顿
- 支持主流浏览器（Chrome, Firefox, Safari, Edge）

## 风险评估

1. **模板数据管理**:
   - 内置模板数据量过大可能影响应用加载速度
   - 解决方案：按需加载模板数据，使用代码分割

2. **图片分配算法**:
   - 复杂模板的图片分配可能不够智能
   - 解决方案：提供手动调整选项，优化分配算法

3. **性能问题**:
   - 大量模板和图片可能导致性能下降
   - 解决方案：实现虚拟滚动，优化Canvas渲染

4. **API依赖**:
   - 依赖外部API获取模板可能影响可靠性
   - 解决方案：内置基础模板作为后备，实现API故障处理