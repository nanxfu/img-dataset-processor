import { styled } from 'styled-components';

import { useImageStore } from '../../../store/useImageStore';

const ThumbnailPanelContainer = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  box-shadow:
    0px 4px 6px -4px rgba(0, 0, 0, 0.1),
    0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  transform: translateX(-50%) translateY(${props => (props.$isVisible ? '0' : '100px')});
  opacity: ${props => (props.$isVisible ? '1' : '0')};
  pointer-events: ${props => (props.$isVisible ? 'auto' : 'none')};
  z-index: 1000;
`;

const ThumbnailImage = styled.img<{ $isSelected: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  border: 2px solid ${props => (props.$isSelected ? '#ff69b4' : '#ccc')};
  object-fit: cover;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    border-color: #ff69b4;
  }
`;

interface ThumbnailPanelProps {
  isVisible: boolean;
}

const ThumbnailPanel: React.FC<ThumbnailPanelProps> = ({ isVisible }) => {
  const images = useImageStore(state => state.images);
  const selectedImage = useImageStore(state => state.selectedImage);
  const selectImage = useImageStore(state => state.selectImage);

  return (
    <ThumbnailPanelContainer $isVisible={isVisible}>
      <div style={{ display: 'flex', gap: '12px' }}>
        {images.map(image => (
          <ThumbnailImage
            key={image.id}
            src={image.url}
            alt={image.name}
            $isSelected={selectedImage?.id === image.id}
            onClick={() => selectImage(image.id)}
          />
        ))}
      </div>
    </ThumbnailPanelContainer>
  );
};

export default ThumbnailPanel;
