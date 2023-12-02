import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";

export interface FormFieldProps {
  helperText?: React.ReactNode;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  label?: React.ReactNode;
  name: string;
}

export default function FormField({
  children,
  helperText,
  isDisabled,
  isReadOnly,
  isRequired,
  label,
  name,
}: FormFieldProps & { children: React.ReactNode }): JSX.Element {
  return (
    <FormControl
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
