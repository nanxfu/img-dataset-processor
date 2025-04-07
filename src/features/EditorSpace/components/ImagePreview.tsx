import { useRef } from "react";
import { styled } from "styled-components";
import { useImageStore } from "../../../store/useImageStore";
import ThumbnailPanel from "./ThumbnailPanel";
import React from "react";
import { useCropRegionDrawer } from "../../../hooks/useCropRegionDrawer";

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
  const images = useImageStore((state) => state.images);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const {
    cropRegion,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCropRegionDrawer({ imageRef });

  return (
    <CanvasControlsPanel>
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {images && images.length > 0 && (
          <React.Fragment>
            <img
              ref={imageRef}
              src={images[0].url}
              alt={images[0].name}
              className="maskImage"
              draggable={false}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                maxWidth: "100%",
                maxHeight: "100%",
                filter: "brightness(0.5)",
                objectFit: "contain",
                cursor: "crosshair",
                userSelect: "none",
              }}
            />
            <img
              className="cropRegionPreview"
              src={images[0].url}
              alt={images[0].name}
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                maxWidth: "100%",
                maxHeight: "100%",
                clipPath: `inset(${cropRegion.top}px ${cropRegion.right}px ${cropRegion.bottom}px ${cropRegion.left}px)`,
                objectFit: "contain",
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
