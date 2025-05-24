import {
  ScissorOutlined,
  ExpandAltOutlined,
  RobotOutlined,
  EyeOutlined,
  ToolOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import React from 'react';
import { styled } from 'styled-components';

import { useEditorStore, ToolType } from '../../../store/useEditorStore';

const PaletteContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80px;
  background: #fff;
  border-right: 1px solid #f0e6f0;
  padding: 20px 8px;
  gap: 12px;
  position: relative;
  box-shadow: 2px 0 15px rgba(255, 105, 180, 0.06);
`;

const ToolButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  padding: 8px;
  border: 2px solid ${props => (props.$isActive ? '#ff69b4' : 'transparent')};
  border-radius: 16px;
  background: ${props =>
    props.$isActive
      ? 'linear-gradient(135deg, #ff69b4 0%, #ff8cc8 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #fef9fe 100%)'};
  color: ${props => (props.$isActive ? '#ffffff' : '#666')};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: ${props =>
    props.$isActive ? '0 8px 25px rgba(255, 105, 180, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.08)'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(255, 140, 200, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    background: ${props =>
      props.$isActive
        ? 'linear-gradient(135deg, #ff5aa3 0%, #ff7bbf 100%)'
        : 'linear-gradient(135deg, #fef9fe 0%, #fdf0fd 100%)'};
    border-color: ${props => (props.$isActive ? '#ff5aa3' : '#ff69b4')};
    box-shadow: ${props =>
      props.$isActive
        ? '0 12px 35px rgba(255, 105, 180, 0.4)'
        : '0 8px 25px rgba(255, 105, 180, 0.15)'};
    color: ${props => (props.$isActive ? '#ffffff' : '#ff69b4')};

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;

    &:hover {
      transform: none;
      background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
      border-color: transparent;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      color: #999;
    }
  }
`;

const ToolIcon = styled.div`
  font-size: 22px;
  margin-bottom: 6px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
`;

const ToolLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
`;

const ToolSeparator = styled.div`
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff69b4, transparent);
  margin: 8px 4px;
  border-radius: 1px;
  opacity: 0.3;
`;

const SectionTitle = styled.div`
  font-size: 9px;
  font-weight: 700;
  color: #ff69b4;
  text-align: center;
  margin: 8px 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

interface ToolItem {
  id: ToolType;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const basicTools: ToolItem[] = [
  {
    id: 'resize',
    icon: <ExpandAltOutlined />,
    label: '调整尺寸',
    description: '修改图片的宽度和高度',
  },
  {
    id: 'crop',
    icon: <ScissorOutlined />,
    label: '裁剪',
    description: '裁剪图片的特定区域',
  },
];

const aiTools: ToolItem[] = [
  {
    id: 'ai-classify',
    icon: <EyeOutlined />,
    label: 'AI分类',
    description: '自动识别图片内容类别',
  },
  {
    id: 'ai-upscale',
    icon: <RobotOutlined />,
    label: 'AI放大',
    description: '使用AI技术放大图片',
  },
  {
    id: 'ai-repair',
    icon: <ToolOutlined />,
    label: '高清修复',
    description: '智能修复图片质量',
  },
  {
    id: 'remove-watermark',
    icon: <ClearOutlined />,
    label: '去水印',
    description: '智能去除图片水印',
  },
];

const ToolPalette: React.FC = () => {
  const currentTool = useEditorStore(state => state.currentTool);
  const setCurrentTool = useEditorStore(state => state.setCurrentTool);
  const selectedImage = useEditorStore(state => state.selectedImage);

  const handleToolSelect = (toolId: ToolType) => {
    if (!selectedImage && toolId !== null) {
      // 如果没有选中图片，不允许选择工具
      return;
    }

    // 如果点击已选中的工具，则取消选择
    if (currentTool === toolId) {
      setCurrentTool(null);
    } else {
      setCurrentTool(toolId);
    }
  };

  const renderToolButton = (tool: ToolItem) => (
    <ToolButton
      key={tool.id}
      $isActive={currentTool === tool.id}
      onClick={() => handleToolSelect(tool.id)}
      title={tool.description}
      disabled={!selectedImage}
    >
      <ToolIcon>{tool.icon}</ToolIcon>
      <ToolLabel>{tool.label}</ToolLabel>
    </ToolButton>
  );

  return (
    <PaletteContainer>
      {/* 基础编辑工具 */}
      <SectionTitle>基础工具</SectionTitle>
      {basicTools.map(renderToolButton)}

      <ToolSeparator />

      {/* AI处理工具 */}
      <SectionTitle>AI工具</SectionTitle>
      {aiTools.map(renderToolButton)}
    </PaletteContainer>
  );
};

export default ToolPalette;
