import styled from 'styled-components';

const PanelContainer = styled.section`
  /* 布局属性 */
  display: flex;
  flex-direction: column;

  /* 盒模型属性 */
  border-bottom: 1px solid #f0f0f0;
  margin: 25px 0px;
  padding: 0px 16px;
  border-radius: 16px;
`;

const PanelTitle = styled.header`
  /* 布局属性 */
  display: flex;
  align-items: center;
  height: 48px;

  /* 盒模型属性 */
  padding: 0 20px;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 16px 16px 0 0;

  /* 视觉属性 */
  background-color: #fff5f7;
  color: #ff69b4;

  /* 文本属性 */
  font-size: 14px;
  font-weight: 600;

  /* 动画属性 */
  transition: all 0.3s ease;

  &:hover {
    background-color: #ffe4e9;
  }
`;

const PanelContent = styled.div`
  /* 布局属性 */
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* 盒模型属性 */
  padding: 16px 20px;

  /* 视觉属性 */
  background-color: #ffffff;
`;

const ToolButton = styled.div<{ $isActive?: boolean }>`
  /* 布局属性 */
  display: flex;
  align-items: center;
  height: 40px;

  /* 盒模型属性 */
  padding: 0 12px;
  border-radius: 6px;

  /* 视觉属性 */
  color: ${props => (props.$isActive ? '#ff69b4' : '#1a1a1a')};
  background-color: ${props => (props.$isActive ? '#fff5f7' : 'transparent')};
  cursor: pointer;

  /* 文本属性 */
  font-size: 14px;

  /* 动画属性 */
  transition: all 0.3s ease;

  &:hover {
    background-color: #fff5f7;
    color: #ff69b4;
  }

  &:active {
    background-color: #ffe4e9;
  }
`;

interface ToolItem {
  id: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface SettingPanelProps {
  title: string;
  tools: ToolItem[];
}

const SettingPanel: React.FC<SettingPanelProps> = ({ title, tools }) => {
  return (
    <PanelContainer>
      <PanelTitle>{title}</PanelTitle>
      <PanelContent>
        {tools.map(tool => (
          <ToolButton key={tool.id} onClick={tool.onClick} $isActive={tool.isActive}>
            {tool.label}
          </ToolButton>
        ))}
      </PanelContent>
    </PanelContainer>
  );
};

export default SettingPanel;
