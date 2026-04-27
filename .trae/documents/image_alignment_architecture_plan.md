# 图片对齐架构重构计划

## 问题分析

根据用户提供的截图，当前实现存在以下问题：

1. **图片大小不正确**：上传的图片没有正确填充到占位符中
2. **图片位置偏移**：图片没有准确对齐到占位符的位置
3. **渲染顺序问题**：图片可能显示在占位符下方

## 架构设计

采用分层架构来重新实现图片对齐功能：

### 1. 领域层 (Domain Layer)

**文件**：`/src/domain/imageAlignment.ts`

**职责**：
- 提供图片对齐的核心算法
- 定义图片和占位符的领域模型
- 实现图片缩放和定位的核心逻辑

### 2. 应用层 (Application Layer)

**文件**：`/src/useCases/imageUseCase.ts`

**职责**：
- 协调图片上传和对齐流程
- 处理业务逻辑
- 调用领域层的对齐算法

### 3. 适配器层 (Adapter Layer)

**文件**：`/src/components/CanvasEditor/CanvasEditor.tsx`

**职责**：
- 负责UI渲染
- 处理用户交互
- 调用应用层的用例

### 4. 状态管理 (State Management)

**文件**：`/src/context/AppContext.tsx`

**职责**：
- 管理全局状态
- 提供状态更新方法

## 核心算法设计

### 图片对齐算法

```typescript
// 计算图片在占位符中的最佳位置和尺寸
function calculateImagePosition(image: Image, placeholder: Placeholder): ImagePosition {
  // 计算缩放比例
  const scaleX = placeholder.width / image.width;
  const scaleY = placeholder.height / image.height;
  const scale = Math.max(scaleX, scaleY); // 使用cover模式

  // 计算缩放后的尺寸
  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;

  // 计算居中位置
  const x = placeholder.x + (placeholder.width - scaledWidth) / 2;
  const y = placeholder.y + (placeholder.height - scaledHeight) / 2;

  return {
    x,
    y,
    scale,
    width: scaledWidth,
    height: scaledHeight
  };
}
```

## 实现计划

### 1. 创建领域层

- 创建 `/src/domain/imageAlignment.ts` 文件
- 实现图片对齐的核心算法
- 定义相关类型和接口

### 2. 创建应用层

- 创建 `/src/useCases/imageUseCase.ts` 文件
- 实现图片上传和对齐的业务逻辑
- 集成领域层的算法

### 3. 修改CanvasEditor组件

- 重构 `handlePlaceholderClick` 函数
- 使用新的对齐算法
- 确保图片正确渲染

### 4. 测试和验证

- 测试不同模板的图片上传
- 验证图片是否正确对齐
- 测试图片调整和删除功能

## 预期效果

- 图片上传后自动正确填充到占位符中
- 图片保持原始宽高比
- 图片居中显示在占位符中
- 图片显示在占位符之上
- 图片可以正常调整和删除

## 风险评估

- **风险**：重构可能影响现有功能
- **缓解措施**：保持接口兼容，逐步替换实现
- **测试**：全面测试所有功能，确保没有回归