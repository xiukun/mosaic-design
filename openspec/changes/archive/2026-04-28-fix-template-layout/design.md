
# Fix Template Layout - Design

**Date**: 2026-04-28  
**Status**: Proposed

---

## 1. Architecture Overview

The fix will change the rendering architecture to:
1. **Separate rendering** for bound images and free images
2. **Group-based clipping** for bound images
3. **Drag constraint system** to keep images in placeholders
4. **Drag-to-unbind** behavior when dragged outside

---

## 2. Component Design

### 2.1 CanvasEditor Component

The component will be split into three parts:
1. **Placeholders**: Empty placeholders without images
2. **Bound Images**: Images in placeholders, clipped by Group
3. **Free Images**: Unbound images, rendered normally

```
CanvasEditor
├── Placeholders (Rect + Text)
├── Bound Images (Group + KonvaImage)
└── Free Images (KonvaImage)
```

---

## 3. Data Flow

### 3.1 Image Binding Flow

```
User applies template → allocateImagesToPlaceholders → set placeholderId → clip & render
```

### 3.2 Drag Flow

```
User drags bound image → onDragMove (constrain boundaries) → onDragEnd (check if center outside) → unbind if needed
```

---

## 4. Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use Group for clipping | Konva built-in, simple and efficient |
| Center-based unbind check | More intuitive, less sensitive than edge |
| Separate rendering paths | Clear logic, easier to maintain |
| Keep scale=1 for bound images | Simplifies dimension calculations |

---

## 5. Error Handling

- **No placeholder found**: Gracefully degrade, treat as free image
- **Drag outside canvas**: Bound images stay inside, free images normal behavior
- **Rapid drag events**: Debounce not needed, Konva handles event rate

---

## 6. Performance Considerations

- **No extra re-renders**: State updates only on drag end
- **Efficient clipping**: Konva Group clipping is hardware-accelerated
- **No heavy calculations**: Simple boundary checks during drag
