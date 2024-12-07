import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 font-semibold rounded transition duration-150 focus:outline-none",
        className
      )}
      {...props}
    />
  );
};

export default Button;