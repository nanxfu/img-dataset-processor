import { useState, useCallback, useEffect } from 'react';

import { useImageStore } from '../store/useImageStore';
// 重写 useImageSize 使用 Callback Ref
export const useImageObserver = () => {
  const setNaturalSize = useImageStore(state => state.setNaturalSize);
  const setDisplaySize = useImageStore(state => state.setDisplaySize);
  const naturalSize = useImageStore(state => state.naturalSize);
  const displaySize = useImageStore(state => state.displaySize);
  // State to hold the actual DOM node
  const [imgNode, setImgNode] = useState<HTMLImageElement | null>(null);

  // The callback ref function
  const measuredRef = useCallback((node: HTMLImageElement | null) => {
    // console.log('Callback ref executed with node:', node);
    setImgNode(node); // Update state when node mounts/unmounts
  }, []); // No dependencies needed for the callback itself

  useEffect(() => {
    // Effect now depends on imgNode state
    // console.log('useImageSize LayoutEffect run. selectedImage:', selectedImage, 'imgNode:', imgNode);

    if (imgNode) {
      // --- Node is guaranteed to exist here ---
      const handleLoad = () => {
        if (imgNode) {
          setNaturalSize(imgNode.naturalWidth, imgNode.naturalHeight);
          setDisplaySize(imgNode.clientWidth, imgNode.clientHeight);
        } else {
          setNaturalSize(0, 0);
          setDisplaySize(0, 0);
        }
      };

      // Check if image is already loaded (might happen before effect runs if cached)
      // Also check width > 0 as 'complete' can be true for broken images
      if (imgNode.complete && imgNode.naturalWidth > 0) {
        // console.log('Image already complete, calling handleLoad directly.');
        handleLoad();
      } else {
        // console.log('Image not complete, adding load listener.');
        imgNode.addEventListener('load', handleLoad);
      }

      // Cleanup function
      return () => {
        imgNode.removeEventListener('load', handleLoad);
      };
    } else {
      // Reset sizes if no image or node
      // console.log('LayoutEffect cleanup: Resetting sizes.');
      setNaturalSize(0, 0);
      setDisplaySize(0, 0);
    }
    // Depend on both selectedImage and the node state
  }, [imgNode, setNaturalSize, setDisplaySize]);

  // Return the callback ref for the component to use, AND the node itself
  // so other hooks (like useCropRegionDrawer) can use the node if needed.
  return { naturalSize, displaySize, measuredRef, imgNode };
};
