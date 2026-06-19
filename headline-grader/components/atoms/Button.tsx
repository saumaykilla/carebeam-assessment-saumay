import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

// Using class-variance-authority since it's standard for complex button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap uppercase font-sans font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:pointer-events-none disabled:opacity-50 brutalist-border-thin active:brutalist-shadow-active",
  {
    variants: {
      variant: {
        default: "bg-accent text-ink brutalist-shadow hover:bg-ink hover:text-background",
        secondary: "bg-ink text-background brutalist-shadow hover:bg-accent hover:text-ink",
        ghost: "border-transparent bg-transparent text-ink hover:bg-accent hover:text-ink hover:border-ink brutalist-shadow",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 px-3",
        lg: "h-14 px-8 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin inline-block">/</span> AI IS ANALYZING...
          </span>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
