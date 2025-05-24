import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { styled } from 'styled-components';

import ActionButton from '../../../components/ActionButton';
import { useCropImage } from '../../../hooks/useCropImage';
import { useCropRegionDrawer } from '../../../hooks/useCropRegionDrawer';
import { useImageObserver } from '../../../hooks/useImageObserver';
import { useEditorStore } from '../../../store/useEditorStore';

import ThumbnailPanel from './ThumbnailPanel';
import WelcomeScreen from './WelcomeScreen';

const CanvasContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  flex: 1;
  margin: 16px;
  border-radius: 16px;
  background-color: #fff;
  border: 1px solid #f0f0f0;
`;

const CanvasArea = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px;
`;

const ImageViewport = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(255, 105, 180, 0.5);
  border-radius: 16px;
`;

const MetadataOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 16px;
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #333;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
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
  position: absolute;
  left: 0;
  bottom: 64px;
  margin: 16px;
  padding: 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ZoomButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 4px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  font-size: 16px;
  cursor: pointer;
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
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: crosshair;
  user-select: none;
  transition: transform 0.3s ease-in-out;
`;

const CropRegionPreview = styled.img<{ $isDrawing: boolean }>`
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  transition:
    transform 0.3s ease-in-out,
    ${props => (!props.$isDrawing ? 'clip-path 0.3s ease-in-out' : 'none')};
  will-change: transform, clip-path;
`;

const ModifiedTag = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(255, 105, 180, 0.8);
  color: white;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const maxScalingFactor = 2;
const minScalingFactor = 1;

const ImageCanvas: React.FC = () => {
  const images = useEditorStore(state => state.images);
  const selectedImage = useEditorStore(state => state.selectedImage);
  const isCropMode = useEditorStore(state => state.isCropMode);
  const applyImageCrop = useEditorStore(state => state.applyImageCrop);
  const displaySize = useEditorStore(state => state.displaySize);
  const naturalSize = useEditorStore(state => state.naturalSize);
  const currentTool = useEditorStore(state => state.currentTool);

  const [scalingFactor, setScalingFactor] = useState(1);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const { measuredRef, imgNode } = useImageObserver();

  const { cropRegion, isDrawing, handleMouseDown, handleMouseMove, handleMouseUp } =
    useCropRegionDrawer({
      imageNode: imgNode as HTMLImageElement,
      initialRegion: isCropMode ? { top: 200, right: 200, bottom: 200, left: 200 } : undefined,
      scalingFactor,
    });

  const { exportCroppedImage } = useCropImage({
    imageNode: imgNode as HTMLImageElement,
    cropRegion,
    displayName: selectedImage ? `cropped_${selectedImage.name}` : 'cropped_image',
  });

  useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      useEditorStore.getState().selectImage(images[0].id);
    }
  }, [images, selectedImage]);

  useEffect(() => {
    let objectUrl: string | undefined;
    if (selectedImage?.file) {
      objectUrl = URL.createObjectURL(selectedImage.file);
      setImageUrl(objectUrl);
    } else {
      setImageUrl(undefined);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setImageUrl(undefined);
      }
    };
  }, [selectedImage?.file]);

  const handleMouseUpEvent = useCallback(() => {
    handleMouseUp();
    if (imgNode && naturalSize.width > 0 && naturalSize.height > 0) {
      const imageArea = naturalSize.width * naturalSize.height;
    }
  }, [handleMouseUp, imgNode, naturalSize]);

  const handleZoomIn = useCallback(() => {
    setScalingFactor(prev => Math.min(maxScalingFactor, prev + 0.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScalingFactor(prev => Math.max(minScalingFactor, prev - 0.2));
  }, []);

  const handleApplyCrop = useCallback(() => {
    if (selectedImage) {
      applyImageCrop(selectedImage.id, cropRegion);
      useEditorStore.getState().setCropMode(false);
    }
  }, [selectedImage, cropRegion, applyImageCrop]);

  // 判断是否处于裁剪模式
  const shouldShowCropInterface = currentTool === 'crop' && isCropMode;

  return (
    <CanvasContainer>
      <CanvasArea>
        {images.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <ImageViewport>
            {selectedImage && imageUrl && (
              <React.Fragment>
                {selectedImage.isModified && <ModifiedTag>已修改</ModifiedTag>}
                <PreviewImage
                  ref={measuredRef}
                  src={imageUrl}
                  alt={selectedImage.name}
                  draggable={false}
                  onMouseDown={shouldShowCropInterface ? handleMouseDown : undefined}
                  onMouseMove={shouldShowCropInterface ? handleMouseMove : undefined}
                  onMouseUp={shouldShowCropInterface ? handleMouseUpEvent : undefined}
                  onMouseLeave={shouldShowCropInterface ? handleMouseUpEvent : undefined}
                  style={{
                    transform: `scale(${scalingFactor})`,
                    cursor: shouldShowCropInterface ? 'crosshair' : 'default',
                    filter: shouldShowCropInterface ? 'brightness(0.5)' : 'none',
                  }}
                />
                {shouldShowCropInterface && (
                  <CropRegionPreview
                    draggable={false}
                    src={imageUrl}
                    alt={selectedImage.name}
                    $isDrawing={isDrawing}
                    style={{
                      transform: `scale(${scalingFactor})`,
                      clipPath: `inset(${cropRegion.top}px ${cropRegion.right}px ${
                        cropRegion.bottom
                      }px ${cropRegion.left}px)`,
                    }}
                  />
                )}
              </React.Fragment>
            )}
            <MetadataOverlay>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {selectedImage && (
                  <span>
                    {selectedImage.name} | {selectedImage.file?.type} | Natural: {naturalSize.width}
                    x{naturalSize.height} | Display: {displaySize.width}x{displaySize.height}
                  </span>
                )}
                {shouldShowCropInterface && (
                  <>
                    <ActionButton onClick={handleApplyCrop}>应用裁剪</ActionButton>
                    <ActionButton
                      onClick={exportCroppedImage}
                      backgroundColor="#4a90e2"
                      hoverBackgroundColor="#357abd"
                    >
                      导出裁剪图片
                    </ActionButton>
                  </>
                )}
              </div>
            </MetadataOverlay>
            {selectedImage && imageUrl && (
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
            )}
          </ImageViewport>
        )}
      </CanvasArea>
      <ThumbnailPanel isVisible={true} />
    </CanvasContainer>
  );
};

export default ImageCanvas;
