import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { styled } from 'styled-components';

import { useCropRegionDrawer } from '../../../hooks/useCropRegionDrawer';
import { Image as ImageType } from '../../../store/useImageStore';
import { useImageStore } from '../../../store/useImageStore';

import ThumbnailPanel from './ThumbnailPanel';

const CanvasControlsPanel = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  margin: 24px;
  margin-left: 0;
  flex-direction: column;
  background-color: #fff;
  border-radius: 16px;
`;

const ImagePreview: React.FC = () => {
  const images = useImageStore(state => state.images);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scalingFactor, setScalingFactor] = useState(1);
  const [previewImage, setPreviewImage] = useState<ImageType>();
  const maxScalingFactor = 2;
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
    // 计算Corp Region占原始宽高图片的百分比。占的越少放大越大
    const imageArea = imageRef.current!.naturalWidth * imageRef.current!.naturalHeight;
    const cropRegionAreaPercentage = cropRegionArea / imageArea;
    // TODO: 优化放大体验
    setScalingFactor(Math.min(maxScalingFactor, scalingFactor + 0.4));
  }, [handleMouseUp, cropRegionArea, scalingFactor]);

  return (
    <CanvasControlsPanel>
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        {previewImage && (
          <React.Fragment>
            <img
              ref={imageRef}
              src={previewImage.url}
              alt={previewImage.name}
              className="maskImage"
              draggable={false}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpEvent}
              onMouseLeave={handleMouseUp}
              style={{
                position: 'absolute',
                left: '50%',
                transform: `translateX(-50%) scale(${scalingFactor})`,
                maxWidth: '100%',
                maxHeight: '100%',
                filter: 'brightness(0.5)',
                objectFit: 'contain',
                cursor: 'crosshair',
                userSelect: 'none',
                transition: 'transform 0.3s ease-in-out',
              }}
            />
            <img
              className="cropRegionPreview"
              draggable={false}
              src={images[0].url}
              alt={images[0].name}
              style={{
                position: 'absolute',
                left: '50%',
                transform: `translateX(-50%) scale(${scalingFactor})`,
                maxWidth: '100%',
                maxHeight: '100%',
                clipPath: `inset(${cropRegion.top / scalingFactor}px ${
                  cropRegion.right / scalingFactor
                }px ${cropRegion.bottom / scalingFactor}px ${cropRegion.left / scalingFactor}px)`,
                objectFit: 'contain',
                userSelect: 'none',
                transition: 'transform 0.3s ease-in-out',
              }}
            />
          </React.Fragment>
        )}
      </div>
      <ThumbnailPanel />
    </CanvasControlsPanel>
  );
};

export default ImagePreview;
