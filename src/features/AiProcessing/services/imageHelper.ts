import { Tensor } from 'onnxruntime-web/webgpu';
/**
 * 将图片转换为tensor
 * @param imageSource 图片源，可以是File、Blob、HTMLImageElement或ImageData
 * @returns Promise<Tensor> 返回一个包含图片数据的tensor
 */
export const imageToTensor = async (
  imageSource: File | Blob | HTMLImageElement | ImageData
): Promise<Tensor> => {
  const targetWidth = 256;
  const targetHeight = 256;

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

    // 将图片数据转换为Float32Array，数据排列为平面格式 (RRR...GGG...BBB...)
    const numPixels = targetWidth * targetHeight;
    const float32Data = new Float32Array(numPixels * 3); // 3 channels (RGB)

    for (let i = 0; i < numPixels; i++) {
      const rSourceIdx = i * 4; // R in source RGBA data
      const gSourceIdx = i * 4 + 1; // G in source RGBA data
      const bSourceIdx = i * 4 + 2; // B in source RGBA data

      // Normalize to [0, 1]
      const r = rgbaData[rSourceIdx] / 255.0;
      const g = rgbaData[gSourceIdx] / 255.0;
      const b = rgbaData[bSourceIdx] / 255.0;

      float32Data[i] = r; // R channel part
      float32Data[i + numPixels] = g; // G channel part
      float32Data[i + numPixels * 2] = b; // B channel part
    }

    // 创建tensor，使用目标尺寸
    // 注意：tensor的形状是 [1, channels, height, width]
    const tensor = new Tensor('float32', float32Data, [1, 3, targetHeight, targetWidth]);

    return tensor;
  } catch (error) {
    console.error('图片转tensor时出错:', error);
    throw error;
  }
};

export interface ImagePatch {
  patchData: ImageData; // 图像块的ImageData
  x: number; // 图像块在原始图像中的x坐标
  y: number; // 图像块在原始图像中的y坐标
}

/**
 * 将图像分割成带有重叠的图像块
 * @param imageSource 图像源，可以是HTMLImageElement或ImageData
 * @param patchWidth 每个图像块的宽度
 * @param patchHeight 每个图像块的高度
 * @param overlap 图像块之间的重叠像素数
 * @returns ImagePatch[] 返回一个包含图像块数据及其原始位置的数组
 */
export const splitImageIntoPatches = (
  imageSource: HTMLImageElement | ImageData,
  patchWidth: number,
  patchHeight: number,
  overlap: number // 重叠的像素值
): ImagePatch[] => {
  const patches: ImagePatch[] = [];
  let sourceCanvas: HTMLCanvasElement | undefined;
  let effectiveImageSource: HTMLImageElement | HTMLCanvasElement;
  let sourceWidth: number;
  let sourceHeight: number;

  if (imageSource instanceof HTMLImageElement) {
    sourceWidth = imageSource.naturalWidth;
    sourceHeight = imageSource.naturalHeight;
    effectiveImageSource = imageSource;
  } else if (imageSource instanceof ImageData) {
    sourceWidth = imageSource.width;
    sourceHeight = imageSource.height;
    sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = sourceWidth;
    sourceCanvas.height = sourceHeight;
    const tempCtx = sourceCanvas.getContext('2d');
    if (!tempCtx) {
      throw new Error('无法获取临时源Canvas的2D上下文');
    }
    tempCtx.putImageData(imageSource, 0, 0);
    effectiveImageSource = sourceCanvas;
  } else {
    // 在TypeScript中，此分支理论上不应到达，因为类型已约束
    // 但为安全起见，可以抛出错误或返回空数组
    console.error('不支持的图像源类型');
    return [];
  }

  const strideX = patchWidth - overlap;
  const strideY = patchHeight - overlap;

  for (let y = 0; y < sourceHeight; y += strideY) {
    for (let x = 0; x < sourceWidth; x += strideX) {
      const tempPatchCanvas = document.createElement('canvas');
      tempPatchCanvas.width = patchWidth;
      tempPatchCanvas.height = patchHeight;
      const ctx = tempPatchCanvas.getContext('2d');

      if (!ctx) {
        console.error('无法为图像块创建Canvas上下文');
        continue; // 跳过这个块
      }

      // 从effectiveImageSource的(x, y)位置开始，提取一个patchWidth x patchHeight大小的区域
      // 然后将其绘制到tempPatchCanvas的(0,0)位置，大小同样为patchWidth x patchHeight
      // drawImage会自动处理源图像边界裁剪
      ctx.drawImage(
        effectiveImageSource,
        x, // 源图像中的x坐标
        y, // 源图像中的y坐标
        patchWidth, // 从源图像中截取的宽度
        patchHeight, // 从源图像中截取的高度
        0, // 在目标Canvas上绘制的x坐标
        0, // 在目标Canvas上绘制的y坐标
        patchWidth, // 在目标Canvas上绘制的宽度
        patchHeight // 在目标Canvas上绘制的高度
      );

      const patchData = ctx.getImageData(0, 0, patchWidth, patchHeight);
      patches.push({ patchData, x, y });
    }
  }
  return patches;
};

