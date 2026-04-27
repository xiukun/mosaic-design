// 示例图片URL，用于模板预览
export const sampleImages = [
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef281b39?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400&h=400&fit=crop',
];

// 加载示例图片到应用中
export const loadSampleImages = async () => {
  return sampleImages.slice(0, 4);
};
