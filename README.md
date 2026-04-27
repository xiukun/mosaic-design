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

