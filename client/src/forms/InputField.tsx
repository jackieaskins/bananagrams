import { Input } from "@chakra-ui/react";
import FormField, { FormFieldProps } from "./FormField";

export interface InputFieldProps extends FormFieldProps {
  setValue: (newValue: string) => void;
  type?: React.HTMLInputTypeAttribute;
  value: string;
}

export default function InputField({
  name,
  setValue,
  type,
  value,
  ...formFieldProps
}: InputFieldProps): JSX.Element {
  return (
    <FormField name={name} {...formFieldProps}>
      <Input
        id={name}
        type={type}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        name={name}
      />
    </FormField>
  );
}
