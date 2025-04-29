const useResizeImage = ({
  imageSource,
  resizedWidth,
  resizedHeight,
}: {
  imageSource: CanvasImageSource;
  resizedWidth: number;
  resizedHeight: number;
}) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  ctx.drawImage(imageSource, 0, 0, resizedWidth, resizedHeight);

  const resizedImage = new Image();
  resizedImage.src = canvas.toDataURL();

  return { resizedImage };
};

export default useResizeImage;
