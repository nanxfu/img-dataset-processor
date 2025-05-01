const resizeImage = async ({
  imageSource,
  resizedWidth,
  resizedHeight,
}: {
  imageSource: ImageBitmapSource;
  resizedWidth: number;
  resizedHeight: number;
}) => {
  const canvas = document.createElement('canvas');
  canvas.width = resizedWidth;
  canvas.height = resizedHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  try {
    const img = await createImageBitmap(imageSource);
    // 绘制到 canvas
    ctx.drawImage(img, 0, 0, resizedWidth, resizedHeight);

    // 获取调整大小后的图像
    const resizedImage = await new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob);
      });
    });

    return { resizedImage };
  } catch (error) {
    console.error('调整图像大小时出错:', error);
    return { resizedImage: null };
  }
};

export default resizeImage;
