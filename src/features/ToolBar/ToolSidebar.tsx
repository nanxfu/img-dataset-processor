import { FolderOpenOutlined } from '@ant-design/icons';
import { Button, Layout, Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import styled from 'styled-components';

import { useImageStore } from '../../store/useImageStore';

import SettingPanel from './components/SettingPanel';
const { Sider } = Layout;

const StyledSider = styled(Sider)`
  /* 布局属性 */
  position: relative;

  /* 盒模型属性 */
  background-color: #ffffff;
  border-right: 1px solid #f0f0f0;

  /* 视觉属性 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const AppTitle = styled.div`
  /* 布局属性 */
  display: flex;
  align-items: center;

  /* 盒模型属性 */
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;

  /* 文本属性 */
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: #ff69b4;
`;

const UploadImageArea = styled.div`
  /* 布局属性 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 160px;

  /* 盒模型属性 */
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;

  /* 视觉属性 */
  background-color: #fff5f7;

  /* 动画属性 */
  transition: all 0.3s ease;

  &:hover {
    background-color: #ffe4e9;
  }
`;

const UploadButton = styled(Button)`
  /* 布局属性 */
  height: 40px;

  /* 盒模型属性 */
  border-radius: 8px;

  /* 文本属性 */
  font-size: 14px;

  /* 动画属性 */
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.2);
  }
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
    <StyledSider width={280}>
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
          <UploadButton icon={<FolderOpenOutlined />} block type="primary">
            导入图片
          </UploadButton>
        </Upload>
      </UploadImageArea>
      <SettingPanel title="图片处理" />
      <SettingPanel title="高级设置" />
    </StyledSider>
  );
};

export default ToolSidebar;
