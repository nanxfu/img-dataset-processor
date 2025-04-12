import React, { createContext, useRef, ReactNode } from 'react';

// 定义Context类型
interface ImageRefContextType {
  imageRef: React.RefObject<HTMLImageElement>;
}

// 创建Context，使用非空断言
const defaultRef = { current: null } as React.RefObject<HTMLImageElement>;
// 导出Context，以便hooks文件可以使用
export const ImageRefContext = createContext<ImageRefContextType>({ imageRef: defaultRef });

// 提供Provider组件
interface ImageRefProviderProps {
  children: ReactNode;
}

export const ImageRefProvider: React.FC<ImageRefProviderProps> = ({ children }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  return <ImageRefContext.Provider value={{ imageRef }}>{children}</ImageRefContext.Provider>;
};
