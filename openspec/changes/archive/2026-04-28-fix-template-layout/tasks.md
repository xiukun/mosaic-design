
# Fix Template Layout - Tasks

**Date**: 2026-04-28  
**Status**: Proposed

---

## Phase 1: Data Types & Basic Setup

- [ ] **Task 1**: Add placeholderId to ImageItem in types/index.ts
- [ ] **Task 2**: Install any new dependencies (none expected)

## Phase 2: Update Template Application Logic

- [ ] **Task 3**: Update useTemplateApplication to set placeholderId when allocating
- [ ] **Task 4**: Modify allocation to use placeholder dimensions directly instead of scale
- [ ] **Task 5**: Test that applying a template binds images to placeholders

## Phase 3: Canvas Rendering Refactor

- [ ] **Task 6**: Split CanvasEditor rendering into three sections: placeholders, bound images, free images
- [ ] **Task 7**: Implement Group-based clipping for bound images
- [ ] **Task 8**: Update image rendering to use placeholder dimensions for bound images

## Phase 4: Drag Interaction Logic

- [ ] **Task 9**: Implement onDragMove handler to constrain bound images
- [ ] **Task 10**: Implement onDragEnd handler to check for unbind condition
- [ ] **Task 11**: Unbind image when center is outside placeholder

## Phase 5: Placeholder Upload Functionality

- [ ] **Task 12**: Update handlePlaceholderClick to open file upload
- [ ] **Task 13**: Update handleFileChange to support binding new images to a placeholder

## Phase 6: Testing & Validation

- [ ] **Task 14**: Test complete template application flow
- [ ] **Task 15**: Test binding and unbinding images
- [ ] **Task 16**: Verify clipping works correctly
- [ ] **Task 17**: Test free image coexistence with templates
- [ ] **Task 18**: Test placeholder click-to-upload