/**
 * 将ONNX模型输出的Tensor转换为ImageData。
 * 假设Tensor数据是Float32，范围[0, 1]，形状为[1, 3, H, W]。
 * @param tensor 模型输出的Tensor
 * @returns ImageData 对象
 */
export const tensorToImageData = (tensor: Tensor): ImageData => {
  // 验证Tensor的维度是否符合预期 [1, 3, H, W]
  if (tensor.dims.length !== 4 || tensor.dims[0] !== 1 || tensor.dims[1] !== 3) {
    console.error('Expected tensor shape [1, 3, H, W], but got', tensor.dims);
    throw new Error(`Invalid tensor shape. Expected [1, 3, H, W], got ${tensor.dims.join('x')}`);
  }

  const outputHeight = tensor.dims[2]; // H from [1, C, H, W]
  const outputWidth = tensor.dims[3]; // W from [1, C, H, W]

  const data = tensor.data as Float32Array;
  const redChannel = data.slice(0, outputWidth * outputHeight);
  const greenChannel = data.slice(outputWidth * outputHeight, 2 * outputWidth * outputHeight);
  const blueChannel = data.slice(2 * outputWidth * outputHeight, 3 * outputWidth * outputHeight);

  const imageDataArray = new Uint8ClampedArray(outputWidth * outputHeight * 4);
  for (let i = 0; i < outputWidth * outputHeight; i++) {
    imageDataArray[i * 4 + 0] = redChannel[i] * 255; // R
    imageDataArray[i * 4 + 1] = greenChannel[i] * 255; // G
    imageDataArray[i * 4 + 2] = blueChannel[i] * 255; // B
    imageDataArray[i * 4 + 3] = 255; // Alpha (opaque)
  }
  return new ImageData(imageDataArray, outputWidth, outputHeight);
};

const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error('FileReader did not successfully read the file.'));
      }
    };
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * 使用分块处理和ONNX模型放大图像。
 * @param imageSource 原始图像 (File, HTMLImageElement, 或 ImageData)
 * @param loadModelFn 加载ONNX模型的函数
 * @returns Promise<ImageData> 放大后的图像数据
 */
