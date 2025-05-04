import { Tensor } from 'onnxruntime-web';
/**
 * 将图片转换为tensor
 * @param imageSource 图片源，可以是File、Blob、HTMLImageElement或ImageData
 * @returns Promise<Tensor> 返回一个包含图片数据的tensor
 */
export const imageToTensor = async (
  imageSource: File | Blob | HTMLImageElement | ImageData
): Promise<Tensor> => {
  const targetWidth = 224;
  const targetHeight = 224;

  // 创建canvas元素并设置目标尺寸
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法获取canvas上下文');
  }

  try {
    // 处理不同类型的图片源并绘制到目标尺寸的canvas上
    if (imageSource instanceof File || imageSource instanceof Blob) {
      // 如果是File或Blob，先转换为ImageBitmap
      const img = await createImageBitmap(imageSource);
      // 绘制并缩放图片到 targetWidth x targetHeight
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      img.close(); // 释放 ImageBitmap 资源
    } else if (imageSource instanceof HTMLImageElement) {
      // 如果是HTMLImageElement，直接绘制并缩放
      ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);
    } else if (imageSource instanceof ImageData) {
      // 如果是ImageData，需要先创建一个临时的canvas来绘制原始ImageData
      // 然后将临时canvas绘制并缩放到目标canvas
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) throw new Error('无法创建临时Canvas上下文');
      tempCanvas.width = imageSource.width;
      tempCanvas.height = imageSource.height;
      tempCtx.putImageData(imageSource, 0, 0);
      // 将临时canvas内容绘制并缩放到目标尺寸
      ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
    } else {
      throw new Error('不支持的图片源类型');
    }

    // 获取调整后尺寸的图片数据
    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const { data: rgbaData } = imageData; // width 和 height 现在是 targetWidth/targetHeight

    // 将图片数据转换为Float32Array (存储在 将图片数据转换为Float32Array 中)
    const float32Data = new Float32Array(targetWidth * targetHeight * 3);
    let j = 0; // index for float16Data
    for (let i = 0; i < rgbaData.length; i += 4) {
      // 将像素值归一化到[0, 1]范围
      const r = rgbaData[i] / 255.0;
      const g = rgbaData[i + 1] / 255.0;
      const b = rgbaData[i + 2] / 255.0;
      // Skip Alpha: rgbaData[i + 3]

      // 转换为 float16 并存储
      float32Data[j++] = r;
      float32Data[j++] = g;
      float32Data[j++] = b;
    }

    // 创建tensor，使用目标尺寸
    // 注意：tensor的形状是 [1, channels, height, width]
    // 模型期望输入类型为 float16
    const tensor = new Tensor('float32', float32Data, [1, 3, targetHeight, targetWidth]);

    return tensor;
  } catch (error) {
    console.error('图片转tensor时出错:', error);
    throw error;
  }
};
