
# 模板布局修复 - 设计文档

**日期**：2026-04-28
**状态**：待审核
**版本**：v1.0

---

## 1. 问题描述

### 当前问题
- 图片与占位符无绑定关系，拖动后就"脱离"了
- 图片超出占位符部分没有裁剪
- 缩放逻辑混乱（同时使用 width/height 和 scaleX/scaleY）
- 图片位置检查逻辑简陋

### 目标
让模板布局功能像专业工具一样工作：
1. 图片与占位符绑定
2. 图片自动裁剪到占位符尺寸
3. 拖拽到占位符外部自动解除绑定
4. 允许自由图片与模板共存

---

## 2. 数据结构更新

### 2.1 ImageItem 接口更新

```typescript
export interface ImageItem {
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
  placeholderId?: string; // 新增：绑定的占位符 ID
}
```

---

## 3. 核心设计方案

### 3.1 渲染架构（关键改动）

使用 Konva.Group 实现裁剪：

```jsx
// CanvasEditor 组件
{state.selectedTemplateId && placeholders.map(placeholder => {
  // 查找绑定到该占位符的图片
  const boundImage = images.find(img => img.placeholderId === placeholder.id);
  const hasImage = !!boundImage;
  
  return (
    <React.Fragment key={placeholder.id}>
      {/* 占位符（仅在无图片时显示） */}
      {!hasImage && (
        <Rect
          x={placeholder.x}
          y={placeholder.y}
          width={placeholder.width}
          height={placeholder.height}
          fill="#e0e7ff"
          stroke="#6366f1"
          strokeWidth={2}
          dash={[10, 5]}
          cornerRadius={8}
          rotation={placeholder.rotation}
          zIndex={1}
          onClick={e => handlePlaceholderClick(placeholder.id, e)}
        />
      )}
      
      {/* 裁剪容器（绑定图片用） */}
      {hasImage && (
        <Group
          clipX={placeholder.x}
          clipY={placeholder.y}
          clipWidth={placeholder.width}
          clipHeight={placeholder.height}
        >
          <KonvaImage
            image={imageElement}
            x={placeholder.x}
            y={placeholder.y}
            width={placeholder.width}
            height={placeholder.height}
            rotation={placeholder.rotation}
            draggable={true}
            onDragMove={handleBoundImageDrag} // 限制边界
            onDragEnd={handleBoundImageDragEnd} // 检查是否拖出
            onClick={e => handleImageClick(e, boundImage.id)}
            onTransformEnd={e => handleTransformEnd(e, boundImage.id)}
            zIndex={boundImage.zIndex || 10}
            cornerRadius={...}
          />
        </Group>
      )}
    </React.Fragment>
  );
})}

// 自由图片（未绑定的图片正常渲染）
{images.filter(img => !img.placeholderId).map(img => (
  <KonvaImage
    key={img.id}
    image={...}
    x={img.x}
    y={img.y}
    width={img.width}
    height={img.height}
    scaleX={img.scale}
    scaleY={img.scale}
    rotation={img.rotation}
    draggable={true}
    onClick={e => handleImageClick(e, img.id)}
    onTransformEnd={e => handleTransformEnd(e, img.id)}
    zIndex={img.zIndex || 10}
    cornerRadius={...}
  />
))}
```

---

### 3.2 图片分配逻辑更新

**文件**：`src/hooks/useTemplateApplication.ts`

```typescript
const allocateImagesToPlaceholders = (images: ImageItem[], placeholders: TemplatePlaceholder[]): ImageItem[] => {
  const allocated: ImageItem[] = [];
  const usedImageIndices = new Set&lt;number&gt;();

  placeholders.forEach((placeholder) => {
    // 查找最匹配的图片（比例匹配优先）
    let bestImageIndex = -1;
    let bestMatchScore = -1;

    images.forEach((image, imageIndex) => {
      if (!usedImageIndices.has(imageIndex)) {
        const imageRatio = image.width / image.height;
        const placeholderRatio = placeholder.width / placeholder.height; // 修正：使用 width/height 计算
        const ratioDifference = Math.abs(imageRatio - placeholderRatio);
        const matchScore = 1 / (1 + ratioDifference);

        if (matchScore &gt; bestMatchScore) {
          bestMatchScore = matchScore;
          bestImageIndex = imageIndex;
        }
      }
    });

    if (bestImageIndex !== -1) {
      usedImageIndices.add(bestImageIndex);
      const image = images[bestImageIndex];

      // 关键变化：不使用 scale，直接使用占位符尺寸
      allocated.push({
        ...image,
        placeholderId: placeholder.id, // 设置绑定关系
        x: placeholder.x,
        y: placeholder.y,
        width: placeholder.width,
        height: placeholder.height,
        scale: 1, // 重置 scale 为 1
        rotation: placeholder.rotation,
        zIndex: placeholder.zIndex,
      });
    }
  });

  return allocated;
};
```

---

### 3.3 拖拽逻辑更新

#### 3.3.1 绑定图片的拖拽限制

```typescript
const handleBoundImageDrag = (e: any, placeholderId: string) => {
  const placeholder = placeholders.find(p => p.id === placeholderId);
  if (!placeholder) return;

  const image = e.target;
  const newX = image.x();
  const newY = image.y();

  // 限制边界（不允许拖出占位符）
  const bounds = {
    left: placeholder.x,
    top: placeholder.y,
    right: placeholder.x + placeholder.width,
    bottom: placeholder.y + placeholder.height
  };

  // 计算图片实际尺寸
  const imgWidth = image.width() * image.scaleX();
  const imgHeight = image.height() * image.scaleY();

  if (newX &lt; bounds.left) image.x(bounds.left);
  if (newY &lt; bounds.top) image.y(bounds.top);
  if (newX + imgWidth &gt; bounds.right) image.x(bounds.right - imgWidth);
  if (newY + imgHeight &gt; bounds.bottom) image.y(bounds.bottom - imgHeight);
};
```

