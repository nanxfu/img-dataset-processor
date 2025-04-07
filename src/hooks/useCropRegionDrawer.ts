import { useState, useCallback } from "react";

export interface Point {
  x: number;
  y: number;
}

export interface CropRegion {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface UseCropRegionDrawerProps {
  imageRef: React.RefObject<HTMLImageElement>;
  initialRegion?: CropRegion;
}

export interface UseCropRegionDrawerResult {
  cropRegion: CropRegion;
  isDrawing: boolean;
  handleMouseDown: (e: React.MouseEvent<HTMLImageElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLImageElement>) => void;
  handleMouseUp: () => void;
}

export const useCropRegionDrawer = ({ 
  imageRef, 
  initialRegion = { top: 200, right: 200, bottom: 200, left: 200 } 
}: UseCropRegionDrawerProps): UseCropRegionDrawerResult => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<Point>({ x: 0, y: 0 });
  const [cropRegion, setCropRegion] = useState<CropRegion>(initialRegion);

  const getRelativePosition = useCallback((e: React.MouseEvent<HTMLImageElement>): Point | null => {
    if (!imageRef.current) return null;
    
    const rect = imageRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, [imageRef]);

  const calculateCropRegion = useCallback((start: Point, current: Point, imageWidth: number, imageHeight: number): CropRegion => {
    const width = Math.abs(current.x - start.x);
    const height = Math.abs(current.y - start.y);
    const left = Math.min(current.x, start.x);
    const top = Math.min(current.y, start.y);

    return {
      top,
      right: imageWidth - (left + width),
      bottom: imageHeight - (top + height),
      left,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    const pos = getRelativePosition(e);
    if (!pos) return;
    
    setIsDrawing(true);
    setStartPos(pos);
  }, [getRelativePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDrawing || !imageRef.current) return;

    const currentPos = getRelativePosition(e);
    if (!currentPos) return;

    const rect = imageRef.current.getBoundingClientRect();
    const newRegion = calculateCropRegion(
      startPos,
      currentPos,
      rect.width,
      rect.height
    );

    setCropRegion(newRegion);
  }, [isDrawing, imageRef, startPos, getRelativePosition, calculateCropRegion]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  return {
    cropRegion,
    isDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}; 