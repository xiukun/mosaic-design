# 拼接图设计器 MVP 设计规格

## 项目概述
一个基于React + Tailwind CSS + react-konva的图片拼接设计器，支持多种自动布局算法、背景调优和社交媒体分享功能。

## 技术栈

### 前端
- **框架**: React 18 + Vite
- **样式**: Tailwind CSS 3
- **Canvas**: react-konva
- **状态管理**: React Context API + useReducer
- **部署**: Cloudflare Pages

### 后端（可选）
- **框架**: Hono
- **部署**: Cloudflare Workers

## UI设计风格

### 色彩方案
- **主色调**: 
  - 主蓝: #6366f1
  - 次蓝: #818cf8
  - 浅蓝: #a5b4fc
- **背景色**:
  - 主背景: #f8fafc
  - 卡片背景: #ffffff
  - 次背景: #f1f5f9
- **文字色**:
  - 主文字: #1e293b
  - 次文字: #64748b
- **强调色**:
  - 粉色: #f472b6
  - 绿色: #10b981
  - 橙色: #f59e0b

### 设计原则
- 简洁现代的扁平化设计
- 柔和的圆角和阴影效果
- 清晰的视觉层级
- 流畅的动画过渡
- 响应式布局适配

## 功能设计

### 核心功能

#### 1. 图片管理
- 支持拖拽上传多张图片
- 支持点击选择文件上传
- 支持删除图片
- 显示上传的图片缩略图

#### 2. 布局系统
- **网格布局**: 可配置行列数的规则网格
- **马赛克布局**: 智能填充的艺术化布局
- **自由拼接布局**: 可拖拽调整的灵活布局

#### 3. 背景调优
- 背景颜色选择（支持取色器）
- 背景模糊效果（可调节模糊程度）
- 边框样式（颜色、宽度、圆角）
- 阴影效果（可调节偏移、模糊、颜色）

#### 4. 平台适配
- 预设尺寸:
  - 小红书: 3:4 (竖屏)、1:1 (方形)、4:3 (横屏)
  - 抖音: 9:16 (竖屏)、16:9 (横屏)
- 支持自定义尺寸
- 自动适配比例

#### 5. 导出分享
- 导出为PNG格式（高质量）
- 导出为JPG格式（可调节质量）
- 直接下载到本地
- 生成分享链接（后端支持时）

### 用户界面布局

```
┌─────────────────────────────────────────────────────────────┐
│ 顶部导航栏          [LOGO]  [保存] [导出] [分享]            │
├─────────────────────────────────────────────────────────────┤
│             │                                   │            │
│  左侧面板   │         中央画布区域              │  右侧面板   │
│             │                                   │            │
│  [上传区]   │                                   │  [布局]    │
│             │                                   │  [背景]    │
│  [缩略图]   │                                   │  [效果]    │
│  [图层]     │                                   │  [平台]    │
│             │                                   │            │
│             │                                   │            │
└─────────────────────────────────────────────────────────────┘
```

## 布局算法设计

### 1. 网格布局算法
- 输入: 图片列表、画布尺寸、行列数
- 输出: 每个图片的位置和大小
- 策略:
  - 等比例分配单元格
  - 保持图片原始宽高比
  - 在单元格内居中显示
  - 可添加间距

### 2. 马赛克布局算法
- 输入: 图片列表、画布尺寸
- 输出: 每个图片的位置和大小
- 策略:
  - 贪心算法优先放置大图片
  - 填充剩余空间
  - 随机化增加视觉变化
  - 避免过度重叠

### 3. 自由拼接布局算法
- 输入: 图片列表、画布尺寸
- 输出: 每个图片的初始位置
- 策略:
  - 力导向布局
  - 模拟排斥力避免重叠
  - 保持整体平衡
  - 支持用户拖拽调整

## 技术实现方案

### 文件结构

```
mosaic-design/
├── src/
│   ├── components/
│   │   ├── CanvasEditor/         # Canvas编辑组件
│   │   ├── ImageUploader/        # 图片上传组件
│   │   ├── LayoutSelector/       # 布局选择组件
│   │   ├── BackgroundControls/   # 背景控制组件
│   │   ├── EffectControls/       # 效果控制组件
│   │   ├── PlatformSelector/     # 平台选择组件
│   │   └── Toolbar/              # 工具栏组件
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
├── server/
│   ├── src/
│   │   └── index.ts
│   └── package.json
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── wrangler.toml
```

### 数据类型定义

```typescript
interface ImageItem {
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

interface CanvasConfig {
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

interface LayoutConfig {
  type: 'grid' | 'mosaic' | 'free';
  gridRows?: number;
  gridCols?: number;
  spacing?: number;
}

interface PlatformPreset {
  name: string;
  width: number;
  height: number;
}
```

## 实施阶段

### 阶段1: 项目初始化
- 初始化React + Vite项目
- 配置Tailwind CSS
- 安装必要依赖
- 配置项目基础结构

### 阶段2: 核心功能
- 图片上传和管理
- Canvas基础渲染
- 网格布局实现
- 基础界面布局

### 阶段3: 布局系统
- 马赛克布局算法
- 自由拼接布局
- 布局交互功能

### 阶段4: 效果系统
- 背景调优功能
- 边框和阴影
- 平台预设

### 阶段5: 导出分享
- Canvas导出图片
- 下载功能
- 分享功能

### 阶段6: 优化部署
- 性能优化
- 响应式适配
- Cloudflare部署

## 性能优化策略

1. **Canvas渲染优化**:
   - 使用requestAnimationFrame
   - 图片缓存策略
   - 分层渲染

2. **布局计算优化**:
   - Web Workers处理复杂计算
   - 防抖和节流
   - 计算结果缓存

3. **内存管理**:
   - 及时释放不再使用的图片
   - 限制最大图片数量
   - 图片尺寸自动调整

## 部署方案

### 前端部署（Cloudflare Pages）
- 自动部署Git分支
- 预览功能
- 全球CDN加速

### 后端部署（Cloudflare Workers）
- 无服务器架构
- 自动扩展
- 与前端无缝集成

## 成功指标

- 支持至少50张图片拼接
- 布局计算响应时间 < 500ms
- 导出图片质量 ≥ 2048px宽
- 支持主流浏览器（Chrome, Firefox, Safari, Edge）
