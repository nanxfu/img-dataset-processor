import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { styled } from 'styled-components';

import { useCropRegionDrawer } from '../../../hooks/useCropRegionDrawer';
import { Image as ImageType } from '../../../store/useImageStore';
import { useImageStore } from '../../../store/useImageStore';

import ThumbnailPanel from './ThumbnailPanel';

const CanvasControlsPanel = styled.div`
  /* 布局属性 */
  display: flex;
  position: relative;
  flex-direction: column;
  flex: 1;

  /* 盒模型属性 */
  margin: 24px;
  margin-left: 0;
  border-radius: 16px;

  /* 视觉属性 */
  background-color: #fff;
`;

const OperationArea = styled.div`
  /* 盒模型属性 */
  width: 100%;
  height: 100%;
  padding: 16px;
`;

const OutlineArea = styled.div`
  /* 布局属性 */
  position: relative;
  overflow: hidden;

  /* 盒模型属性 */
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(255, 105, 180, 0.5);
  border-radius: 16px;
`;

const MetadataPanel = styled.div`
  /* 布局属性 */
  position: absolute;
  bottom: 0;
  left: 0;

  /* 盒模型属性 */
  margin: 16px;
  padding: 8px 16px;
  border-radius: 12px;

  /* 视觉属性 */
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);

  /* 文本属性 */
  color: #333;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;

  /* 动画属性 */
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;

const ZoomControls = styled.div`
  /* 布局属性 */
  position: absolute;
  right: 0;
  bottom: 0;

  /* 盒模型属性 */
  margin: 16px;
  padding: 8px;
  border-radius: 12px;

  /* 视觉属性 */
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);

  /* 动画属性 */
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ZoomButton = styled.button`
  /* 布局属性 */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 盒模型属性 */
  width: 32px;
  height: 32px;
  margin: 4px;
  padding: 0;
  border: none;
  border-radius: 8px;

  /* 视觉属性 */
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  font-size: 16px;
  cursor: pointer;

  /* 动画属性 */
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PreviewImage = styled.img`
  /* 布局属性 */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  /* 盒模型属性 */
  max-width: 100%;
  max-height: 100%;

  /* 视觉属性 */
  filter: brightness(0.5);
  object-fit: contain;

  /* 交互属性 */
  cursor: crosshair;
  user-select: none;

  /* 动画属性 */
  transition: transform 0.3s ease-in-out;
`;

const CropRegionPreview = styled.img`
  /* 布局属性 */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  /* 盒模型属性 */
  max-width: 100%;
  max-height: 100%;

  /* 视觉属性 */
  object-fit: contain;

  /* 交互属性 */
  user-select: none;
  pointer-events: none;

  /* 动画属性 */
  transition:
    transform 0.3s ease-in-out,
    clip-path 0.3s ease-in-out;
  will-change: transform, clip-path;
`;

const ImagePreview: React.FC = () => {
  const images = useImageStore(state => state.images);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scalingFactor, setScalingFactor] = useState(1);
  const [previewImage, setPreviewImage] = useState<ImageType>();
  const maxScalingFactor = 2;
  const minScalingFactor = 0.5;
  const { cropRegion, handleMouseDown, handleMouseMove, handleMouseUp } = useCropRegionDrawer({
    imageRef,
  });

  useEffect(() => {
    setPreviewImage(images[0]);
  }, [images]);

  const cropRegionArea = useMemo(() => {
    if (!imageRef.current) return 0;
    return (
      (imageRef.current!.clientWidth / scalingFactor - cropRegion.left - cropRegion.right) *
      (imageRef.current!.clientHeight / scalingFactor - cropRegion.top - cropRegion.bottom)
    );
  }, [cropRegion, scalingFactor]);

  const handleMouseUpEvent = useCallback(() => {
    handleMouseUp();
    const imageArea = imageRef.current!.naturalWidth * imageRef.current!.naturalHeight;
    const cropRegionAreaPercentage = cropRegionArea / imageArea;
    // setScalingFactor(Math.min(maxScalingFactor, scalingFactor + 0.4));
  }, [handleMouseUp, cropRegionArea, scalingFactor]);

  const handleZoomIn = useCallback(() => {
    setScalingFactor(prev => Math.min(maxScalingFactor, prev + 0.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScalingFactor(prev => Math.max(minScalingFactor, prev - 0.2));
  }, []);

  return (
    <CanvasControlsPanel>
      <OperationArea>
        <OutlineArea>
          {previewImage && (
            <React.Fragment>
              <PreviewImage
                ref={imageRef}
                src={previewImage.url}
                alt={previewImage.name}
                draggable={false}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpEvent}
                onMouseLeave={handleMouseUpEvent}
                style={{
                  transform: `translateX(-50%) scale(${scalingFactor})`,
                }}
              />
              <CropRegionPreview
                draggable={false}
                src={previewImage.url}
                alt={previewImage.name}
                style={{
                  transform: `translateX(-50%) scale(${scalingFactor})`,
                  clipPath: `inset(${cropRegion.top / scalingFactor}px ${
                    cropRegion.right / scalingFactor
                  }px ${cropRegion.bottom / scalingFactor}px ${cropRegion.left / scalingFactor}px)`,
                }}
              />
            </React.Fragment>
          )}
          <MetadataPanel>
            <div>
              <span>800 × 600px | 2.3MB</span>
            </div>
          </MetadataPanel>
          <ZoomControls>
            <ZoomButton
              onClick={handleZoomIn}
              disabled={scalingFactor >= maxScalingFactor}
              title="放大"
            >
              +
            </ZoomButton>
            <ZoomButton
              onClick={handleZoomOut}
              disabled={scalingFactor <= minScalingFactor}
              title="缩小"
            >
              -
            </ZoomButton>
          </ZoomControls>
        </OutlineArea>
      </OperationArea>
      <ThumbnailPanel />
    </CanvasControlsPanel>
  );
};

export default ImagePreview;
