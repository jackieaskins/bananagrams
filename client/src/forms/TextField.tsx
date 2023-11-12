import {
  TextField as MaterialUITextField,
  StandardTextFieldProps as MaterialUITextFieldProps,
} from "@mui/material";

export interface TextFieldProps extends MaterialUITextFieldProps {
  setValue: (newValue: string) => void;
  value: string;
}

export default function TextField({
  fullWidth = true,
  setValue,
  ...rest
}: TextFieldProps): JSX.Element {
  return (
    <MaterialUITextField
      fullWidth={fullWidth}
      {...rest}
      onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
        setValue(event.target.value)
      }
    />
  );
}
