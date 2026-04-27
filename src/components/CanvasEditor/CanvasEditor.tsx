import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Transformer, Text } from 'react-konva';
import { useApp } from '../../context/AppContext';
import { useGridLayout } from '../../hooks/useGridLayout';
import { getTemplateById } from '../../utils/templates';
import { ImageUploadUseCase, ImageTransformUseCase } from '../../useCases/imageUseCase';
import { isImageInPlaceholder } from '../../domain/imageAlignment';

const CanvasEditor: React.FC = () => {
  const { state, updateImage, selectImage, removeImage, addImageWithPosition } = useApp();
  const { applyGridLayout } = useGridLayout();
  const imageRefs = useRef<{ [key: string]: any }>({});
  const trRef = useRef<any>(null);
  
  // 初始化用例
  const imageUploadUseCase = new ImageUploadUseCase();
  const imageTransformUseCase = new ImageTransformUseCase();

  useEffect(() => {
    if (state.images.length > 0 && state.layoutConfig.type === 'grid') {
      applyGridLayout();
    }
  }, [state.images.length, state.layoutConfig.type]);

  useEffect(() => {
    if (trRef.current && state.selectedImageId) {
      const nodes = [imageRefs.current[state.selectedImageId]];
      trRef.current.nodes(nodes);
      trRef.current.getLayer()?.batchDraw();
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [state.selectedImageId]);

  const handleImageClick = (e: any, id: string) => {
    e.cancelBubble = true;
    selectImage(id);
  };

  const handleStageClick = () => {
    selectImage(null);
  };

  const handleTransformEnd = (e: any, id: string) => {
    const node = e.target;
    // 使用用例处理图片变换
    const updates = imageTransformUseCase.execute(id, node, state);
    if (Object.keys(updates).length > 0) {
      updateImage(id, updates);
    }
  };

  const handlePlaceholderClick = (placeholderId: string) => {
    // 触发上传图片的逻辑
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        try {
          // 使用用例处理图片上传和对齐
          const response = await imageUploadUseCase.execute({
            file,
            placeholderId,
            state,
            addImageWithPosition
          });
          
          if (!response.success && response.error) {
            console.error('图片上传失败:', response.error);
          }
        } catch (error) {
          console.error('图片上传失败:', error);
        }
      }
    };
    input.click();
  };

  const { canvasConfig, images } = state;
  
  // 计算容器尺寸，确保有足够的空间
  const baseWidth = canvasConfig.width;
  const baseHeight = canvasConfig.height;
  const containerWidth = Math.min(800, baseWidth * 1.2); // 增加20%的宽度
  const scale = containerWidth / baseWidth;
  const containerHeight = baseHeight * scale * 1.2; // 增加20%的高度

  // 获取当前选中模板的占位符
  const template = state.selectedTemplateId ? getTemplateById(state.selectedTemplateId) : null;
  const placeholders = template?.placeholders || [];

  const handleDeleteImage = () => {
    if (state.selectedImageId) {
      removeImage(state.selectedImageId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4">
      <div className="relative w-full max-w-4xl">
        <div className="absolute -inset-8 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-3xl -z-10 blur-2xl" />
        <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
          {/* 删除按钮 - 当有图片被选中时显示 */}
          {state.selectedImageId && (
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={handleDeleteImage}
                className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                title="删除图片"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="relative" style={{ 
            width: containerWidth,
            height: containerHeight,
            maxWidth: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '20px'
          }}>
            <Stage
              width={baseWidth * scale}
              height={baseHeight * scale}
              scaleX={scale}
              scaleY={scale}
              onClick={handleStageClick}
              className="rounded-xl shadow-xl"
              overflow="visible"
            >
              <Layer>
                {/* 画布背景 */}
                <Rect
                  x={0}
                  y={0}
                  width={baseWidth}
                  height={baseHeight}
                  fill={canvasConfig.backgroundColor}
                  cornerRadius={canvasConfig.borderRadius}
                  stroke={canvasConfig.borderColor}
                  strokeWidth={canvasConfig.borderWidth}
                  shadowColor={canvasConfig.shadowColor}
                  shadowBlur={canvasConfig.shadowBlur}
                  shadowOffsetX={canvasConfig.shadowOffsetX}
                  shadowOffsetY={canvasConfig.shadowOffsetY}
                />
                
                {/* 渲染占位符 */}
                {state.selectedTemplateId && placeholders.map((placeholder) => {
                  // 检查是否有图片已经填充到这个占位符
                  const hasImage = images.some(img => {
                    // 使用领域层函数检查图片是否在占位符区域内
                    return isImageInPlaceholder(img, placeholder);
                  });
                  
                  if (hasImage) return null;
                  
                  return (
                    <React.Fragment key={placeholder.id}>
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
                        zIndex={1} // 占位符始终在最底层
                        onClick={(e) => {
                          e.cancelBubble = true;
                          handlePlaceholderClick(placeholder.id);
                        }}
                      />
                      <Text
                        x={placeholder.x + placeholder.width / 2}
                        y={placeholder.y + placeholder.height / 2}
                        text="点击上传图片"
                        fontSize={16}
                        fontFamily="Arial"
                        fill="#6366f1"
                        align="center"
                        verticalAlign="middle"
                        offsetX={80}
                        offsetY={8}
                        zIndex={2} // 文本在占位符之上
                        onClick={(e) => {
                          e.cancelBubble = true;
                          handlePlaceholderClick(placeholder.id);
                        }}
                      />
                    </React.Fragment>
                  );
                })}
                
                {/* 渲染图片 */}
                {images.map((img) => {
                  const konvaImg = new window.Image();
                  konvaImg.src = img.src;
                  
                  return (
                    <KonvaImage
                      key={img.id}
                      ref={(node) => {
                        if (node) imageRefs.current[img.id] = node;
                      }}
                      image={konvaImg}
                      x={img.x}
                      y={img.y}
                      width={img.width}
                      height={img.height}
                      scaleX={img.scale}
                      scaleY={img.scale}
                      rotation={img.rotation}
                      draggable={true}
                      onClick={(e) => handleImageClick(e, img.id)}
                      onTransformEnd={(e) => handleTransformEnd(e, img.id)}
                      zIndex={img.zIndex || 10} // 确保图片始终在占位符之上
                      cornerRadius={Math.max(4, Math.min(16, img.scale * 8))}
                    />
                  );
                })}
                
                <Transformer
                  ref={trRef}
                  boundBoxFunc={(_oldBox, newBox) => newBox}
                  borderColor="#6366F1"
                  borderStrokeWidth={3}
                  anchorCornerRadius={6}
                  anchorFill="#FFFFFF"
                  anchorStroke="#6366F1"
                  anchorSize={10}
                />
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
      
      {/* 空状态提示 */}
      {images.length === 0 && !state.selectedTemplateId && (
        <div className="mt-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
            <div className="text-3xl">📷</div>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">开始设计</h3>
          <p className="text-slate-500 text-sm">从左侧上传一些图片来创建拼贴图</p>
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;
