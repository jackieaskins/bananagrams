import { useFieldErrorMessage } from "./FormContext";
import styles from "./InputField.module.css";

type HTMLInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type InterimInputProps = HTMLInputProps &
  Required<Pick<HTMLInputProps, "id" | "name">>;

export interface InputFieldProps extends InterimInputProps {
  label: React.ReactNode;
}

export default function InputField({
  label,
  ...inputProps
}: InputFieldProps): React.JSX.Element {
  const { id, name } = inputProps;
  const fieldErrorMessage = useFieldErrorMessage(name);

  return (
    <div className={styles.formField}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <input {...inputProps} />

      {fieldErrorMessage && <div>{fieldErrorMessage}</div>}
    </div>
  );
}
