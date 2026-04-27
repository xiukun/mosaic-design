## 1. 更新类型定义和默认值

- [x] 1.1 在 LayoutConfig 中添加 borderRadius 字段（src/types/index.ts）
- [x] 1.2 在 DEFAULT_LAYOUT_CONFIG 中添加 borderRadius 默认值（src/utils/constants.ts）

## 2. 更新 LayoutSelector 组件

- [x] 2.1 将间距调整控件移到所有布局类型下都可见的位置
- [x] 2.2 添加圆角调整滑块控件
- [x] 2.3 确保滑块值在 0-100 范围内

## 3. 更新 CanvasEditor 组件

- [x] 3.1 修改图片圆角计算逻辑，使用 state.layoutConfig.borderRadius
- [x] 3.2 实现百分比到像素的转换逻辑
- [x] 3.3 确保所有图片都应用相同的圆角设置

## 4. 更新布局算法

- [x] 4.1 确认 useGridLayout 已正确处理 spacing
- [x] 4.2 确保 useMosaicLayout 使用 spacing 参数
- [x] 4.3 验证 layoutAlgorithms 中所有算法都考虑 spacing

## 5. 测试和验证

- [x] 5.1 在网格布局下测试间距和圆角调整
- [x] 5.2 在马赛克布局下测试间距和圆角调整
- [x] 5.3 在自由布局下测试间距和圆角调整
- [x] 5.4 验证实时预览效果流畅无卡顿
