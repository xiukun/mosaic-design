# 侧边栏重构变更提案

## 为什么

当前的双栏布局（左侧 + 右侧）占用了太多空间，而且右侧栏的 Tab 切换很繁琐。参考 FotoJet 的专业设计工具，我们需要：
1. 最大化画布空间
2. 更流畅的交互方式
3. 更直观的功能分组

## 变更内容

### UI 架构变更
- **移除右侧栏**：完全删除 RightSidebar
- **重构左侧栏**：
  - 改为垂直图标导航
  - 支持折叠/展开
  - 默认窄侧边栏（56px），只显示图标
  - 点击图标展开面板（240px
- **新增浮动工具栏**：选中图片时显示快捷操作

### 功能整合
把右侧栏的所有功能整合到左侧栏的「布局」和「背景」面板中

## 功能 Capabilities

### 新增功能
- `collapsible-sidebar`：可折叠的垂直图标侧边栏
- `image-floating-toolbar`：选中图片的浮动工具栏
- `layout-presets`：网格布局的常用预设按钮

### 修改功能
- `sidebar-layout`：重构侧边栏架构

## 影响

### 代码变更
- `src/App.tsx`：移除 RightSidebar，调整布局
- `src/components/Sidebar/LeftSidebar.tsx`：完全重构
- `src/components/Sidebar/RightSidebar.tsx`：删除
- `src/components/LayoutSelector/LayoutSelector.tsx`：拆分整合
- `src/components/CanvasEditor/CanvasEditor.tsx`：新增浮动工具栏
- `src/components/ImageToolbar.tsx`：新建

### 无破坏性变更
- 状态管理保持不变
- 所有现有功能保留
- 用户数据不受影响
