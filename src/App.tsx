import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Upload, 
  Card, 
  Select, 
  Slider, 
  Empty, 
  Typography
} from 'antd';
import { 
  UploadOutlined, 
  PictureOutlined, 
  SettingOutlined, 
  FolderOpenOutlined 
} from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import './App.css';
import type { RcFile } from 'antd/es/upload/interface';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface ImageItem {
  id: string;
  url: string;
  name: string;
}

function App() {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const handleFileUpload = (info: UploadChangeParam) => {
    if (info.file && info.file.status !== 'uploading') {
      const file = info.file.originFileObj as RcFile;
      const newImage = {
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        name: file.name
      };
      setImages([...images, newImage]);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PictureOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
          <Title level={3} style={{ margin: '0'  }}>LoRA 数据集处理器</Title>
        </div>
      </Header>
      <Layout>
        {/* 左侧边栏 - 图片列表 */}
        <Sider width={250} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '16px' }}>
            <Upload
              accept="image/*"
              multiple
              showUploadList={false}
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess?.(null);
                }, 0);
              }}
              onChange={handleFileUpload}
            >
              <Button icon={<FolderOpenOutlined />} block type="primary" style={{ background: '#eb2f96', borderColor: '#eb2f96' }}>
                导入图片
              </Button>
            </Upload>
          </div>
          <Menu
            mode="inline"
            selectedKeys={selectedImage ? [selectedImage.id] : []}
            style={{ 
              flex: 1,
              overflow: 'auto', 
              borderRight: 0,
              minHeight: 0 
            }}
          >
            {images.map(image => (
              <Menu.Item 
                key={image.id} 
                onClick={() => setSelectedImage(image)}
                icon={
                  <div style={{ width: '32px', height: '32px', overflow: 'hidden', marginRight: '8px' }}>
                    <img src={image.url} alt={image.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                }
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {image.name}
                </span>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        
        {/* 主内容 - 图片预览 */}
        <Content style={{ 
          background: '#f5f5f5', 
          padding: '16px', 
          display: 'flex',
        }}>
          <Card
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
            className='img-preview-card'
          >
            {selectedImage ? (
              <>
                <div style={{ padding: '12px', borderBottom: '1px solid #f0f0f0'}}>
                  <Title level={4} style={{ margin: 0 }}>{selectedImage.name}</Title>
                </div>
                <div style={{ 
                  background: '#fafafa',
                  padding: '24px',
                  textAlign: 'center',
                  flex: 1,
                  overflow: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <div style={{height: '100%', width: '100%', position: 'relative'}}>
                  <img
                      src={selectedImage.url}
                      alt={selectedImage.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <Empty
                image={<UploadOutlined style={{ fontSize: '64px', color: '#eb2f96' }} />}
                description="选择一张图片进行预览"
                style={{ margin: 'auto', padding: '48px 0' }}
              />
            )}
          </Card>
        </Content>
        
        {/* 右侧边栏 - 图片操作 */}
        <Sider width={280} theme="light" style={{ borderLeft: '1px solid #f0f0f0' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <SettingOutlined style={{ fontSize: '18px', color: '#eb2f96', marginRight: '8px' }} />
              <Title level={4} style={{ margin: 0 }}>图片操作</Title>
            </div>
          </div>
          <div style={{ padding: '16px' }}>
            {selectedImage ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <Typography.Text strong style={{ display: 'block', marginBottom: '8px' }}>调整大小</Typography.Text>
                  <Select defaultValue="512x512" style={{ width: '100%' }}>
                    <Option value="512x512">512 x 512</Option>
                    <Option value="768x768">768 x 768</Option>
                    <Option value="1024x1024">1024 x 1024</Option>
                  </Select>
                </div>
                <div>
                  <Typography.Text strong style={{ display: 'block', marginBottom: '8px' }}>质量</Typography.Text>
                  <Slider defaultValue={90} />
                </div>
                <Button type="primary" block style={{ background: '#eb2f96', borderColor: '#eb2f96' }}>
                  处理图片
                </Button>
              </div>
            ) : (
              <Empty
                description="选择一张图片显示操作选项"
                style={{ margin: 'auto' }}
              />
            )}
          </div>
        </Sider>
      </Layout>
    </Layout>
  );
}

export default App;
