import { useCallback, useState } from 'react';

// TODO - 增加图片缩放功能
export interface Point {
  x: number;
  y: number;
}
// Crop Area for the image Ref
export interface CropRegion {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface UseCropRegionDrawerProps {
  imageNode: HTMLImageElement;
  initialRegion?: CropRegion;
  scalingFactor: number;
}

export interface UseCropRegionDrawerResult {
  cropRegion: CropRegion;
  isDrawing: boolean;
  handleMouseDown: (e: React.MouseEvent<HTMLImageElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLImageElement>) => void;
  handleMouseUp: () => void;
}
export const caculateCropCenter = ({ top, right, bottom, left }: CropRegion) => {
  const width = right - left;
  const height = bottom - top;
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
};
export const useCropRegionDrawer = ({
  imageNode,
  initialRegion = { top: 200, right: 200, bottom: 200, left: 200 },
  scalingFactor,
}: UseCropRegionDrawerProps): UseCropRegionDrawerResult => {
  // 使用提供的imageRef或Context中的imageRef

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<Point>({ x: 0, y: 0 });
  const [cropRegion, setCropRegion] = useState<CropRegion>(initialRegion);

  /**
   * 计算鼠标事件相对于图片元素的坐标位置
   * @param e - 鼠标事件对象
   * @returns 返回相对于图片左上角的坐标点，如果图片元素不存在则返回null
   */
  const getRelativePosition = useCallback(
    (e: React.MouseEvent<HTMLImageElement>): Point | null => {
      if (!imageNode) return null;

      const imageBoundingBox = imageNode.getBoundingClientRect();

      return {
        x: (e.clientX - imageBoundingBox.left) / scalingFactor,
        y: (e.clientY - imageBoundingBox.top) / scalingFactor,
      };
    },
    [imageNode, scalingFactor]
  );

  const calculateCropRegion = useCallback(
    (start: Point, current: Point, imageWidth: number, imageHeight: number): CropRegion => {
      const width = Math.abs(current.x - start.x);
      const height = Math.abs(current.y - start.y);
      const left = Math.min(current.x, start.x);
      const top = Math.min(current.y, start.y);

      return {
        top,
        right: imageWidth / scalingFactor - (left + width),
        bottom: imageHeight / scalingFactor - (top + height),
        left,
      };
    },
    [scalingFactor]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      const pos = getRelativePosition(e);
      if (!pos) return;

      setIsDrawing(true);
      setStartPos(pos);
    },
    [getRelativePosition]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      if (!isDrawing || !imageNode) return;

      const currentPos = getRelativePosition(e);
      if (!currentPos) return;

      const rect = imageNode.getBoundingClientRect();
      const newRegion = calculateCropRegion(startPos, currentPos, rect.width, rect.height);
      setCropRegion(newRegion);
    },
    [isDrawing, imageNode, startPos, getRelativePosition, calculateCropRegion]
  );

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
