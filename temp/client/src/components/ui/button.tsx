import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { useAudio } from "@/lib/stores/useAudio"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-95",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        // New variant with gradient background
        gradient: 
          "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg active:shadow active:scale-95",
        // New variant for primary action buttons
        primary: 
          "bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-md hover:shadow-lg active:shadow active:scale-95",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-9 w-9",
      },
      animation: {
        none: "",
        bounce: "transition-transform hover:scale-105 active:scale-95",
        glow: "transition-all hover:shadow-glow",
        pulse: "animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  playSound?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    playSound = true,
    isLoading = false,
    onClick,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : motion.button;
    const audioStore = useAudio();
    
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      // Play click sound if enabled
      if (playSound && audioStore.playClick) {
        audioStore.playClick();
      }
      
      // Call the original onClick handler if provided
      onClick?.(e);
    }, [onClick, playSound, audioStore]);
    
    // Motion animation variants
    const buttonMotionProps = React.useMemo(() => {
      if (asChild) return {};
      
      return {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 17 
        }
      };
    }, [asChild]);
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, animation, className }),
          isLoading && "opacity-70 cursor-not-allowed"
        )}
        ref={ref}
        onClick={handleClick}
        {...buttonMotionProps}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
            {props.children}
          </>
        ) : (
          props.children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
