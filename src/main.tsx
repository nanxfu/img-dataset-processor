import { ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontSize: 14,
          lineHeight: 1.5,
          controlHeight: 40,
          colorPrimary: '#ff69b4',
          colorInfo: '#ff69b4',
          borderRadius: 6,
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          colorBgLayout: '#f5f5f5',
          colorText: '#1a1a1a',
          colorTextSecondary: '#666666',
          colorBorder: '#f0f0f0',
          colorBorderSecondary: '#f0f0f0',
        },
        components: {
          Button: {
            borderRadius: 6,
            controlHeight: 40,
          },
          Card: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          },
          Layout: {
            colorBgHeader: '#ffffff',
            colorBgBody: '#f5f5f5',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);
