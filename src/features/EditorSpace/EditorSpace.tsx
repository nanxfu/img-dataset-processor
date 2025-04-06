import { Layout } from "antd";
import styled from "styled-components";
import CanvasControls from "./components/CanvasControls";
import ImagePreview from "./components/ImagePreview";
const { Content, Header } = Layout;

const EditorToolbar = styled(Header)`
  display: flex;
  gap: 16px;
  background-color: #fff;
`;

const EditorContent = styled(Content)`
  display: flex;
  flex-direction: column;
`;

const EditorWorkspace = styled.div`
  display: flex;
  flex: 1;
`;

const ImageEditor: React.FC = () => {
  return (
    <EditorContent>
      <EditorToolbar>
        <div>撤销</div>
        <div>重做</div>
        <div>保存</div>
      </EditorToolbar>
      <EditorWorkspace>
        <CanvasControls />
        <ImagePreview />
      </EditorWorkspace>
    </EditorContent>
  );
};

export default ImageEditor;
