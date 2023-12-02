import { Input } from "@chakra-ui/react";
import FormField, { FormFieldProps } from "./FormField";

export interface InputFieldProps extends FormFieldProps {
  autoComplete?: string;
  setValue: (newValue: string) => void;
  type?: React.HTMLInputTypeAttribute;
  value: string;
}

export default function InputField({
  autoComplete,
  name,
  setValue,
  type,
  value,
  ...formFieldProps
}: InputFieldProps): JSX.Element {
  return (
    <FormField name={name} {...formFieldProps}>
      <Input
        autoComplete={autoComplete}
        id={name}
        type={type}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        name={name}
      />
    </FormField>
  );
}
