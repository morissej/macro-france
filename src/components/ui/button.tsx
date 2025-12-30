import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
    primary: "bg-primary text-white hover:bg-opacity-90 active:scale-95",
    secondary: "bg-secondary text-white hover:bg-opacity-90 active:scale-95",
    outline: "border-2 border-primary text-primary hover:bg-primary/5 active:scale-95",
    ghost: "text-primary hover:bg-primary/5 hover:text-primary active:scale-95",
    link: "text-primary underline-offset-4 hover:underline",
};

const buttonSizes = {
    sm: "h-9 px-3 text-xs  rounded-[14px]",
    md: "h-11 px-8 text-sm  rounded-[14px]",
    lg: "h-14 px-8 text-base rounded-[14px]",
    icon: "h-10 w-10",
};

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonVariants;
    size?: keyof typeof buttonSizes;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    buttonVariants[variant],
                    buttonSizes[size],
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
