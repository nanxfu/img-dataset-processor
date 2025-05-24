import { Layout } from 'antd';
import styled from 'styled-components';

import ImageCanvas from './components/ImageCanvas';
import PropertyPanel from './components/PropertyPanel';
import ToolPalette from './components/ToolPalette';

const { Content, Header } = Layout;

const EditorToolbar = styled(Header)`
  display: flex;
  gap: 16px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 16px;
  align-items: center;
  height: 48px;
`;

const ToolbarTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ToolbarActions = styled.div`
  display: flex;
  gap: 12px;
  margin-left: auto;
`;

const ToolbarButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: #fff;
  color: #666;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EditorContent = styled(Content)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EditorWorkspace = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ImageEditor: React.FC = () => {
  const handleUndo = () => {
    // TODO: 实现撤销功能
    console.log('撤销');
  };

  const handleRedo = () => {
    // TODO: 实现重做功能
    console.log('重做');
  };

  const handleSave = () => {
    // TODO: 实现保存功能
    console.log('保存');
  };

  return (
    <EditorContent>
      <EditorToolbar>
        <ToolbarTitle>图片编辑器</ToolbarTitle>
        <ToolbarActions>
          <ToolbarButton onClick={handleUndo}>撤销</ToolbarButton>
          <ToolbarButton onClick={handleRedo}>重做</ToolbarButton>
          <ToolbarButton onClick={handleSave}>保存</ToolbarButton>
        </ToolbarActions>
      </EditorToolbar>
      <EditorWorkspace>
        <ToolPalette />
        <ImageCanvas />
        <PropertyPanel />
      </EditorWorkspace>
    </EditorContent>
  );
};

export default ImageEditor;
