import React, { ReactNode } from 'react';
import { styled } from 'styled-components';

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
}

const StyledButton = styled.button<{
  $backgroundColor?: string;
  $hoverBackgroundColor?: string;
}>`
  /* 布局属性 */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 盒模型属性 */
  flex: 1;
  padding: 6px 12px;
  margin-left: 8px;
  border: none;
  border-radius: 4px;

  /* 视觉属性 */
  background-color: ${props => props.$backgroundColor || '#ff69b4'};
  color: white;
  font-weight: bold;
  cursor: pointer;

  /* 动画属性 */
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.$hoverBackgroundColor || '#ff5ba7'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  style,
  className,
  disabled = false,
  backgroundColor,
  hoverBackgroundColor,
}) => {
  return (
    <StyledButton
      onClick={onClick}
      style={style}
      className={className}
      disabled={disabled}
      $backgroundColor={backgroundColor}
      $hoverBackgroundColor={hoverBackgroundColor}
    >
      {children}
    </StyledButton>
  );
};

export default ActionButton;
