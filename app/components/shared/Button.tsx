'use client';

import React from 'react';
import Button from 'react-bootstrap/Button';

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  type = 'button',
  className = '',
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-pill fw-semibold border-0 ${className}`}
      style={{ backgroundColor: '#468386' }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
