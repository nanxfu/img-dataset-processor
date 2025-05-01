import { DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

import { Image, useImageStore } from '../../../store/useImageStore';

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

const ThumbnailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; /* 增加间隔，为悬停效果腾出更多空间 */
  padding: 4px 0;
  width: 64px; /* 与缩略图宽度一致 */
  align-items: center;
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

const ThumbnailItemContainer = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
`;

const ThumbnailItemImage = styled.img<{ $isSelected: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  border: 2px solid ${props => (props.$isSelected ? '#ff69b4' : '#ccc')};
  object-fit: cover;
  transition: all 0.2s ease;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  z-index: 1;

  &:hover {
    transform: scale(1.05);
    border-color: #ff69b4;
    z-index: 2;
  }
`;

const ThumbnailModifiedIndicator = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ff69b4;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 3;
`;

interface ThumbnailItemProps {
  image: Image;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const ThumbnailItem: React.FC<ThumbnailItemProps> = ({ image, isSelected, onClick }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let objectUrl: string | undefined;
    if (image.file) {
      objectUrl = URL.createObjectURL(image.file);
      setImageUrl(objectUrl);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      // 清除状态以防万一，尽管组件卸载时理论上不需要
      setImageUrl(undefined);
    };
  }, [image.file]); // 依赖 image.file

  // 如果没有 URL，不渲染任何内容或显示占位符
  if (!imageUrl) {
    // 可以选择渲染一个加载指示器或占位符
    return;
  }

  return (
    <ThumbnailItemContainer key={image.id}>
      <ThumbnailItemImage
        src={imageUrl}
        alt={image.name}
        $isSelected={isSelected}
        onClick={() => onClick(image.id)}
        loading="lazy" // 添加懒加载
      />
      {image.isModified && <ThumbnailModifiedIndicator title="已修改" />}
    </ThumbnailItemContainer>
  );
};

interface ThumbnailPanelProps {
  isVisible: boolean;
}

const ThumbnailPanel: React.FC<ThumbnailPanelProps> = ({ isVisible }) => {
  const images = useImageStore(state => state.images);
  const selectedImage = useImageStore(state => state.selectedImage);
  const selectImage = useImageStore(state => state.selectImage);
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

  return (
    <ThumbnailPanelContainer $isVisible={isVisible && images.length > 0}>
      {images.length > 5 && (
        <NavButton onClick={scrollUp} disabled={!hasMoreUp}>
          <UpOutlined />
        </NavButton>
      )}

      <ThumbnailsScrollContainer ref={scrollContainerRef} onScroll={handleScroll}>
        <ThumbnailsWrapper>
          {images.map(image => (
            <ThumbnailItem
              key={image.id}
              image={image}
              isSelected={selectedImage?.id === image.id}
              onClick={selectImage}
            />
          ))}
        </ThumbnailsWrapper>
      </ThumbnailsScrollContainer>

      {images.length > 5 && (
        <NavButton onClick={scrollDown} disabled={!hasMoreDown}>
          <DownOutlined />
        </NavButton>
      )}
    </ThumbnailPanelContainer>
  );
};

export default ThumbnailPanel;
