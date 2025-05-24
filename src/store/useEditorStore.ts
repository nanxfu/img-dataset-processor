import { create } from 'zustand';

export type ToolType =
  | 'resize'
  | 'crop'
  | 'ai-upscale'
  | 'ai-classify'
  | 'ai-repair'
  | 'remove-watermark'
  | null;

export interface Image {
  id: string;
  file: File;
  name: string;
  isModified?: boolean;
}

export interface Size {
  width: number;
  height: number;
}

interface EditorState {
  // 工具状态
  currentTool: ToolType;
  setCurrentTool: (tool: ToolType) => void;

  // 图片管理
  images: Image[];
  selectedImage: Image | null;
  addImage: (image: Image) => void;
  selectImage: (imageId: string) => void;
  updateImageFile: (imageId: string, newFile: File) => void;
  removeImage: (imageId: string) => void;

  // 图片尺寸状态
  naturalSize: Size;
  displaySize: Size;
  setNaturalSize: (size: Size) => void;
  setDisplaySize: (size: Size) => void;

  // 裁剪状态
  isCropMode: boolean;
  setCropMode: (isActive: boolean) => void;
  cropRegion: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  setCropRegion: (region: { top: number; right: number; bottom: number; left: number }) => void;
  applyImageCrop: (
    imageId: string,
    region: { top: number; right: number; bottom: number; left: number }
  ) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // 工具状态
  currentTool: null,
  setCurrentTool: tool => {
    const state = get();
    set({ currentTool: tool });

    // 设置裁剪模式
    if (tool === 'crop') {
      set({ isCropMode: true });
    } else if (state.isCropMode && tool !== 'crop') {
      set({ isCropMode: false });
    }
  },

  // 图片管理
  images: [],
  selectedImage: null,
  addImage: image => {
    set(state => ({
      images: [...state.images, image],
      selectedImage: state.selectedImage || image,
    }));
  },
  selectImage: imageId => {
    const image = get().images.find(img => img.id === imageId);
    if (image) {
      set({ selectedImage: image });
    }
  },
  updateImageFile: (imageId, newFile) => {
    set(state => ({
      images: state.images.map(img =>
        img.id === imageId ? { ...img, file: newFile, isModified: true } : img
      ),
      selectedImage:
        state.selectedImage?.id === imageId
          ? { ...state.selectedImage, file: newFile, isModified: true }
          : state.selectedImage,
    }));
  },
  removeImage: imageId => {
    set(state => {
      const newImages = state.images.filter(img => img.id !== imageId);
      return {
        images: newImages,
        selectedImage:
          state.selectedImage?.id === imageId
            ? newImages.length > 0
              ? newImages[0]
              : null
            : state.selectedImage,
      };
    });
  },

  // 图片尺寸状态
  naturalSize: { width: 0, height: 0 },
  displaySize: { width: 0, height: 0 },
  setNaturalSize: size => set({ naturalSize: size }),
  setDisplaySize: size => set({ displaySize: size }),

  // 裁剪状态
  isCropMode: false,
  setCropMode: isActive => set({ isCropMode: isActive }),
  cropRegion: { top: 0, right: 0, bottom: 0, left: 0 },
  setCropRegion: region => set({ cropRegion: region }),
  applyImageCrop: (imageId, region) => {
    // TODO: 实现裁剪逻辑
    console.log('应用裁剪', imageId, region);
  },
}));
