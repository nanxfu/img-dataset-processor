import { Tensor } from 'onnxruntime-web';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

import ActionButton from '../../../components/ActionButton';
import { useImageStore } from '../../../store/useImageStore';
import resizeImage from '../../../utils/resizeImage';
import { loadModel } from '../../AiProcessing/services/aiModelRegistry';
import { imageToTensor, upscaleImageWithPatches } from '../../AiProcessing/services/imageHelper';

const CanvasControlsPanel = styled.div<{ $isVisible: boolean }>`
  display: ${props => (props.$isVisible ? 'flex' : 'none')};
  flex-direction: column;
  width: 288px;
  margin: 24px;
  padding: 16px;
  background-color: #fff;
  border-radius: 16px;
  gap: 24px;
  transition: all 0.3s ease-in-out;
  opacity: ${props => (props.$isVisible ? '1' : '0')};
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.div`
  font-size: 14px;
  color: #666;
`;

const InputWithUnit = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CapsuleInput = styled.input`
  width: 0px;
  height: 32px;
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #1890ff;
  }
`;

const UnitLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const PresetGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PresetButton = styled.button<{ $isActive?: boolean }>`
  width: 124px;
  height: 52px;
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid ${props => (props.$isActive ? '#1890ff' : '#e0e0e0')};
  background: #f9fafb;
  color: ${props => (props.$isActive ? '#1890ff' : '#666')};
  cursor: pointer;
  font-size: 14px;
  &:hover {
    border-color: #1890ff;
  }
