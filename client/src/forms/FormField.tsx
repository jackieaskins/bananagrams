import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";

export interface FormFieldProps {
  helperText?: React.ReactNode;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  label?: React.ReactNode;
}

export default function FormField({
  children,
  helperText,
  isDisabled,
  isReadOnly,
  isRequired,
  label,
}: FormFieldProps & { children: React.ReactNode }): JSX.Element {
  return (
    <FormControl
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      {label && <FormLabel>{label}</FormLabel>}
      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
