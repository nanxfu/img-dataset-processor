import { Layout } from 'antd';

import './App.css';
import EditorLayout from './features/EditorSpace/EditorSpace';
import ToolSidebar from './features/ToolBar/ToolSidebar';

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ToolSidebar />
      <EditorLayout />
    </Layout>
  );
}

export default App;
