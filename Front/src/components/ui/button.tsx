import { cn } from "@/lib/utils";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md focus:ring-2 focus:ring-offset-2 transition-opacity",
          variant === "default" &&
            "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed",
          variant === "outline" &&
            "border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed",
          variant === "destructive" &&
            "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
