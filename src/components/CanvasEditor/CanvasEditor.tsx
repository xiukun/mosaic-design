import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Transformer, Text, Group } from 'react-konva';
import { useApp } from '../../context/AppContext';
import { useGridLayout } from '../../hooks/useGridLayout';
import { getTemplateById } from '../../utils/templates';
import { ImageUploadUseCase, ImageTransformUseCase } from '../../useCases/imageUseCase';
import ImageToolbar from '../ImageToolbar/ImageToolbar';

const CanvasEditor: React.FC = () => {
  const { state, updateImage, selectImage, addImageWithPosition } = useApp();
  const { applyGridLayout } = useGridLayout();
  const imageRefs = useRef<{ [key: string]: any }>({});
  const trRef = useRef<any>(null);
  
  const imageUploadUseCase = new ImageUploadUseCase();
  const imageTransformUseCase = new ImageTransformUseCase();

  useEffect(() => {
    if (state.images.length > 0 && state.layoutConfig.type === 'grid') {
      applyGridLayout();
    }
  }, [state.images.length, state.layoutConfig.type]);

  useEffect(() => {
    if (trRef.current && state.selectedImageId) {
      const selectedImage = state.images.find(img => img.id === state.selectedImageId);
      if (selectedImage && !selectedImage.placeholderId) {
        const nodes = [imageRefs.current[state.selectedImageId]];
        trRef.current.nodes(nodes);
        trRef.current.getLayer()?.batchDraw();
      } else if (trRef.current) {
        trRef.current.nodes([]);
      }
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
    const updates = imageTransformUseCase.execute(id, node, state);
    if (Object.keys(updates).length > 0) {
      updateImage(id, updates);
    }
  };

  const handlePlaceholderClick = (placeholderId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        try {
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

  const handleBoundImageDragMove = (e: any, image: any, placeholder: any) => {
    const node = e.target;
    const currentCenterX = node.x();
    const currentCenterY = node.y();
    
    // 计算缩放后的图片尺寸（考虑旋转）
    const isRotated90or270 = (image.rotation % 180) === 90;
    const effectiveWidth = isRotated90or270 ? image.height : image.width;
    const effectiveHeight = isRotated90or270 ? image.width : image.height;
    const imgWidth = effectiveWidth * image.scale;
    const imgHeight = effectiveHeight * image.scale;
    
    // 计算边界限制：图片中心的可移动范围
    const minCenterX = placeholder.x + imgWidth / 2;
    const maxCenterX = placeholder.x + placeholder.width - imgWidth / 2;
    const minCenterY = placeholder.y + imgHeight / 2;
    const maxCenterY = placeholder.y + placeholder.height - imgHeight / 2;

    // 应用约束
    let newCenterX = Math.max(minCenterX, Math.min(maxCenterX, currentCenterX));
    let newCenterY = Math.max(minCenterY, Math.min(maxCenterY, currentCenterY));

    node.x(newCenterX);
    node.y(newCenterY);
  };

  const handleBoundImageDragEnd = (e: any, imageId: string) => {
    const node = e.target;
    const image = state.images.find(img => img.id === imageId);
    if (image && image.placeholderId) {
      const placeholder = placeholders.find(p => p.id === image.placeholderId);
      if (placeholder) {
        // 计算相对于占位符中心的偏移
        const centerX = placeholder.x + placeholder.width / 2;
        const centerY = placeholder.y + placeholder.height / 2;
        const offsetX = node.x() - centerX;
        const offsetY = node.y() - centerY;
        updateImage(imageId, { offsetX, offsetY });
      }
    }
  };

  const handleFreeImageDragEnd = (e: any, imageId: string) => {
    const node = e.target;
    const updates = {
      x: node.x(),
      y: node.y()
    };
    updateImage(imageId, updates);
  };

  const { canvasConfig, images } = state;
  
  const baseWidth = canvasConfig.width;
  const baseHeight = canvasConfig.height;
  const containerWidth = Math.min(800, baseWidth * 1.2);
  const scale = containerWidth / baseWidth;

  const template = state.selectedTemplateId ? getTemplateById(state.selectedTemplateId) : null;
  const placeholders = template?.placeholders || [];

  const boundImages = images.filter(img => img.placeholderId);
  const freeImages = images.filter(img => !img.placeholderId);

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="relative w-full max-w-5xl">
        <div className="absolute -inset-12 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-3xl -z-10 blur-2xl" />
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
          {/* 工具栏放在滚动容器外面，避免被遮挡 */}
          {state.selectedImageId && (() => {
            const selectedImage = images.find(img => img.id === state.selectedImageId);
            if (selectedImage) {
              const placeholder = selectedImage.placeholderId 
                ? placeholders.find(p => p.id === selectedImage.placeholderId) 
                : null;
              const renderX = placeholder 
                ? placeholder.x + (selectedImage.offsetX || 0) 
                : selectedImage.x;
              const renderY = placeholder 
                ? placeholder.y + (selectedImage.offsetY || 0) 
                : selectedImage.y;
              const toolbarX = renderX * scale + 20;
              const toolbarY = renderY * scale + 20;
              return (
                <div 
                  className="absolute z-50"
                  style={{ 
                    left: toolbarX, 
                    top: toolbarY,
                    transform: 'translate(-50%, -100%)',
                    marginTop: '-8px'
                  }}
                >
                  <ImageToolbar image={selectedImage} />
                </div>
              );
            }
            return null;
          })()}
          <div className="relative" style={{ 
            width: containerWidth,
            maxWidth: '100%',
            maxHeight: '85vh',
            overflow: 'auto',
            padding: '20px'
          }}>
            <div className="flex justify-center">
              <Stage
                width={baseWidth * scale}
                height={baseHeight * scale}
                scaleX={scale}
                scaleY={scale}
                onClick={handleStageClick}
                className="rounded-2xl shadow-2xl"
                overflow="visible"
              >
              <Layer>
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
                  const hasImage = boundImages.some(img => img.placeholderId === placeholder.id);
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
                        zIndex={1}
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
                        zIndex={2}
                        onClick={(e) => {
                          e.cancelBubble = true;
                          handlePlaceholderClick(placeholder.id);
                        }}
                      />
                    </React.Fragment>
                  );
                })}
                
                {/* 渲染绑定的图片（带裁剪） */}
                {state.selectedTemplateId && boundImages.map((img) => {
                  const placeholder = placeholders.find(p => p.id === img.placeholderId);
                  if (!placeholder) return null;
                  
                  const konvaImg = new window.Image();
                  konvaImg.src = img.src;
                  
                  const borderRadiusPercent = state.layoutConfig.borderRadius || 10;
                  const isRotated90or270 = (img.rotation % 180) === 90;
                  const scaledWidth = isRotated90or270 ? img.height * img.scale : img.width * img.scale;
                  const scaledHeight = isRotated90or270 ? img.width * img.scale : img.height * img.scale;
                  const maxRadius = Math.min(scaledWidth, scaledHeight) / 2;
                  const cornerRadius = (borderRadiusPercent / 100) * maxRadius;
                  
                  const offsetX = img.width / 2;
                  const offsetY = img.height / 2;
                  
                  // 计算图片位置：使用图片的 x, y 加上偏移量（offsetX/Y 是负值，用于居中）
                  const imageCenterX = placeholder.x + placeholder.width / 2;
                  const imageCenterY = placeholder.y + placeholder.height / 2;
                  
                  return (
                    <Group
                      key={img.id}
                      clipX={placeholder.x}
                      clipY={placeholder.y}
                      clipWidth={placeholder.width}
                      clipHeight={placeholder.height}
                    >
                      <KonvaImage
                        ref={(node) => {
                          if (node) imageRefs.current[img.id] = node;
                        }}
                        image={konvaImg}
                        x={imageCenterX}
                        y={imageCenterY}
                        width={img.width}
                        height={img.height}
                        scaleX={img.scale}
                        scaleY={img.scale}
                        rotation={img.rotation}
                        offsetX={offsetX + (img.offsetX || 0)}
                        offsetY={offsetY + (img.offsetY || 0)}
                        draggable={true}
                        onClick={(e) => handleImageClick(e, img.id)}
                        onDragMove={(e) => handleBoundImageDragMove(e, img, placeholder)}
                        onDragEnd={(e) => handleBoundImageDragEnd(e, img.id)}
                        zIndex={img.zIndex || 10}
                        cornerRadius={cornerRadius}
                      />
                    </Group>
                  );
                })}
                
                {/* 渲染自由图片 */}
                {freeImages.map((img) => {
                  const konvaImg = new window.Image();
                  konvaImg.src = img.src;
                  
                  const borderRadiusPercent = state.layoutConfig.borderRadius || 10;
                  const maxRadius = Math.min(img.width * img.scale, img.height * img.scale) / 2;
                  const cornerRadius = (borderRadiusPercent / 100) * maxRadius;
                  
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
                      onDragEnd={(e) => handleFreeImageDragEnd(e, img.id)}
                      zIndex={img.zIndex || 10}
                      cornerRadius={cornerRadius}
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
      </div>
      
      {images.length === 0 && !state.selectedTemplateId && (
        <div className="mt-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center">
            <div className="text-4xl">📷</div>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-3">开始设计</h3>
          <p className="text-slate-500 text-base">从左侧上传一些图片来创建拼贴图</p>
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;