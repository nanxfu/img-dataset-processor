import React from 'react';
import { styled } from 'styled-components';

import { useEditorStore } from '../../../store/useEditorStore';

import AiProcessingPanel from './panels/AiProcessingPanel';
import BasicEditPanel from './panels/BasicEditPanel';

const PropertyPanelContainer = styled.div<{ $isVisible: boolean }>`
  display: ${props => (props.$isVisible ? 'flex' : 'none')};
  flex-direction: column;
  width: 320px;
  height: 100%;
  background-color: #fff;
  border-left: 1px solid #f0f0f0;
  overflow-y: auto;
`;

const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const PanelContent = styled.div`
  flex: 1;
  padding: 16px;
`;

const PropertyPanel: React.FC = () => {
  const currentTool = useEditorStore(state => state.currentTool);
  const selectedImage = useEditorStore(state => state.selectedImage);

  const renderPanelContent = () => {
    if (!selectedImage) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#999',
            fontSize: '14px',
          }}
        >
          请先选择一张图片
        </div>
      );
    }

    switch (currentTool) {
      case 'resize':
      case 'crop':
        return <BasicEditPanel />;
      case 'ai-upscale':
      case 'ai-classify':
      case 'ai-repair':
        return <AiProcessingPanel />;
      default:
        return null;
    }
  };

  const getPanelTitle = () => {
    switch (currentTool) {
      case 'resize':
        return '尺寸调整';
      case 'crop':
        return '图片裁剪';
      case 'ai-upscale':
        return 'AI 放大';
      case 'ai-classify':
        return 'AI 分类';
      case 'ai-repair':
        return '高清修复';
      default:
        return '属性设置';
    }
  };

  return (
    <PropertyPanelContainer $isVisible={!!currentTool && !!selectedImage}>
      <PanelHeader>{getPanelTitle()}</PanelHeader>
      <PanelContent>{renderPanelContent()}</PanelContent>
    </PropertyPanelContainer>
  );
};

export default PropertyPanel;
