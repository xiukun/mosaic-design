import React, { useState, useRef, useEffect } from 'react';
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
  const scale = Math.min(600 / canvasConfig.width, 400 / canvasConfig.height, 1);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-100 min-h-full">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <Stage
          width={canvasConfig.width * scale}
          height={canvasConfig.height * scale}
          scaleX={scale}
          scaleY={scale}
          onClick={handleStageClick}
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
                />
              );
            })}
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => newBox}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CanvasEditor;