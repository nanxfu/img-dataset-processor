import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Image {
  id: string;
  url: string;
  name: string;
  isModified?: boolean;
  cropRegion?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

interface ImageState {
  images: Image[];
  selectedImage: Image | null;
  isCropMode: boolean;
  addImage: (image: Image) => void;
  removeImage: (id: string) => void;
  selectImage: (id: string) => void;
  clearImages: () => void;
  setCropMode: (isCropMode: boolean) => void;
  applyImageCrop: (
    imageId: string,
    cropRegion: { top: number; right: number; bottom: number; left: number }
  ) => void;
}

export const useImageStore = create<ImageState>()(
  devtools(set => ({
    images: [],
    selectedImage: null,
    isCropMode: false,
    addImage: image =>
      set(state => ({
        images: [...state.images, image],
        selectedImage: image,
        isCropMode: true,
      })),
    removeImage: id =>
      set(state => ({
        images: state.images.filter(img => img.id !== id),
        selectedImage: state.selectedImage?.id === id ? null : state.selectedImage,
      })),
    selectImage: id =>
      set(state => ({
        selectedImage: state.images.find(img => img.id === id) || null,
      })),
    clearImages: () => set({ images: [], selectedImage: null }),
    setCropMode: isCropMode => set({ isCropMode }),
    applyImageCrop: (imageId, cropRegion) =>
      set(state => ({
        images: state.images.map(img =>
          img.id === imageId ? { ...img, cropRegion, isModified: true } : img
        ),
        selectedImage:
          state.selectedImage?.id === imageId
            ? { ...state.selectedImage, cropRegion, isModified: true }
            : state.selectedImage,
      })),
  }))
);
