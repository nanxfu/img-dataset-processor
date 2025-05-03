import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Image {
  id: string;
  file: File;
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
  updateImageFile: (id: string, newFile: File) => void;
  clearImages: () => void;
  setCropMode: (isCropMode: boolean) => void;
  applyImageCrop: (
    imageId: string,
    cropRegion: { top: number; right: number; bottom: number; left: number }
  ) => void;
  naturalSize: { width: number; height: number };
  displaySize: { width: number; height: number };
  setNaturalSize: (width: number, height: number) => void;
  setDisplaySize: (width: number, height: number) => void;
}

export const useImageStore = create<ImageState>()(
  devtools(set => ({
    images: [],
    selectedImage: null,
    isCropMode: false,
    naturalSize: { width: 0, height: 0 },
    displaySize: { width: 0, height: 0 },
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
    updateImageFile: (id, newFile) =>
      set(state => ({
        images: state.images.map(img =>
          img.id === id ? { ...img, file: newFile, isModified: true } : img
        ),
        selectedImage:
          state.selectedImage?.id === id
            ? { ...state.selectedImage, file: newFile, isModified: true }
            : state.selectedImage,
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
    setNaturalSize: (width: number, height: number) => set({ naturalSize: { width, height } }),
    setDisplaySize: (width: number, height: number) => set({ displaySize: { width, height } }),
  }))
);
