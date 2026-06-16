import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RippleButtonProps {
  variant?: 'primary' | 'secondary' | 'collector' | 'acb' | 'company' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 glow-primary',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  collector: 'bg-collector text-primary-foreground hover:bg-collector/90 glow-collector',
  acb: 'bg-acb text-primary-foreground hover:bg-acb/90 glow-acb',
  company: 'bg-company text-primary-foreground hover:bg-company/90 glow-company',
  ghost: 'bg-transparent text-foreground hover:bg-secondary/50',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const RippleButton: React.FC<RippleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  onClick,
  disabled,
  type = 'button',
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples((prev) => [...prev, { x, y, id }]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }
    
    onClick?.();
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative overflow-hidden rounded-lg font-semibold transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}
      {children}
    </motion.button>
  );
};
