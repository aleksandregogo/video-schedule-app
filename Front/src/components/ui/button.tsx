import { cn } from "@/lib/utils";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md focus:ring-2 focus:ring-offset-2",
          variant === "default" && "bg-blue-500 text-white hover:bg-blue-600",
          variant === "outline" &&
            "border border-gray-300 text-gray-700 hover:bg-gray-100",
          variant === "destructive" &&
            "bg-red-500 text-white hover:bg-red-600",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
