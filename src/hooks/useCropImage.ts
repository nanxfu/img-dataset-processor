import { useCallback } from 'react';

interface CropRegion {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface UseCropImageProps {
  imageNode: HTMLImageElement;
  cropRegion: CropRegion;
  displayName?: string;
}

interface CroppedImageResult {
  blob: Blob | null;
  url: string | null;
  width: number;
  height: number;
}

export const useCropImage = ({
  imageNode,
  cropRegion,
  displayName = 'cropped_image',
}: UseCropImageProps) => {
  const calculateScalingFactor = useCallback(() => {
    if (!imageNode) return 1;

    const { naturalWidth, naturalHeight } = imageNode;
    const { clientWidth, clientHeight } = imageNode;
    return Math.min(clientWidth / naturalWidth, clientHeight / naturalHeight);
  }, [imageNode]);

  const getCroppedImage = useCallback(async (): Promise<CroppedImageResult> => {
    if (!imageNode) {
      return { blob: null, url: null, width: 0, height: 0 };
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { blob: null, url: null, width: 0, height: 0 };
    }

    const scalingFactor = calculateScalingFactor();

    // 设置画布尺寸为裁剪区域大小
    const width = (imageNode.clientWidth - cropRegion.left - cropRegion.right) / scalingFactor;
    const height = (imageNode.clientHeight - cropRegion.top - cropRegion.bottom) / scalingFactor;
    canvas.width = width;
    canvas.height = height;

    // 绘制裁剪后的图片
    ctx.drawImage(
      imageNode,
      cropRegion.left / scalingFactor,
      cropRegion.top / scalingFactor,
      width,
      height,
      0,
      0,
      width,
      height
    );

    return new Promise<CroppedImageResult>(resolve => {
      canvas.toBlob(blob => {
        if (!blob) {
          resolve({ blob: null, url: null, width, height });
          return;
        }

        const url = URL.createObjectURL(blob);
        resolve({ blob, url, width, height });
      }, 'image/png');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    calculateScalingFactor,
    cropRegion.bottom,
    cropRegion.left,
    cropRegion.right,
    cropRegion.top,
  ]);

  const exportCroppedImage = useCallback(async () => {
    const { blob, url } = await getCroppedImage();
    if (!blob || !url) return;

    const a = document.createElement('a');
    a.href = url;
    a.download = `${displayName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getCroppedImage, displayName]);

  return {
    getCroppedImage,
    exportCroppedImage,
  };
};
