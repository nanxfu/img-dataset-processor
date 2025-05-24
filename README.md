# 图片数据集处理器 - 重构架构说明

## 项目概述

这是一个基于 React + TypeScript 的图片处理应用，支持基础编辑功能和 AI 增强功能。

## 🏗️ 重构后的架构

### 1. 功能模块划分

```
src/
├── features/
│   ├── EditorSpace/           # 编辑器核心功能
│   │   ├── components/
│   │   │   ├── ImageCanvas.tsx      # 图片画布组件
│   │   │   ├── PropertyPanel.tsx    # 属性面板
│   │   │   ├── ToolPalette.tsx      # 工具调色板
│   │   │   ├── ThumbnailPanel.tsx   # 缩略图面板
│   │   │   ├── WelcomeScreen.tsx    # 欢迎屏幕
│   │   │   └── panels/
│   │   │       ├── BasicEditPanel.tsx    # 基础编辑面板
│   │   │       └── AiProcessingPanel.tsx  # AI处理面板
│   │   └── EditorSpace.tsx          # 编辑器主组件
│   ├── ToolBar/               # 工具栏功能
│   │   └── ToolSidebar.tsx          # 侧边栏
│   └── AiProcessing/          # AI处理功能
│       └── services/
│           ├── aiModelRegistry.ts   # AI模型注册
│           └── imageHelper.ts       # 图片处理工具
├── store/
│   ├── useEditorStore.ts      # 主要状态管理
│   └── useImageStore.ts       # 图片状态管理（兼容性）
├── hooks/
│   ├── useImageStoreAdapter.ts      # 状态适配器
│   ├── useCropImage.ts              # 裁剪功能
│   ├── useCropRegionDrawer.ts       # 裁剪区域绘制
│   └── useImageObserver.ts          # 图片观察器
├── components/
│   └── ActionButton.tsx       # 通用按钮组件
└── utils/
    └── resizeImage.ts         # 图片尺寸调整工具
```

### 2. 核心组件职责

#### 🎨 ImageCanvas (图片画布)

- **职责**: 图片显示、缩放、裁剪交互
- **功能**:
  - 图片预览和缩放控制
  - 裁剪区域绘制
  - 图片元数据显示
  - 缩略图面板集成

#### 🛠️ ToolPalette (工具调色板)

- **职责**: 工具选择和状态管理
- **功能**:
  - 基础编辑工具（调整尺寸、裁剪）
  - AI处理工具（分类、放大、修复、去水印）
  - 工具状态可视化

#### ⚙️ PropertyPanel (属性面板)

- **职责**: 工具参数配置
- **功能**:
  - 根据选中工具动态显示配置面板
  - 基础编辑参数设置
  - AI处理参数配置

#### 📁 ToolSidebar (工具侧边栏)

- **职责**: 文件管理和状态显示
- **功能**:
  - 图片导入
  - 当前状态显示
  - 使用指南

### 3. 状态管理架构

#### useEditorStore (主要状态)

```typescript
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

  // 图片尺寸状态
  naturalSize: Size;
  displaySize: Size;

  // 裁剪状态
  isCropMode: boolean;
  cropRegion: CropRegion;
}
```

#### 工具类型定义

```typescript
type ToolType =
  | 'resize' // 调整尺寸
  | 'crop' // 裁剪
  | 'ai-upscale' // AI放大
  | 'ai-classify' // AI分类
  | 'ai-repair' // 高清修复
  | 'remove-watermark' // 去水印
  | null; // 无选中工具
```

### 4. 功能特性

#### 🔧 基础编辑功能

- **尺寸调整**: 支持自定义尺寸、预设比例、拉伸/按比例缩放
- **图片裁剪**: 交互式裁剪区域选择、实时预览

#### 🤖 AI增强功能

- **图片分类**: 使用 ONNX 模型进行图片内容识别
- **AI放大**: 4倍超分辨率放大，保持图片质量
- **高清修复**: 智能去噪和质量提升（开发中）
- **去水印**: 智能水印移除（开发中）

#### 📊 用户体验

- **实时预览**: 所有操作都有实时视觉反馈
- **状态管理**: 清晰的工具状态和操作提示
- **响应式设计**: 适配不同屏幕尺寸
- **性能优化**: 图片懒加载、内存管理

### 5. 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Zustand
- **样式方案**: Styled-components
- **UI组件**: Ant Design
- **AI推理**: ONNX Runtime Web
- **构建工具**: Vite

### 6. 开发指南

#### 添加新工具

1. 在 `ToolType` 中添加新工具类型
2. 在 `ToolPalette` 中添加工具按钮
3. 创建对应的面板组件
4. 在 `PropertyPanel` 中注册面板

#### 添加新的AI功能

1. 在 `aiModelRegistry.ts` 中注册模型
2. 在 `imageHelper.ts` 中添加处理函数
3. 在 `AiProcessingPanel` 中添加UI界面

### 7. 性能优化

- **图片内存管理**: 自动释放 ObjectURL
- **组件懒加载**: 按需加载大型组件
- **状态优化**: 避免不必要的重渲染
- **AI模型缓存**: 模型加载后缓存复用

### 8. 未来规划

- [ ] 批量处理功能
- [ ] 更多AI模型集成
- [ ] 云端处理支持
- [ ] 插件系统
- [ ] 协作功能

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📝 更新日志

### v2.0.0 - 架构重构

- ✅ 重新组织组件结构
- ✅ 统一状态管理
- ✅ 优化用户体验
- ✅ 提升代码可维护性
