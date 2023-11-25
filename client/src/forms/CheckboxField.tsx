import { Checkbox } from "@chakra-ui/react";
import FormField, { FormFieldProps } from "./FormField";

interface CheckboxFieldProps extends FormFieldProps {
  checked: boolean;
  children: React.ReactNode;
  name: string;
  setChecked: (checked: boolean) => void;
}

export default function CheckboxField({
  checked,
  children,
  name,
  setChecked,
  ...formFieldProps
}: CheckboxFieldProps): JSX.Element {
  return (
    <FormField {...formFieldProps}>
      <Checkbox
        name={name}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      >
        {children}
      </Checkbox>
    </FormField>
  );
}
