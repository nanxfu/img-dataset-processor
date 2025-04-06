import styled from "styled-components";

const PanelTitle = styled.header`
  height: 49px;
  background-color: rgba(255, 105, 180,0.1);
`
const PanelContent = styled.div`

display: flex;
flex-direction: column;
  padding: 16px;
  border: 1px solid gainsboro;
`
const ToolButton = styled.div`
  height: 64px;
`
const SettingPanel: React.FC<{ title: string }> = ({ title }) => {
  return <section style={{ display: 'flex', flexDirection: 'column' }}>
    <PanelTitle>
      title
    </PanelTitle>
    <PanelContent>
    <ToolButton>
      喵喵喵
    </ToolButton>
    </PanelContent>
  </section>;
};

export default SettingPanel;


