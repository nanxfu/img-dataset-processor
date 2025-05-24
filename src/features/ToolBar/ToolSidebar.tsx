import { FolderOpenOutlined } from '@ant-design/icons';
import { Button, Layout, notification, Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import styled from 'styled-components';

import { useEditorStore } from '../../store/useEditorStore';

const { Sider } = Layout;

const StyledSider = styled(Sider)`
  /* 布局属性 */
  position: relative;

  /* 盒模型属性 */
  background-color: #fafafa;
  border-right: 1px solid #e8e8e8;

  /* 视觉属性 */
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.04);
`;

const AppTitle = styled.div`
  /* 布局属性 */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 盒模型属性 */
  padding: 24px 20px;
  border-bottom: 1px solid #f0f0f0;

  /* 文本属性 */
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #262626;
`;

const UploadImageArea = styled.div`
  /* 布局属性 */
  height: 160px;

  /* 盒模型属性 */
  margin: 24px 16px;
  padding: 0;

  /* 视觉属性 */
  border-radius: 8px;
  /* 动画属性 */
  transition: all 0.2s ease;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    background-color: #fafafa;

    &:hover {
      border-color: #ff69b4;
      background-color: #fff;
    }
  }
`;

const UploadButton = styled(Button)`
  /* 布局属性 */
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  /* 盒模型属性 */
  padding: 0 20px;
  border: 1px solid #ff69b4;
  border-radius: 6px;
  background-color: #ff69b4;

  /* 文本属性 */
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;

  /* 动画属性 */
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff5aa3;
    border-color: #ff5aa3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  .anticon {
    font-size: 14px;
  }
`;

const InfoPanel = styled.div`
  padding: 16px;
  margin: 0 16px 16px 16px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;

  &:hover {
    border-color: #e8e8e8;
  }

  transition: border-color 0.2s ease;
`;

const InfoTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
`;

const InfoContent = styled.div`
  font-size: 13px;
  color: #595959;
  line-height: 1.5;

  > div {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  background-color: #ff69b4;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
`;

const CurrentToolText = styled.span`
  color: #ff69b4;
  font-weight: 500;
`;

const ToolSidebar: React.FC = () => {
  const addImage = useEditorStore(state => state.addImage);
  const selectedImage = useEditorStore(state => state.selectedImage);
  const images = useEditorStore(state => state.images);
  const currentTool = useEditorStore(state => state.currentTool);
  const [api, contextHolder] = notification.useNotification();

  const handleFileUpload = (info: UploadChangeParam) => {
    if (info.file && info.file.status !== 'uploading') {
      const file = info.file.originFileObj as RcFile;
      const newImage = {
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
      };
      addImage(newImage);

      // 显示成功提示
      api.success({
        message: '导入成功',
        description: `已成功导入图片: ${file.name}`,
        duration: 2,
      });
    }
  };

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

      {/* 显示当前状态信息 */}
      <InfoPanel>
        <InfoTitle>当前状态</InfoTitle>
        <InfoContent>
          <div>
            已导入图片:<StatusBadge>{images.length}</StatusBadge>
          </div>
          {selectedImage && (
            <div>
              当前选中:{' '}
              {selectedImage.name.length > 18
                ? `${selectedImage.name.substring(0, 18)}...`
                : selectedImage.name}
            </div>
          )}
          {currentTool && (
            <div>
              当前工具: <CurrentToolText>{getToolDisplayName(currentTool)}</CurrentToolText>
            </div>
          )}
        </InfoContent>
      </InfoPanel>

      {/* 操作提示 */}
      <InfoPanel>
        <InfoTitle>使用指南</InfoTitle>
        <InfoContent>
          <div>1. 点击"导入图片"添加图片文件</div>
          <div>2. 在右侧缩略图中选择要编辑的图片</div>
          <div>3. 从中间工具栏选择编辑工具</div>
          <div>4. 在右侧属性面板调整设置</div>
        </InfoContent>
      </InfoPanel>
    </StyledSider>
  );
};

// 工具显示名称映射
function getToolDisplayName(tool: string): string {
  const toolNames: Record<string, string> = {
    resize: '调整尺寸',
    crop: '裁剪',
    'ai-classify': 'AI分类',
    'ai-upscale': 'AI放大',
    'ai-repair': '高清修复',
    'remove-watermark': '去水印',
  };
  return toolNames[tool] || tool;
}

export default ToolSidebar;
