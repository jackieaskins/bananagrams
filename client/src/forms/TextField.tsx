import {
  TextField as MaterialUITextField,
  StandardTextFieldProps as MaterialUITextFieldProps,
} from '@material-ui/core';

export interface TextFieldProps extends MaterialUITextFieldProps {
  setValue: (newValue: string) => void;
  value: string;
}

const TextField = ({
  fullWidth = true,
  setValue,
  ...rest
}: TextFieldProps): JSX.Element => (
  <MaterialUITextField
    fullWidth={fullWidth}
    {...rest}
    onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
      setValue(event.target.value)
    }
  />
);

export default TextField;
