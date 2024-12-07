// src/components/ui/menu.tsx
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

// Props for Menu and MenuItem
interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {}
interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

// Menu Component
export const Menu = forwardRef<HTMLDivElement, MenuProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute z-50 w-56 rounded-md shadow-md bg-white dark:bg-gray-800",
      className
    )}
    {...props}
  />
));
Menu.displayName = "Menu";

// MenuItem Component
export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700",
      className
    )}
    {...props}
  />
));
MenuItem.displayName = "MenuItem";
