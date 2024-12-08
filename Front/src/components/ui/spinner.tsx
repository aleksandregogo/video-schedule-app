import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "h-20 w-20 flex items-center justify-center",
  {
    variants: {
      variant: {
        default:
          "relative h-20 w-20",
        fullsize:
          "fixed top-[50%] left-[50%] h-24 w-24"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, variant, ...props }: SpinnerProps) {
  return (
    <div className={cn(spinnerVariants({ variant }), className)} {...props}>
      <span
        className="animate-spin rounded-full absolute left-0 right-0 w-full h-full"
        style={{ background: 'conic-gradient(from 90deg at 50% 50%, rgba(255, 255, 255, 0) 0deg, #4F29EC 228.6deg, #4F29EC 360deg)', }}
      />
      <span className="relative w-16 h-16 bg-white rounded-full left-0 top-0" />
    </div>
  )
}


export { Spinner, spinnerVariants }
