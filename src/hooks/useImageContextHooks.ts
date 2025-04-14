import { useContext, useState, useEffect } from 'react';

import { ImageRefContext } from '../contexts/ImageRefContext';
import { useImageStore } from '../store/useImageStore';

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
  const selectedImage = useImageStore(state => state.selectedImage);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const imgElement = imageRef?.current;

    if (!imgElement || !selectedImage) {
      setNaturalSize({ width: 0, height: 0 });
      setDisplaySize({ width: 0, height: 0 });
      return;
    }

    const handleLoad = () => {
      if (imgElement) {
        setNaturalSize({
          width: imgElement.naturalWidth,
          height: imgElement.naturalHeight,
        });
        // Display size might also be available now, especially if not explicitly sized
        setDisplaySize({
          width: imgElement.clientWidth,
          height: imgElement.clientHeight,
        });
      }
    };
    // Check if image is already loaded (e.g., from cache)
    if (imgElement.complete && imgElement.naturalWidth > 0) {
      handleLoad();
    } else {
      imgElement.addEventListener('load', handleLoad);
    }

    // Cleanup function
    return () => {
      if (imgElement) {
        imgElement.removeEventListener('load', handleLoad);
      }
    };
  }, [selectedImage]); // Depend on the image element itself if possible, or its src attribute if available

  // No longer need selectedImage dependency here as the effect reacts to the imageRef.current changing or loading
  // If selectedImage causes the <img> src to change, imageRef.current might stay the same initially,
  // but the 'load' event will trigger the update.
  // If the component displaying the image remounts with a new imageRef, the effect runs again.

  return { naturalSize, displaySize };
};
