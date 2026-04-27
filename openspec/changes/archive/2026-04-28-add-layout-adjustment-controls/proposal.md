## 为什么

受 FotoJet 等专业拼图工具启发，用户需要更精细的布局控制能力。当前间距调整仅在网格布局下可用，且缺少圆角调整功能，限制了设计灵活性。

## 变更内容

- 在 `LayoutConfig` 中添加 `borderRadius` 字段
- 将间距调整功能扩展到所有布局类型
- 添加圆角调整控件
- 确保所有调整实时反映在画布上

## 功能 (Capabilities)

### 新增功能
- `layout-adjustment-controls`: 提供间距和圆角的实时交互控制面板

### 修改功能
-（无现有功能需求变更）

## 影响

- **代码变更**:
  - `src/types/index.ts` - 更新 LayoutConfig 类型
  - `src/utils/constants.ts` - 更新默认布局配置
  - `src/components/LayoutSelector/LayoutSelector.tsx` - 添加圆角控件并扩展间距控件可用性
  - `src/components/CanvasEditor/CanvasEditor.tsx` - 使圆角可配置化
  - `src/hooks/useMosaicLayout.ts` - 确保马赛克布局支持间距
  - `src/utils/layoutAlgorithms.ts` - 确保算法考虑间距
  
- **无 API 破坏性变更** - 所有变更都是向后兼容的
