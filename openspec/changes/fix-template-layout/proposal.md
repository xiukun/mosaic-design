
# Fix Template Layout - Proposal

**Date**: 2026-04-28  
**Status**: Proposed

---

## Problem

The current template layout has several critical issues:

1. **No binding relationship**: Images and placeholders aren't connected after allocation, so dragging an image causes it to "come loose"
2. **No image clipping**: Images can overflow placeholder boundaries without being clipped
3. **Confusing scaling logic**: Both width/height and scaleX/scaleY are used inconsistently
4. **Simplistic position checking**: Only basic location checks are performed, not verifying dimensions/scaling/alignment

---

## Solution

Implement a professional template layout system with:

1. **Binding relationship**: Add placeholderId to ImageItem to track which placeholder an image belongs to
2. **Image clipping**: Use Konva.Group with clip properties to hide overflow
3. **Simplified scaling**: Use placeholder dimensions directly instead of scale
4. **Drag constraints**: Keep bound images within placeholder boundaries
5. **Drag-to-unbind**: Automatically unbind an image when its center is dragged outside

---

## Scope

**In Scope**:
- Update type definitions
- Implement Group-based clipping
- Add placeholderId binding
- Implement drag constraints and unbinding
- Allow free images to coexist with templates

**Out of Scope**:
- Re-binding free images to placeholders (future enhancement)
- Image positioning within placeholders (crop/pan)
- Full undo/redo system
- Advanced smart fill algorithms

---

## Impact

**Files Affected**:
- `src/types/index.ts`
- `src/components/CanvasEditor/CanvasEditor.tsx`
- `src/hooks/useTemplateApplication.ts`

**Backward Compatibility**:
- Fully backward compatible (placeholderId is optional)
- Existing images without placeholderId will be treated as free images
