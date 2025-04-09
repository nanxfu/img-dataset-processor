import { styled } from 'styled-components';

const ThumbnailPanelContainer = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px;
  background-color: #fff;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  box-shadow:
    0px 4px 6px -4px rgba(0, 0, 0, 0.1),
    0px 10px 15px -3px rgba(0, 0, 0, 0.1);
`;
const ThumbnailPanel: React.FC = () => {
  return (
    <ThumbnailPanelContainer>
      <div style={{ display: 'flex', gap: '12px' }}>
        <img width={64} height={64} />
        <img width={64} height={64} />
        <img width={64} height={64} />
      </div>
    </ThumbnailPanelContainer>
  );
};

export default ThumbnailPanel;
