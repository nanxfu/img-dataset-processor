# 图片数据集处理器 (Image Dataset Processor)

这是一个基于React和TypeScript开发的图片数据集处理工具，可用于lora数据集处理。提供了图片预览、裁剪和编辑等用户友好，开箱即用的功能。

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design
- **状态管理**: Zustand
- **样式处理**:
  - Styled Components
- **代码质量工具**:
  - ESLint
  - Prettier
  - TypeScript

## 功能特性

- 图片预览和缩放
- 图片裁剪区域选择
- 图片编辑功能
- 响应式设计
- 现代化的用户界面

## 项目结构

```
src/
├── components/      # 通用组件
├── features/        # 功能模块
├── hooks/           # 自定义Hooks
├── store/           # 状态管理
├── types/           # TypeScript类型定义
├── constans/        # 常量定义
├── App.tsx          # 主应用组件
└── main.tsx         # 应用入口
```

## 开发环境设置

### 前提条件

- Node.js (推荐使用最新LTS版本)
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发服务器

```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 代码质量工具

- 代码格式化：

  ```bash
  npm run format
  # 或
  yarn format
  ```

- 代码检查：
  ```bash
  npm run lint
  # 或
  yarn lint
  ```

## 主要依赖

- react: ^18.3.1
- react-dom: ^18.3.1
- antd: ^5.24.5
- zustand: ^5.0.3
- styled-components: ^6.1.17

## 开发工具

- VSCode (推荐)
- ESLint
- Prettier
- TypeScript

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

[MIT](LICENSE)
