import React from 'react';
import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap/FormControl';

interface InputFieldProps extends FormControlProps {
  label?: React.ReactNode;
  name: string;
  setValue: (newValue: string) => void;
  value: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  setValue,
  value,
  ...rest
}) => (
  <Form.Group controlId={name}>
    {label ? <Form.Label>{label}</Form.Label> : null}
    <Form.Control
      {...rest}
      name={name}
      onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
        setValue(event.target.value)
      }
      value={value}
    />
  </Form.Group>
);

export default InputField;
