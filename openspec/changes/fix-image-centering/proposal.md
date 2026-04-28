## 为什么

用户反馈图片在画布占位符中无法居中显示，特别是在使用模板布局和网格布局时。这导致用户体验不佳，上传的图片位置偏移，影响整体设计效果。

## 变更内容

修复两个 `calculateImageFit` 函数，使其正确计算图片在占位符中的居中偏移量。

## 功能 (Capabilities)

### 新增功能
- `image-centering-calculation`: 修复图片居中计算逻辑，确保图片正确居中显示在占位符内

### 修改功能
- `template-application`: 修改模板应用时的图片位置计算逻辑
- `grid-layout`: 修改网格布局时的图片位置计算逻辑

## 影响

- `src/useCases/imageUseCase.ts`: 修改 `calculateImageFit` 函数
- `src/hooks/useTemplateApplication.ts`: 修改 `calculateImageFit` 函数
- `src/components/CanvasEditor/CanvasEditor.tsx`: 确保渲染时正确应用偏移量
