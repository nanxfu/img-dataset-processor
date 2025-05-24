import { useState, useEffect } from 'react';
import { styled } from 'styled-components';

import ActionButton from '../../../../components/ActionButton';
import { useEditorStore } from '../../../../store/useEditorStore';
import resizeImage from '../../../../utils/resizeImage';

const PanelSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
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
  font-size: 12px;
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
  font-size: 12px;
  color: #666;
`;

const PresetGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PresetButton = styled.button<{ $isActive?: boolean }>`
  width: 60px;
  height: 36px;
  padding: 6px 8px;
  border-radius: 12px;
  border: 1px solid ${props => (props.$isActive ? '#1890ff' : '#e0e0e0')};
  background: #f9fafb;
  color: ${props => (props.$isActive ? '#1890ff' : '#666')};
  cursor: pointer;
  font-size: 12px;
  &:hover {
    border-color: #1890ff;
  }
`;

const ScaleGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ScaleButton = styled(PresetButton)`
  width: 80px;
`;

const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BasicEditPanel: React.FC = () => {
  const selectedImage = useEditorStore(state => state.selectedImage);
  const naturalSize = useEditorStore(state => state.naturalSize);
  const updateImageFile = useEditorStore(state => state.updateImageFile);
  const currentTool = useEditorStore(state => state.currentTool);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scaleMethod, setScaleMethod] = useState<'stretch' | 'proportion'>('proportion');

  useEffect(() => {
    if (selectedImage && naturalSize.width > 0 && naturalSize.height > 0) {
      setWidth(naturalSize.width);
      setHeight(naturalSize.height);
    }
  }, [naturalSize, selectedImage]);

  // 处理尺寸变化
  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(event.target.value, 10);
    if (!isNaN(newWidth)) {
      setWidth(newWidth);
      if (scaleMethod === 'proportion' && naturalSize.width > 0) {
        setHeight(Math.round((newWidth * naturalSize.height) / naturalSize.width));
      }
    } else if (event.target.value === '') {
      setWidth(0);
    }
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(event.target.value, 10);
    if (!isNaN(newHeight)) {
      setHeight(newHeight);
      if (scaleMethod === 'proportion' && naturalSize.height > 0) {
        setWidth(Math.round((newHeight * naturalSize.width) / naturalSize.height));
      }
    } else if (event.target.value === '') {
      setHeight(0);
    }
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

  const handleApplyResize = async () => {
    if (!selectedImage?.file) return;

    try {
      const result = await resizeImage({
        imageSource: selectedImage.file,
        resizedWidth: width,
        resizedHeight: height,
      });

      if (result?.resizedImage) {
        const newFile = new File([result.resizedImage as Blob], selectedImage.name, {
          type: selectedImage.file.type,
        });
        updateImageFile(selectedImage.id, newFile);
      }
    } catch (error) {
      console.error('调整尺寸失败:', error);
    }
  };

  const handleExportImage = async () => {
    if (!selectedImage?.file) return;

    try {
      const result = await resizeImage({
        imageSource: selectedImage.file,
        resizedWidth: width,
        resizedHeight: height,
      });

      if (result?.resizedImage) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(result.resizedImage as Blob);
        a.download = `resized_${selectedImage.name}`;
        a.click();
      }
    } catch (error) {
      console.error('导出图片失败:', error);
    }
  };

  if (currentTool === 'resize') {
    return (
      <>
        <PanelSection>
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
        </PanelSection>

        <PanelSection>
          <SectionTitle>预设比例</SectionTitle>
          <PresetGroup>
            <PresetButton onClick={() => handlePresetRatio('1:1')}>1:1</PresetButton>
            <PresetButton onClick={() => handlePresetRatio('3:4')}>3:4</PresetButton>
            <PresetButton onClick={() => handlePresetRatio('4:3')}>4:3</PresetButton>
            <PresetButton onClick={() => handlePresetRatio('16:9')}>16:9</PresetButton>
          </PresetGroup>
        </PanelSection>

        <PanelSection>
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
        </PanelSection>

        <ActionGroup>
          <ActionButton onClick={handleApplyResize}>应用更改</ActionButton>
          <ActionButton onClick={handleExportImage}>导出图片</ActionButton>
        </ActionGroup>
      </>
    );
  }

  if (currentTool === 'crop') {
    return (
      <PanelSection>
        <SectionTitle>裁剪工具</SectionTitle>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
          在画布上拖拽选择要裁剪的区域
        </div>
        <ActionGroup>
          <ActionButton>应用裁剪</ActionButton>
          <ActionButton>导出裁剪图片</ActionButton>
        </ActionGroup>
      </PanelSection>
    );
  }

  return null;
};

export default BasicEditPanel;
