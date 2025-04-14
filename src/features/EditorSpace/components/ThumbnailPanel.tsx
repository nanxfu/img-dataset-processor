import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
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
  display: flex;
  align-items: center;
  gap: 8px;
  height: 96px; /* 增加整体高度，为缩略图的hover效果留出空间 */
  overflow: visible; /* 允许子元素溢出 */
`;

const ThumbnailsScrollContainer = styled.div`
  display: flex;
  max-width: 500px;
  overflow-x: hidden;
  overflow-y: visible;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 105, 180, 0.5) transparent;
  height: 84px; /* 增加高度，为悬停放大效果留出空间 */
  padding: 8px 0; /* 上下增加间距，为放大效果提供空间 */

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    height: 6px;
    width: 0;
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

const ThumbnailsWrapper = styled.div`
  display: flex;
  gap: 16px; /* 增加间隔，为悬停效果腾出更多空间 */
  padding: 0 4px;
  height: 64px; /* 与缩略图高度一致 */
  align-items: center;
`;

const ThumbnailImage = styled.img<{ $isSelected: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  border: 2px solid ${props => (props.$isSelected ? '#ff69b4' : '#ccc')};
  object-fit: cover;
  transition: all 0.2s ease;
  cursor: pointer;
  flex-shrink: 0;
  position: relative; /* 添加定位，使悬停效果能够突破容器限制 */
  z-index: 1; /* 让悬停的图片位于顶层 */

  &:hover {
    transform: scale(1.05);
    border-color: #ff69b4;
    z-index: 2; /* 悬停时增加z-index，确保显示在最上层 */
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.8);
  color: #ff69b4;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 3; /* 确保按钮在最上层 */

  &:hover {
    background-color: #fff;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ThumbnailPanelProps {
  isVisible: boolean;
}

const ThumbnailPanel: React.FC<ThumbnailPanelProps> = ({ isVisible }) => {
  const images = useImageStore(state => state.images);
  const selectedImage = useImageStore(state => state.selectedImage);
  const selectImage = useImageStore(state => state.selectImage);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: currentScroll - 200,
        behavior: 'smooth',
      });
      setScrollPosition(currentScroll - 200);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: currentScroll + 200,
        behavior: 'smooth',
      });
      setScrollPosition(currentScroll + 200);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollPosition = e.currentTarget.scrollLeft;
    setScrollPosition(newScrollPosition);
  };

  const hasMoreLeft = scrollPosition > 0;
  const hasMoreRight = scrollContainerRef.current
    ? scrollPosition <
      scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
    : false;

  useEffect(() => {
    // 当图片列表变化时，检查是否有更多图片可滚动
    if (scrollContainerRef.current) {
      const hasMore =
        scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth;
      if (!hasMore) {
        setScrollPosition(0);
        scrollContainerRef.current.scrollTo({ left: 0 });
      }
    }
  }, [images.length]);

  return (
    <ThumbnailPanelContainer $isVisible={isVisible}>
      {images.length > 5 && (
        <NavButton onClick={scrollLeft} disabled={!hasMoreLeft}>
          <LeftOutlined />
        </NavButton>
      )}

      <ThumbnailsScrollContainer ref={scrollContainerRef} onScroll={handleScroll}>
        <ThumbnailsWrapper>
          {images.map(image => (
            <ThumbnailImage
              key={image.id}
              src={image.url}
              alt={image.name}
              $isSelected={selectedImage?.id === image.id}
              onClick={() => selectImage(image.id)}
            />
          ))}
        </ThumbnailsWrapper>
      </ThumbnailsScrollContainer>

      {images.length > 5 && (
        <NavButton onClick={scrollRight} disabled={!hasMoreRight}>
          <RightOutlined />
        </NavButton>
      )}
    </ThumbnailPanelContainer>
  );
};

export default ThumbnailPanel;
