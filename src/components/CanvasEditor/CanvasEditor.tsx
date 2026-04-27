import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Transformer } from 'react-konva';
import { useApp } from '../../context/AppContext';
import { useGridLayout } from '../../hooks/useGridLayout';

const CanvasEditor: React.FC = () => {
  const { state, updateImage, selectImage } = useApp();
  const { applyGridLayout } = useGridLayout();
  const imageRefs = useRef<{ [key: string]: any }>({});
  const trRef = useRef<any>(null);

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
    updateImage(id, {
      x: node.x(),
      y: node.y(),
      scale: node.scaleX(),
      rotation: node.rotation(),
    });
  };

  const { canvasConfig, images } = state;
  const containerWidth = Math.min(650, canvasConfig.width * 0.8);
  const scale = containerWidth / canvasConfig.width;
  const containerHeight = canvasConfig.height * scale;

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="relative">
        <div className="absolute -inset-8 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-3xl -z-10 blur-2xl" />
        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
          <div className="relative" style={{ width: containerWidth, height: containerHeight }}>
            <div className="absolute -inset-4 bg-slate-100/50 rounded-2xl -z-10" />
            <Stage
              width={canvasConfig.width * scale}
              height={canvasConfig.height * scale}
              scaleX={scale}
              scaleY={scale}
              onClick={handleStageClick}
              className="rounded-xl overflow-hidden shadow-xl"
            >
              <Layer>
                <Rect
                  x={0}
                  y={0}
                  width={canvasConfig.width}
                  height={canvasConfig.height}
                  fill={canvasConfig.backgroundColor}
                  cornerRadius={canvasConfig.borderRadius}
                  stroke={canvasConfig.borderColor}
                  strokeWidth={canvasConfig.borderWidth}
                  shadowColor={canvasConfig.shadowColor}
                  shadowBlur={canvasConfig.shadowBlur}
                  shadowOffsetX={canvasConfig.shadowOffsetX}
                  shadowOffsetY={canvasConfig.shadowOffsetY}
                />
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
                      draggable={state.layoutConfig.type === 'free'}
                      onClick={(e) => handleImageClick(e, img.id)}
                      onTransformEnd={(e) => handleTransformEnd(e, img.id)}
                      zIndex={img.zIndex}
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
      {images.length === 0 && (
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
