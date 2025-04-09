import { FolderOpenOutlined } from '@ant-design/icons';
import { Button, Layout, Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import styled from 'styled-components';

import { useImageStore } from '../../store/useImageStore';

import SettingPanel from './components/SettingPanel';
const { Sider } = Layout;
const AppTitle = styled.div`
  padding: 16px;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
`;
const UploadImageArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  height: 128px;
`;

const ToolSidebar: React.FC = () => {
  const addImage = useImageStore(state => state.addImage);

  const handleFileUpload = (info: UploadChangeParam) => {
    if (info.file && info.file.status !== 'uploading') {
      const file = info.file.originFileObj as RcFile;
      const newImage = {
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        name: file.name,
      };
      addImage(newImage);
    }
  };
  return (
    <Sider width={250} theme="light">
      <AppTitle>图片数据集处理器</AppTitle>
      <UploadImageArea>
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
          <Button icon={<FolderOpenOutlined />} block type="primary">
            导入图片
          </Button>
        </Upload>
      </UploadImageArea>
      <SettingPanel title="图片处理" />
      <SettingPanel title="高级设置" />
    </Sider>
  );
};

export default ToolSidebar;
