import { DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

import { useEditorStore, Image } from '../../../store/useEditorStore';

const ThumbnailPanelContainer = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  box-shadow:
    0px 4px 6px -4px rgba(0, 0, 0, 0.1),
    0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  transform: translateY(-50%) translateX(${props => (props.$isVisible ? '0' : '100px')});
  opacity: ${props => (props.$isVisible ? '1' : '0')};
  pointer-events: ${props => (props.$isVisible ? 'auto' : 'none')};
  z-index: 1000;
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 96px; /* 为垂直布局设置固定宽度 */
  overflow: visible; /* 允许子元素溢出 */
`;

const ThumbnailsScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 500px;
  overflow-y: hidden;
  overflow-x: visible;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 105, 180, 0.5) transparent;
  width: 84px; /* 增加宽度，为悬停放大效果留出空间 */
  padding: 0 8px; /* 左右增加间距，为放大效果提供空间 */

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 0;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 105, 180, 0.5);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 105, 180, 0.8);
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
`;

const ThumbnailImageWrapper = styled.div<{ $isSelected: boolean; $isModified: boolean }>`
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform-origin: center;
  border: 2px solid ${props => (props.$isSelected ? '#ff69b4' : 'transparent')};
  box-shadow: ${props =>
    props.$isSelected ? '0 4px 12px rgba(255, 105, 180, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.1)'};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }

  ${props =>
    props.$isModified &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 4px;
      right: 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ff69b4;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
  `}
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
`;

const ThumbnailName = styled.div<{ $isSelected: boolean }>`
  margin-top: 4px;
  font-size: 10px;
  color: ${props => (props.$isSelected ? '#ff69b4' : '#666')};
  font-weight: ${props => (props.$isSelected ? '600' : '400')};
  text-align: center;
  max-width: 68px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease-in-out;
`;

const ScrollButton = styled.button<{ $hasMore: boolean }>`
  display: ${props => (props.$hasMore ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 1);
    color: #ff69b4;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface ThumbnailPanelProps {
  isVisible: boolean;
}

const ThumbnailPanel: React.FC<ThumbnailPanelProps> = ({ isVisible }) => {
  const images = useEditorStore(state => state.images);
  const selectedImage = useEditorStore(state => state.selectedImage);
  const selectImage = useEditorStore(state => state.selectImage);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollUp = () => {
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollTop;
      scrollContainerRef.current.scrollTo({
        top: currentScroll - 200,
        behavior: 'smooth',
      });
      setScrollPosition(currentScroll - 200);
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollTop;
      scrollContainerRef.current.scrollTo({
        top: currentScroll + 200,
        behavior: 'smooth',
      });
      setScrollPosition(currentScroll + 200);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollPosition = e.currentTarget.scrollTop;
    setScrollPosition(newScrollPosition);
  };

  const hasMoreUp = scrollPosition > 0;
  const hasMoreDown = scrollContainerRef.current
    ? scrollPosition <
      scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight - 10
    : false;

  useEffect(() => {
    // 当图片列表变化时，检查是否有更多图片可滚动
    if (scrollContainerRef.current) {
      const hasMore =
        scrollContainerRef.current.scrollHeight > scrollContainerRef.current.clientHeight;
      if (!hasMore) {
        setScrollPosition(0);
        scrollContainerRef.current.scrollTo({ top: 0 });
      }
    }
  }, [images.length]);

  const handleThumbnailClick = (image: Image) => {
    selectImage(image.id);
  };

  if (images.length === 0) return null;

  return (
    <ThumbnailPanelContainer $isVisible={isVisible}>
      <ScrollButton $hasMore={hasMoreUp} onClick={scrollUp} title="向上滚动">
        <UpOutlined />
      </ScrollButton>

      <ThumbnailsScrollContainer ref={scrollContainerRef} onScroll={handleScroll}>
        {images.map(image => {
          const imageUrl = URL.createObjectURL(image.file);
          return (
            <ThumbnailContainer key={image.id}>
              <ThumbnailImageWrapper
                $isSelected={selectedImage?.id === image.id}
                $isModified={!!image.isModified}
                onClick={() => handleThumbnailClick(image)}
              >
                <ThumbnailImage
                  src={imageUrl}
                  alt={image.name}
                  onLoad={() => URL.revokeObjectURL(imageUrl)}
                />
              </ThumbnailImageWrapper>
              <ThumbnailName $isSelected={selectedImage?.id === image.id}>
                {image.name.length > 8 ? `${image.name.substring(0, 8)}...` : image.name}
              </ThumbnailName>
            </ThumbnailContainer>
          );
        })}
      </ThumbnailsScrollContainer>

      <ScrollButton $hasMore={hasMoreDown} onClick={scrollDown} title="向下滚动">
        <DownOutlined />
      </ScrollButton>
    </ThumbnailPanelContainer>
  );
};

export default ThumbnailPanel;
