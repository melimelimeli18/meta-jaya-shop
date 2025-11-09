'use client';

import React from 'react';
import Form from 'react-bootstrap/Form';

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  as?: 'input' | 'textarea';
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  as = 'input',
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-semibold">{label}</Form.Label>
      {as === 'textarea' ? (
        <Form.Control
          as="textarea"
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="rounded-pill border-2"
          style={{ borderColor: '#468386' }}
        />
      ) : (
        <Form.Control
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="rounded-pill border-2"
          style={{ borderColor: '#468386' }}
        />
      )}
    </Form.Group>
  );
};

export default InputField;