`;

const ScaleGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ScaleButton = styled(PresetButton)``;

const CanvasControls: React.FC = () => {
  const isCropMode = useImageStore(state => state.isCropMode);
  const selectedImage = useImageStore(state => state.selectedImage);
  const naturalSize = useImageStore(state => state.naturalSize);
  const updateImageFile = useImageStore(state => state.updateImageFile);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scaleMethod, setScaleMethod] = useState<'stretch' | 'proportion'>('stretch');

  useEffect(() => {
    if (selectedImage && naturalSize.width > 0 && naturalSize.height > 0) {
      console.log('naturalSize', naturalSize);
      setWidth(naturalSize.width);
      setHeight(naturalSize.height);
    }
  }, [naturalSize, selectedImage]);

  // 处理尺寸变化
  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(event.target.value, 10);
    if (!isNaN(newWidth)) {
      setWidth(newWidth);
      // 可以在这里添加应用尺寸变化的逻辑
      if (scaleMethod === 'proportion') {
        setHeight(Math.round((newWidth * naturalSize.height) / naturalSize.width));
      }
    } else if (event.target.value === '') {
      setWidth(0); // 或者根据需要处理空输入
    }
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(event.target.value, 10);
    if (!isNaN(newHeight)) {
      setHeight(newHeight);
      // 可以在这里添加应用尺寸变化的逻辑
      if (scaleMethod === 'proportion') {
        setWidth(Math.round((newHeight * naturalSize.width) / naturalSize.height));
      }
    } else if (event.target.value === '') {
      setHeight(0); // 或者根据需要处理空输入
    }
  };
  const handleApplyImageSettings = async () => {
    if (!selectedImage?.file) return;

    const result = await resizeImage({
      imageSource: selectedImage.file,
      resizedWidth: width,
      resizedHeight: height,
    });

    if (!result?.resizedImage) return;

    const newFile = new File([result.resizedImage], selectedImage.name, {
      type: selectedImage.file.type,
    });

    updateImageFile(selectedImage.id, newFile);
  };

  const handleAiProcessing = async () => {
    if (!selectedImage?.file) return;
    //加载模型
    const model = await loadModel('imageClassification', '/models/squeezenet1.1-7.onnx');
    if (!model) return;
    // 使用模型进行推理
    const inputTensor = await imageToTensor(selectedImage.file);
    const feeds: Record<string, Tensor> = {};
    feeds[model.inputNames[0]] = inputTensor;
    const outputData = await model.run(feeds);
    const output = outputData[model.outputNames[0]];
    //Get the softmax of the output data. The softmax transforms values to be between 0 and 1
    const outputSoftmax = softmax(Array.prototype.slice.call(output.data));
    console.log('outputData', outputData, outputSoftmax);
  };

  const handleSaveImage = async () => {
    if (!selectedImage?.file) return;

    const result = await resizeImage({
      imageSource: selectedImage.file,
      resizedWidth: width,
      resizedHeight: height,
    });

    if (!result?.resizedImage) return;

    const a = document.createElement('a');
    a.href = URL.createObjectURL(result.resizedImage as Blob);
    a.download = `images.jpg`;
    a.click();
  };
  // 处理预设比例点击
  const handlePresetRatio = (ratio: string) => {
    switch (ratio) {
      case '1:1':
        setHeight(width);
        break;
      case '3:4':
        setHeight(Math.round((width * 4) / 3));
        break;
      case '4:3':
        setHeight(Math.round((width * 3) / 4));
        break;
      case '16:9':
        setHeight(Math.round((width * 9) / 16));
        break;
      default:
        break;
    }
  };

  const handleUpscaleImage = async () => {
    if (!selectedImage?.file) return;
    const upscaledImage = await upscaleImageWithPatches(selectedImage.file, loadModel);
    const canvas = document.createElement('canvas');

    canvas.width = upscaledImage.width;
    canvas.height = upscaledImage.height;

    const img = await createImageBitmap(upscaledImage);
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.drawImage(img, 0, 0, upscaledImage.width, upscaledImage.height);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg');
    a.download = `upscaledImage.jpg`;
    a.click();
  };

  return (
    <CanvasControlsPanel $isVisible={isCropMode}>
      <div>
        <SectionTitle>尺寸设置</SectionTitle>
        <InputGroup>
          <InputWrapper>
            <Label>宽度</Label>
            <InputWithUnit>
              <CapsuleInput type="number" value={width} onChange={handleWidthChange} />
              <UnitLabel>px</UnitLabel>
            </InputWithUnit>
          </InputWrapper>
          <InputWrapper>
            <Label>高度</Label>
            <InputWithUnit>
              <CapsuleInput type="number" value={height} onChange={handleHeightChange} />
              <UnitLabel>px</UnitLabel>
            </InputWithUnit>
          </InputWrapper>
        </InputGroup>
      </div>

      <div>
        <SectionTitle>预设比例</SectionTitle>
        <PresetGroup>
          <PresetButton onClick={() => handlePresetRatio('1:1')}>1:1</PresetButton>
          <PresetButton onClick={() => handlePresetRatio('3:4')}>3:4</PresetButton>
          <PresetButton onClick={() => handlePresetRatio('4:3')}>4:3</PresetButton>
          <PresetButton onClick={() => handlePresetRatio('16:9')}>16:9</PresetButton>
        </PresetGroup>
      </div>

      <div>
        <SectionTitle>缩放方式</SectionTitle>
        <ScaleGroup>
          <ScaleButton
            onClick={() => setScaleMethod('stretch')}
            $isActive={scaleMethod === 'stretch'}
          >
            拉伸
          </ScaleButton>
          <ScaleButton
            onClick={() => setScaleMethod('proportion')}
            $isActive={scaleMethod === 'proportion'}
          >
            按比例
          </ScaleButton>
        </ScaleGroup>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <ActionButton onClick={handleApplyImageSettings}>确认更改</ActionButton>
        <ActionButton onClick={handleSaveImage}>导出图片</ActionButton>
      </div>
      <div>
        <ActionButton onClick={handleAiProcessing}>AI图片分类</ActionButton>
      </div>
      <div>
        <ActionButton onClick={handleUpscaleImage}>AI图片放大</ActionButton>
      </div>
    </CanvasControlsPanel>
  );
};

export default CanvasControls;
function softmax(arg0: any[]) {
  const max = Math.max(...arg0);
  const exp = arg0.map(value => Math.exp(value - max));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map(value => value / sum);
}
