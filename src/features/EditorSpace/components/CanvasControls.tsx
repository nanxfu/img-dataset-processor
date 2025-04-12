import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

import { useImageSize } from '../../../hooks/useImageContextHooks';
import { useImageStore } from '../../../store/useImageStore';

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

const PresetButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid ${props => (props.active ? '#1890ff' : '#e0e0e0')};
  background-color: ${props => (props.active ? '#e6f7ff' : '#fff')};
  color: ${props => (props.active ? '#1890ff' : '#666')};
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
  const { getNaturalSize } = useImageSize();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (selectedImage) {
      const { width: naturalWidth, height: naturalHeight } = getNaturalSize();
      if (naturalWidth > 0 && naturalHeight > 0) {
        setWidth(naturalWidth);
        setHeight(naturalHeight);
      }
    }
  }, [selectedImage, getNaturalSize]);

  // 处理尺寸变化
  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    // 可以在这里添加应用尺寸变化的逻辑
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    // 可以在这里添加应用尺寸变化的逻辑
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

  return (
    <CanvasControlsPanel $isVisible={isCropMode}>
      <div>
        <SectionTitle>尺寸设置</SectionTitle>
        <InputGroup>
          <InputWrapper>
            <Label>宽度</Label>
            <InputWithUnit>
              <CapsuleInput
                type="number"
                value={width}
                onChange={e => handleWidthChange(Number(e.target.value))}
              />
              <UnitLabel>px</UnitLabel>
            </InputWithUnit>
          </InputWrapper>
          <InputWrapper>
            <Label>高度</Label>
            <InputWithUnit>
              <CapsuleInput
                type="number"
                value={height}
                onChange={e => handleHeightChange(Number(e.target.value))}
              />
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
          <ScaleButton>拉伸</ScaleButton>
          <ScaleButton>按比例</ScaleButton>
        </ScaleGroup>
      </div>
    </CanvasControlsPanel>
  );
};

export default CanvasControls;
