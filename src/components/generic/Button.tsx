import type { MouseEventHandler } from "react";
import "./Button.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}

export function Button({
  disabled,
  children,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={Boolean(disabled)}
    >
      {children}
    </button>
  );
}
