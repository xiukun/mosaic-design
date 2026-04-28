
# Template Layout Fix - Spec

**Date**: 2026-04-28  
**Status**: Proposed

---

## 1. Overview

This spec defines the template layout binding and clipping system.

---

## 2. Data Types

### 2.1 ImageItem (Updated)

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
  placeholderId?: string; // NEW: ID of placeholder this image is bound to
}
```

---

## 3. Features

### 3.1 Image Binding

**Requirement ID**: FL01

**Description**: When a template is applied, images should be bound to placeholders by setting placeholderId.

**Acceptance Criteria**:
- [ ] Images allocated to placeholders have placeholderId set
- [ ] Images without placeholderId are rendered as free images
- [ ] Multiple images can't be bound to the same placeholder

### 3.2 Image Clipping

**Requirement ID**: FL02

**Description**: Bound images should be clipped to their placeholder's dimensions.

**Acceptance Criteria**:
- [ ] Images don't overflow placeholder boundaries
- [ ] Any part of an image outside is hidden
- [ ] Corner radius is applied correctly

### 3.3 Drag Constraints

**Requirement ID**: FL03

**Description**: Bound images should stay within their placeholder when dragged.

**Acceptance Criteria**:
- [ ] Can't drag a bound image outside its placeholder
- [ ] Attempting to drag out just keeps image at the edge
- [ ] Visual feedback during drag (cursor change optional)

### 3.4 Drag-to-Unbind

**Requirement ID**: FL04

**Description**: Drag the center of an image outside to unbind it.

**Acceptance Criteria**:
- [ ] When image center is dragged outside placeholder, it becomes a free image
- [ ] Unbound image can be freely dragged anywhere
- [ ] Image keeps its current dimensions when unbound
- [ ] Placeholder becomes empty and clickable again

### 3.5 Free Image Support

**Requirement ID**: FL05

**Description**: Allow free images to coexist with templates.

**Acceptance Criteria**:
- [ ] Free images render normally with scaleX/scaleY
- [ ] Free images can be dragged anywhere
- [ ] Free images don't interfere with bound images
- [ ] Extra images when applying template become free images

### 3.6 Click Placeholder to Upload

**Requirement ID**: FL06

**Description**: Click empty placeholder to upload and bind new image.

**Acceptance Criteria**:
- [ ] Clicking empty placeholder opens file upload
- [ ] Uploaded image is bound to that placeholder
- [ ] Uploaded image uses placeholder's dimensions
