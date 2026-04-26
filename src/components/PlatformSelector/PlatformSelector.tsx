import React from 'react';
import { cn } from '@/lib/utils';

export type PlatformType = 'xiaohongshu' | 'douyin' | 'custom';

export interface PlatformSelectorProps {
  platform: PlatformType;
  setPlatform: (platform: PlatformType) => void;
  canvasWidth: number;
  setCanvasWidth: (width: number) => void;
  canvasHeight: number;
  setCanvasHeight: (height: number) => void;
  className?: string;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platform,
  setPlatform,
  canvasWidth,
  setCanvasWidth,
  canvasHeight,
  setCanvasHeight,
  className,
}) => {
  const platformPresets = {
    xiaohongshu: { width: 1080, height: 1080 },
    douyin: { width: 1080, height: 1920 },
  };

  const handlePlatformChange = (newPlatform: PlatformType) => {
    setPlatform(newPlatform);
    if (newPlatform in platformPresets) {
      const { width, height } = platformPresets[newPlatform as keyof typeof platformPresets];
      setCanvasWidth(width);
      setCanvasHeight(height);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-sm font-medium mb-3">平台选择</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              platform === 'xiaohongshu'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
            onClick={() => handlePlatformChange('xiaohongshu')}
          >
            小红书
          </button>
          <button
            type="button"
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              platform === 'douyin'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
            onClick={() => handlePlatformChange('douyin')}
          >
            抖音
          </button>
          <button
            type="button"
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              platform === 'custom'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
            onClick={() => handlePlatformChange('custom')}
          >
            自定义
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">画布尺寸</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-muted-foreground">宽度 (px)</label>
            <input
              type="number"
              min="100"
              max="4000"
              value={canvasWidth}
              onChange={(e) => {
                setCanvasWidth(Number(e.target.value));
                if (platform !== 'custom') {
                  setPlatform('custom');
                }
              }}
              className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-muted-foreground">高度 (px)</label>
            <input
              type="number"
              min="100"
              max="4000"
              value={canvasHeight}
              onChange={(e) => {
                setCanvasHeight(Number(e.target.value));
                if (platform !== 'custom') {
                  setPlatform('custom');
                }
              }}
              className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
