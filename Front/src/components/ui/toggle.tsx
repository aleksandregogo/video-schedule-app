import * as React from "react";
import { Toggle as TogglePrimitive } from "@radix-ui/react-toggle";
import { cn } from "@/lib/utils";

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive> & { pressed?: boolean }
>(({ className, pressed, ...props }, ref) => (
  <TogglePrimitive
    ref={ref}
    pressed={pressed}
    className={cn(
      "inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      "bg-primary text-primary-foreground hover:bg-primary/90",
      pressed && "bg-green-500 hover:bg-green-600",
      !pressed && "bg-red-500 hover:bg-red-600",
      className
    )}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.displayName;

export { Toggle };
