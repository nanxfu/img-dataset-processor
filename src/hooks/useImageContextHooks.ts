import { useContext } from 'react';

import { ImageRefContext } from '../contexts/ImageRefContext';

// 创建自定义钩子用于访问Context
export const useImageRef = () => {
  const context = useContext(ImageRefContext);

  if (context === undefined) {
    throw new Error('useImageRef必须在ImageRefProvider内部使用');
  }

  return context;
};

// 简便方法获取图片尺寸
export const useImageSize = () => {
  const { imageRef } = useImageRef();

  const getNaturalSize = () => {
    if (!imageRef?.current) {
      return { width: 0, height: 0 };
    }

    return {
      width: imageRef.current.naturalWidth,
      height: imageRef.current.naturalHeight,
    };
  };

  const getDisplaySize = () => {
    if (!imageRef?.current) {
      return { width: 0, height: 0 };
    }

    return {
      width: imageRef.current.clientWidth,
      height: imageRef.current.clientHeight,
    };
  };

  return { getNaturalSize, getDisplaySize };
};
