import { Layout } from 'antd';

import './App.css';
import { ImageRefProvider } from './contexts/ImageRefContext';
import EditorLayout from './features/EditorSpace/EditorSpace';
import ToolSidebar from './features/ToolBar/ToolSidebar';

function App() {
  return (
    <ImageRefProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <ToolSidebar />
        <EditorLayout />
      </Layout>
    </ImageRefProvider>
  );
}

export default App;
