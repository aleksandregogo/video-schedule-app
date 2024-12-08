import { cn } from "@/lib/utils"; // Ensure this points to your utility
import React from "react";

const Button = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & { variant?: string }
>(({ className, variant = "default", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      variant === "destructive" && "bg-red-500 text-white hover:bg-red-600",
      variant === "default" && "bg-blue-500 text-white hover:bg-blue-600",
      className
    )}
    {...props}
  />
));

Button.displayName = "Button";

export { Button };