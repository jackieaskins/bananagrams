import styles from "./Button.module.css";
import cn from "./utils/cn";

type HTMLButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type InterimButtonProps = HTMLButtonProps &
  Required<Pick<HTMLButtonProps, "type" | "children">>;

export interface ButtonProps extends InterimButtonProps {
  fullWidth?: boolean;
}

export default function Button({
  fullWidth = false,
  type,
  ...buttonProps
}: ButtonProps): React.JSX.Element {
  return (
    <button
      className={cn({ [styles.fullWidth]: fullWidth })}
      type={type}
      {...buttonProps}
    />
  );
}
