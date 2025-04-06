import { useState } from "react";
import { styled } from "styled-components";

const CanvasControlsPanel = styled.div`
  display: flex;
  flex: 1;
  margin: 24px;
  margin-left: 0;
  flex-direction: column;
  background-color: #fff;
  border-radius: 16px;
`;
const ImagePreview: React.FC = () => {
  const [images,setImages] = useState()
  return <CanvasControlsPanel>ImagePreview</CanvasControlsPanel>;
};

export default ImagePreview;