export const upscaleImageWithPatches = async (
  imageSource: File | HTMLImageElement | ImageData,
  loadModelFn: (modelIdentifier: string, modelPath: string) => Promise<any>
): Promise<ImageData> => {
  console.log('🚀 开始图像放大处理...');
  console.time('⏱️ 总处理时间');

  const MODEL_PATH = '/models/4xNomos2.onnx';
  const INPUT_PATCH_WIDTH = 256;
  const INPUT_PATCH_HEIGHT = 256;
  const UPSCALE_FACTOR = 4;
  const OVERLAP = 32;

  console.time('⏱️ 模型加载时间');
  console.log('📦 正在加载超分辨率模型...');
  const model = await loadModelFn('imageSuperResolution', MODEL_PATH);
  if (!model || !model.inputNames || !model.outputNames || !model.run) {
    throw new Error('Failed to load or invalid ONNX model.');
  }
  console.timeEnd('⏱️ 模型加载时间');
  console.log('✅ 模型加载成功');

  let sourceImageElement: HTMLImageElement;
  let originalWidth: number;
  let originalHeight: number;

  console.time('⏱️ 图像预处理时间');
  if (imageSource instanceof File) {
    sourceImageElement = await loadImageFromFile(imageSource);
    originalWidth = sourceImageElement.naturalWidth;
    originalHeight = sourceImageElement.naturalHeight;
  } else if (imageSource instanceof HTMLImageElement) {
    sourceImageElement = imageSource;
    originalWidth = sourceImageElement.naturalWidth;
    originalHeight = sourceImageElement.naturalHeight;
  } else {
    originalWidth = imageSource.width;
    originalHeight = imageSource.height;
    sourceImageElement = imageSource as any;
  }
  console.timeEnd('⏱️ 图像预处理时间');

  const finalUpscaledWidth = originalWidth * UPSCALE_FACTOR;
  const finalUpscaledHeight = originalHeight * UPSCALE_FACTOR;

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = finalUpscaledWidth;
  finalCanvas.height = finalUpscaledHeight;
  const finalCtx = finalCanvas.getContext('2d');
  if (!finalCtx) {
    throw new Error('无法获取最终Canvas的2D上下文');
  }

  console.time('⏱️ 图像分块时间');
  console.log(`✂️ 正在将图像分割成重叠块（重叠像素：${OVERLAP}px）...`);
  const patches = splitImageIntoPatches(
    imageSource instanceof ImageData ? imageSource : sourceImageElement!,
    INPUT_PATCH_WIDTH,
    INPUT_PATCH_HEIGHT,
    OVERLAP
  );
  console.timeEnd('⏱️ 图像分块时间');
  console.log(`📊 生成了 ${patches.length} 个图像块`);

  let totalModelInferenceTime = 0;
  let totalTensorConversionTime = 0;
  let totalDrawingTime = 0;

  for (let i = 0; i < patches.length; i++) {
    const patch = patches[i];
    console.log(`\n🔄 处理图像块 ${i + 1}/${patches.length} (位置: x:${patch.x}, y:${patch.y})`);

    console.time('⏱️ Tensor转换时间');
    const inputTensor = await imageToTensor(patch.patchData);
    console.timeEnd('⏱️ Tensor转换时间');
    totalTensorConversionTime += performance.now();

    console.time('⏱️ 模型推理时间');
    const feeds: Record<string, Tensor> = {};
    feeds[model.inputNames[0]] = inputTensor;
    const outputMap = await model.run(feeds);
    const outputTensor = outputMap[model.outputNames[0]];
    console.timeEnd('⏱️ 模型推理时间');
    totalModelInferenceTime += performance.now();

    console.time('⏱️ 绘制时间');
    const upscaledPatchImageData = tensorToImageData(outputTensor);
    finalCtx.putImageData(
      upscaledPatchImageData,
      patch.x * UPSCALE_FACTOR,
      patch.y * UPSCALE_FACTOR
    );
    console.timeEnd('⏱️ 绘制时间');
    totalDrawingTime += performance.now();
  }

  console.log('\n📊 性能统计:');
  console.log(`- 总图像块数: ${patches.length}`);
  console.log(`- 平均Tensor转换时间: ${(totalTensorConversionTime / patches.length).toFixed(2)}ms`);
  console.log(`- 平均模型推理时间: ${(totalModelInferenceTime / patches.length).toFixed(2)}ms`);
  console.log(`- 平均绘制时间: ${(totalDrawingTime / patches.length).toFixed(2)}ms`);

  console.timeEnd('⏱️ 总处理时间');
  console.log('🎉 图像放大处理完成！');

  return finalCtx.getImageData(0, 0, finalUpscaledWidth, finalUpscaledHeight);
};
