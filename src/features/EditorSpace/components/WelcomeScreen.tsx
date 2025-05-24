import React from 'react';

import { useImageStore } from '../../../store/useImageStore';

const WelcomeScreen: React.FC = () => {
  const addImage = useImageStore(state => state.addImage);

  const handleFileImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files) as File[];
      files.forEach(file => {
        addImage({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
          file,
          name: file.name,
        });
      });
    };
    input.click();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#222',
        background: '#fff',
      }}
    >
      <h2
        style={{
          fontWeight: 800,
          fontSize: 32,
          marginBottom: 8,
          color: '#ff4fa2',
          textShadow: '0 2px 8px #ff4fa233',
        }}
      >
        欢迎使用 LoRA 图像炼金炉
      </h2>
      <div
        style={{
          color: '#a0a0a0',
          fontSize: 18,
          marginBottom: 32,
          textAlign: 'center',
          maxWidth: 480,
        }}
      >
        将你的图片拖拽到此处，或点击下方按钮导入图片，开启高质量数据集的炼制之旅。
      </div>
      <div style={{ display: 'flex', gap: 32, marginBottom: 20 }}>
        {/* 导入图片卡片 */}
        <div
          style={{
            background: '#fff0f6',
            borderRadius: 16,
            padding: '32px 28px',
            minWidth: 220,
            boxShadow: '0 2px 12px #ff4fa233',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: '#ff4fa2',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 28, color: '#fff' }}>📥</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#ff4fa2', marginBottom: 8 }}>
            导入图片
          </div>
          <div style={{ color: '#a0a0a0', fontSize: 15, marginBottom: 18, textAlign: 'center' }}>
            拖拽图片或从设备选择文件。
          </div>
          <button
            style={{
              background: '#ff4fa2',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              borderRadius: 8,
              padding: '8px 24px',
              cursor: 'pointer',
              marginTop: 8,
              boxShadow: '0 2px 8px #ff4fa233',
            }}
            onClick={handleFileImport}
            onMouseOver={e => (e.currentTarget.style.background = '#ff6fc1')}
            onMouseOut={e => (e.currentTarget.style.background = '#ff4fa2')}
          >
            立即导入
          </button>
        </div>
        {/* 处理与增强卡片 */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: '32px 28px',
            minWidth: 220,
            boxShadow: '0 2px 12px #ff4fa233',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: '#ffb6df',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 28, color: '#ff4fa2' }}>⚡</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#ff4fa2', marginBottom: 8 }}>
            处理与增强
          </div>
          <div style={{ color: '#a0a0a0', fontSize: 15, marginBottom: 18, textAlign: 'center' }}>
            自动检测质量、增强图片、去除水印。
          </div>
          <button
            disabled
            style={{
              background: '#ffb6df',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              borderRadius: 8,
              padding: '8px 24px',
              opacity: 0.6,
              cursor: 'not-allowed',
              marginTop: 8,
            }}
          >
            等待导入
          </button>
        </div>
        {/* 导出训练卡片 */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: '32px 28px',
            minWidth: 220,
            boxShadow: '0 2px 12px #ff4fa233',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: '#ffe0f0',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 28, color: '#ff4fa2' }}>🔗</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#ff4fa2', marginBottom: 8 }}>
            导出训练
          </div>
          <div style={{ color: '#a0a0a0', fontSize: 15, marginBottom: 18, textAlign: 'center' }}>
            导出为LoRA训练兼容格式。
          </div>
          <button
            disabled
            style={{
              background: '#ffe0f0',
              color: '#ff4fa2',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              borderRadius: 8,
              padding: '8px 24px',
              opacity: 0.6,
              cursor: 'not-allowed',
              marginTop: 8,
            }}
          >
            等待导入
          </button>
        </div>
      </div>
      {/* Complete Workflow 流程条 */}
      <div
        style={{
          marginTop: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 22, color: '#ff4fa2', marginBottom: 12 }}>
          完整流程
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              background: '#fff0f6',
              color: '#ff4fa2',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              border: '1.5px solid #ff4fa2',
            }}
          >
            📥
          </span>
          <span style={{ color: '#a0a0a0', fontSize: 16 }}>导入</span>
          <span style={{ color: '#ff4fa2', fontSize: 22, margin: '0 6px' }}>→</span>
          <span
            style={{
              background: '#fff0f6',
              color: '#ff4fa2',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              border: '1.5px solid #ff4fa2',
            }}
          >
            ✔️
          </span>
          <span style={{ color: '#a0a0a0', fontSize: 16 }}>质检</span>
          <span style={{ color: '#ff4fa2', fontSize: 22, margin: '0 6px' }}>→</span>
          <span
            style={{
              background: '#fff0f6',
              color: '#ff4fa2',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              border: '1.5px solid #ff4fa2',
            }}
          >
            ✨
          </span>
          <span style={{ color: '#a0a0a0', fontSize: 16 }}>增强</span>
          <span style={{ color: '#ff4fa2', fontSize: 22, margin: '0 6px' }}>→</span>
          <span
            style={{
              background: '#fff0f6',
              color: '#ff4fa2',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              border: '1.5px solid #ff4fa2',
            }}
          >
            ✏️
          </span>
          <span style={{ color: '#a0a0a0', fontSize: 16 }}>LoRA编辑</span>
          <span style={{ color: '#ff4fa2', fontSize: 22, margin: '0 6px' }}>→</span>
          <span
            style={{
              background: '#fff0f6',
              color: '#ff4fa2',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              border: '1.5px solid #ff4fa2',
            }}
          >
            🔗
          </span>
          <span style={{ color: '#a0a0a0', fontSize: 16 }}>导出</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