#### 3.3.2 拖拽结束检查（是否拖出）

```typescript
const handleBoundImageDragEnd = (e: any, imageId: string) => {
  const image = state.images.find(img => img.id === imageId);
  if (!image || !image.placeholderId) return;

  const placeholder = placeholders.find(p => p.id === image.placeholderId);
  if (!placeholder) return;

  // 检查是否拖出了占位符
  const dragX = e.target.x();
  const dragY = e.target.y();
  const imgWidth = e.target.width() * e.target.scaleX();
  const imgHeight = e.target.height() * e.target.scaleY();

  const imgCenterX = dragX + imgWidth / 2;
  const imgCenterY = dragY + imgHeight / 2;

  const isInside = (
    imgCenterX &gt;= placeholder.x && 
    imgCenterX &lt;= placeholder.x + placeholder.width &&
    imgCenterY &gt;= placeholder.y && 
    imgCenterY &lt;= placeholder.y + placeholder.height
  );

  if (!isInside) {
    // 解除绑定，恢复为自由图片
    dispatch({
      type: 'UPDATE_IMAGE',
      payload: {
        id: imageId,
        placeholderId: undefined,
        // 恢复原始宽高（这里可能需要保存原始尺寸数据）
        // 暂时保持当前尺寸
        x: dragX,
        y: dragY
      }
    });
  }
};
```

---

### 3.4 占位符点击上传逻辑更新

```typescript
const handlePlaceholderClick = (placeholderId: string, e: any) => {
  e.cancelBubble = true;
  
  // 如果有未绑定的图片，提示是否绑定？
  // 或者直接打开文件上传
  
  // 打开文件上传
  inputRef.current?.click();
  currentPlaceholderId.current = placeholderId; // 记住目标占位符
};
```

```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const newImage: ImageItem = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          src: event.target?.result as string,
          width: img.width,
          height: img.height,
          x: 100,
          y: 100,
          scale: 1,
          rotation: 0,
          zIndex: state.images.length + 10,
          placeholderId: currentPlaceholderId.current // 绑定到目标占位符
        };

        // 如果是绑定到占位符，使用占位符尺寸
        if (currentPlaceholderId.current) {
          const placeholder = placeholders.find(p => p.id === currentPlaceholderId.current);
          if (placeholder) {
            newImage.x = placeholder.x;
            newImage.y = placeholder.y;
            newImage.width = placeholder.width;
            newImage.height = placeholder.height;
            newImage.rotation = placeholder.rotation;
          }
        }

        dispatch({ type: 'ADD_IMAGE', payload: newImage });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
```

---

## 4. 功能需求

### 4.1 必须具备的功能

| ID | 功能 | 说明 | 验证方法 |
|----|------|------|----------|
| F1 | 图片绑定到占位符 | 应用模板时，图片设置 `placeholderId` | 检查数据结构 |
| F2 | 图片自动裁剪 | 超出占位符的部分被隐藏 | 视觉检查 |
| F3 | 拖拽限制在边界 | 绑定的图片无法拖出占位符 | 拖拽测试 |
| F4 | 拖出自动解除绑定 | 图片中心拖出占位符时解除绑定 | 拖拽测试 |
| F5 | 自由图片支持 | 未绑定的图片可以正常使用 | 功能检查 |
| F6 | 点击占位符上传 | 点击空闲占位符可以上传图片 | 功能测试 |

### 4.2 边界情况

| 场景 | 期望行为 |
|------|----------|
| 占位符数量多于图片 | 部分占位符显示空白 |
| 图片数量多于占位符 | 多余图片成为自由图片 |
| 快速拖拽进出 | 绑定/解除绑定快速响应 |
| 图片有旋转 | 旋转也正确应用裁剪 |

---

## 5. 技术实现方案

### 5.1 改动文件清单

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `src/types/index.ts` | 更新 | ImageItem 加 placeholderId |
| `src/components/CanvasEditor/CanvasEditor.tsx` | 重构 | 使用 Group 裁剪，分离渲染逻辑 |
| `src/hooks/useTemplateApplication.ts` | 更新 | 设置 placeholderId 和尺寸 |

### 5.2 数据流向

```
用户上传图片 → 分配占位符 → 设置 placeholderId → 裁剪渲染
                       ↓
                 用户拖拽 → 限制边界
                       ↓
                 拖出外部 → 清除 placeholderId → 自由渲染
```

---

## 6. 实施计划

### 阶段1：数据结构和基础渲染
- [ ] 更新类型定义
- [ ] 修改 CanvasEditor，分离绑定和自由图片
- [ ] 实现 Group 裁剪

### 阶段2：分配逻辑
- [ ] 更新 useTemplateApplication
- [ ] 分配时设置 placeholderId
- [ ] 测试模板应用

### 阶段3：拖拽逻辑
- [ ] 实现绑定图片拖拽限制
- [ ] 实现拖出解除绑定
- [ ] 完整功能测试

---

## 7. 验收标准

- [ ] 图片绑定后无法拖出占位符
- [ ] 拖出占位符自动解除绑定
- [ ] 图片超出部分被正确裁剪
- [ ] 模板应用后图片正确分配
- [ ] 自由图片功能正常
- [ ] 点击占位符可以上传图片

---

## 8. 后续优化（可选）

1. **图片重新绑定**：拖拽自由图片到占位符自动绑定
2. **图片调整**：在占位符内可以缩放和裁剪位置
3. **历史记录**：操作可以撤销/重做
4. **智能填充**：根据图片比例选择最佳填充方式
