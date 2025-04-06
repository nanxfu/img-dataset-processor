import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Image {
  id: string
  url: string
  name: string
}

interface ImageState {
  images: Image[]
  selectedImage: Image | null
  addImage: (image: Image) => void
  removeImage: (id: string) => void
  selectImage: (id: string) => void
  clearImages: () => void
}

export const useImageStore = create<ImageState>()(
  devtools(
    (set) => ({
      images: [],
      selectedImage: null,
      addImage: (image) => 
        set((state) => ({ 
          images: [...state.images, image],
          selectedImage: image 
        })),
      removeImage: (id) =>
        set((state) => ({
          images: state.images.filter((img) => img.id !== id),
          selectedImage: 
            state.selectedImage?.id === id ? null : state.selectedImage
        })),
      selectImage: (id) =>
        set((state) => ({
          selectedImage: state.images.find((img) => img.id === id) || null
        })),
      clearImages: () => set({ images: [], selectedImage: null })
    })
  )
) 