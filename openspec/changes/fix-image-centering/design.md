## 上下文

当前系统中存在两个 `calculateImageFit` 函数，分别位于：
- `src/useCases/imageUseCase.ts` - 用于上传图片时计算位置
- `src/hooks/useTemplateApplication.ts` - 用于应用模板时计算位置

这两个函数都存在相同的问题：`offsetX` 和 `offsetY` 始终返回 0，导致图片无法在占位符中居中显示。

CanvasEditor 组件中渲染绑定图片时，期望通过 `offsetX` 和 `offsetY` 实现居中：
```typescript
const imageCenterX = placeholder.x + placeholder.width / 2 + (img.offsetX || 0);
const imageCenterY = placeholder.y + placeholder.height / 2 + (img.offsetY || 0);
```

## 目标 / 非目标

**目标：**
- 修复 `calculateImageFit` 函数，正确计算图片居中所需的偏移量
- 确保图片在占位符中居中显示（cover 模式）
- 保持现有代码结构，最小化改动

**非目标：**
- 不改变现有的布局算法逻辑
- 不修改 CanvasEditor 的渲染逻辑
- 不引入新的依赖或组件

## 决策

### 决策 1：修改 `calculateImageFit` 函数

**问题分析：**
当前实现使用 `cover` 模式（`Math.max(scaleX, scaleY)`）确保图片完全覆盖占位符，但没有计算居中偏移。

**解决方案：**
```typescript
const calculateImageFit = (
  imageWidth: number,
  imageHeight: number,
  placeholderWidth: number,
  placeholderHeight: number
) => {
  const scaleX = placeholderWidth / imageWidth;
  const scaleY = placeholderHeight / imageHeight;
  const scale = Math.max(scaleX, scaleY);

  // 计算缩放后的图片尺寸
  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;

  // 计算居中偏移（缩放后图片超出占位符的部分的一半）
  const offsetX = (placeholderWidth - scaledWidth) / 2;
  const offsetY = (placeholderHeight - scaledHeight) / 2;

  return {
    scale,
    offsetX,
    offsetY,
  };
};
```

**理由：**
- 使用 `cover` 模式时，图片会超出占位符边界
- 偏移量 = (占位符尺寸 - 缩放后图片尺寸) / 2
- 负值表示图片超出占位符，正值表示图片未填满（不会发生在 cover 模式）

### 决策 2：同时修复两个位置的函数

**理由：**
- 两个函数功能相同，需要保持一致性
- 如果只修复一个，另一个仍会导致问题

## 风险 / 权衡

| 风险 | 缓解措施 |
|------|----------|
| 修改可能影响现有功能 | 进行回归测试，确保图片上传和模板应用功能正常 |
| 可能破坏与现有代码的兼容性 | 保持函数签名不变，只修改内部计算逻辑 |
| 旋转图片的居中可能受影响 | 在 CanvasEditor 中已考虑旋转因素（`isRotated90or270`） |
