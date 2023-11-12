import { FormControl, FormLabel, Input } from "@chakra-ui/react";

export interface TextFieldProps {
  isRequired?: boolean;
  label?: React.ReactNode;
  name: string;
  setValue: (newValue: string) => void;
  type?: React.HTMLInputTypeAttribute;
  value: string;
}

export default function TextField({
  isRequired = false,
  label,
  name,
  setValue,
  type,
  value,
}: TextFieldProps): JSX.Element {
  return (
    <FormControl isRequired={isRequired}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Input
        id={name}
        type={type}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        name={name}
      />
    </FormControl>
  );
}
