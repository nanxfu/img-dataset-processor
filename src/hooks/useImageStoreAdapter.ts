import { useEffect } from 'react';

import { useEditorStore } from '../store/useEditorStore';
import { useImageStore } from '../store/useImageStore';

/**
 * 适配器 hook，用于在新旧 store 之间同步数据
 * 这确保了在重构期间的兼容性
 */
export const useImageStoreAdapter = () => {
  const editorStore = useEditorStore();
  const imageStore = useImageStore();

  // 同步图片数据从 editor store 到 image store
  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe((state, prevState) => {
      // 同步图片列表
      if (state.images !== prevState.images) {
        // 清空旧的图片并添加新的
        imageStore.clearImages();
        state.images.forEach(image => {
          imageStore.addImage(image);
        });
      }

      // 同步选中图片
      if (state.selectedImage !== prevState.selectedImage) {
        if (state.selectedImage) {
          imageStore.selectImage(state.selectedImage.id);
        }
      }

      // 同步尺寸信息
      if (state.naturalSize !== prevState.naturalSize) {
        imageStore.setNaturalSize(state.naturalSize);
      }

      if (state.displaySize !== prevState.displaySize) {
        imageStore.setDisplaySize(state.displaySize);
      }

      // 同步裁剪模式
      if (state.isCropMode !== prevState.isCropMode) {
        imageStore.setCropMode(state.isCropMode);
      }
    });

    return unsubscribe;
  }, [imageStore]);

  // 初始化时同步数据
  useEffect(() => {
    const editorState = useEditorStore.getState();

    if (editorState.images.length > 0) {
      editorState.images.forEach(image => {
        imageStore.addImage(image);
      });
    }

    if (editorState.selectedImage) {
      imageStore.selectImage(editorState.selectedImage.id);
    }
  }, [imageStore]);

  return {
    editorStore,
    imageStore,
  };
};
