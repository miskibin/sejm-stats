import React from 'react';
import { cn } from "@/lib/utils";

type SpinnerSize = 'small' | 'default' | 'large';
type SpinnerVariant = 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  variant?: SpinnerVariant;
}

const sizeClasses: Record<SpinnerSize, string> = {
  small: 'w-8 h-8',
  default: 'w-12 h-12',
  large: 'w-16 h-16',
};

const variantClasses: Record<SpinnerVariant, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted',
  accent: 'text-accent',
  destructive: 'text-destructive',
};

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'default', 
  className, 
  variant = 'primary' 
}) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 rounded-full border-4 border-transparent",
              variantClasses[variant],
              {
                'animate-spin': index === 0,
                'animate-spin-slow': index === 1,
                'animate-pulse': index === 2,
              }
            )}
            style={{
              borderTopColor: 'currentColor',
              animationDelay: `${index * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Spinner;