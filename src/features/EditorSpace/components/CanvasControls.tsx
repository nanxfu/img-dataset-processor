import { styled } from 'styled-components';

const CanvasControlsPanel = styled.div`
  display: flex;
  width: 288px;
  margin: 24px;
  flex-direction: column;
  background-color: #fff;
  border-radius: 16px;
`;
const CanvasControls: React.FC = () => {
  return <CanvasControlsPanel>CanvasControls</CanvasControlsPanel>;
};

export default CanvasControls;
