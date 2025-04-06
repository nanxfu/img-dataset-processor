import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ConfigProvider, theme } from 'antd';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{
      token: {
        // colorBgContainer: '#1F2937',
        colorInfo: '#ed4192',
        colorPrimary: '#ED4192',
        borderRadius: 4,
      },
    }}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
