import { FolderOpenOutlined } from '@ant-design/icons';
import { Button, Layout, notification, Upload } from 'antd';
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

  height: 160px;

  /* 盒模型属性 */
  margin: 25px 16px;
  border-bottom: 1px solid #f0f0f0;

  /* 视觉属性 */
  border-radius: 8px;
  /* 动画属性 */
  transition: all 0.3s ease;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    border: 2px dashed #d1d5db;
    border-radius: 8px;

    &:hover {
      border-color: #ff69b4;
    }
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
  const selectedImage = useImageStore(state => state.selectedImage);
  const isCropMode = useImageStore(state => state.isCropMode);
  const setCropMode = useImageStore(state => state.setCropMode);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.info({
      message: '提示',
      description: '请先选择或者导入图片',
    });
  };
  const handleFileUpload = (info: UploadChangeParam) => {
    if (info.file && info.file.status !== 'uploading') {
      const file = info.file.originFileObj as RcFile;
      const newImage = {
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
      };
      addImage(newImage);
    }
  };

  const imageProcessingTools = [
    {
      id: 'crop',
      label: '调整尺寸',
      onClick: () => {
        if (selectedImage) {
          setCropMode(!isCropMode);
        } else {
          openNotification();
        }
      },
      isActive: isCropMode,
    },
    {
      id: 'repair',
      label: '高清修复',
      onClick: () => {
        // 处理调整尺寸
      },
      isActive: false,
    },
    {
      id: 'removeWatermark',
      label: '去除水印',
      onClick: () => {
        // 处理去除水印
      },
      isActive: false,
    },
  ];

  const advancedSettingsTools = [
    {
      id: 'other',
      label: '其他设置',
      onClick: () => {
        // 处理其他设置
      },
    },
  ];

  return (
    <StyledSider width={280}>
      {contextHolder}
      <AppTitle>图片数据集处理器</AppTitle>
      <UploadImageArea>
        <div className="outline">
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
        </div>
      </UploadImageArea>
      <SettingPanel title="图片处理" tools={imageProcessingTools} />
      <SettingPanel title="高级设置" tools={advancedSettingsTools} />
    </StyledSider>
  );
};

export default ToolSidebar;
