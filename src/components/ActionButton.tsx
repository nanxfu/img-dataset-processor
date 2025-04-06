import React, { ReactNode } from 'react';
import { Button } from 'antd';

interface ActionButtonProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
  type?: 'text' | 'link' | 'default' | 'primary' | 'dashed';
  size?: 'large' | 'middle' | 'small';
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  text,
  onClick,
  style,
  className,
  disabled = false
}) => {
  return (
    <Button
      type='text'
      size= 'large'
      block
      onClick={onClick}
      style={{
        paddingTop: '8px',
        paddingBottom: '8px',
        height: 'auto',
        ...style
      }}
      className={className}
      disabled={disabled}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {React.cloneElement(icon as React.ReactElement, { style: { fontSize: '18px' } })}
        <span style={{ fontSize: '12px' }}>{text}</span>
      </div>
    </Button>
  );
};

export default ActionButton; 