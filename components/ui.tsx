

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export type BorderVariant = 'default' | 'electric' | 'cyan' | 'indigo';

export interface CardProps extends Omit<React.ComponentProps<typeof motion.div>, 'children'> {
  children?: React.ReactNode;
  borderVariant?: BorderVariant;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', borderVariant = 'default', ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const useCombinedRef = (ref: React.Ref<HTMLDivElement>) => {
        React.useImperativeHandle(ref, () => internalRef.current!, []);
        return internalRef;
    };
    const combinedRef = useCombinedRef(ref);

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!combinedRef.current) return;
      const rect = combinedRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      combinedRef.current.style.setProperty('--mouse-x', `${x}px`);
      combinedRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const borderGradients: Record<BorderVariant, string> = {
        default: 'linear-gradient(-45deg, #38bdf8, #6366f1, #a5b4fc, #38bdf8)',
        electric: 'linear-gradient(-45deg, #60a5fa, #2563eb, #3b82f6, #60a5fa)',
        cyan: 'linear-gradient(-45deg, #67e8f9, #0891b2, #06b6d4, #67e8f9)',
        indigo: 'linear-gradient(-45deg, #818cf8, #4f46e5, #6366f1, #818cf8)',
    };
    
    const borderColors: Record<BorderVariant, string> = {
        default: 'border-calm-blue-400',
        electric: 'border-blue-500',
        cyan: 'border-cyan-400',
        indigo: 'border-calm-indigo-400',
    };
    
    return (
      <motion.div
        {...props}
        ref={combinedRef}
        onMouseMove={onMouseMove}
        className={`
          group relative bg-calm-indigo-950/50 backdrop-blur-2xl rounded-2xl 
          shadow-2xl overflow-hidden shadow-black/40
          transition-shadow duration-300 hover:shadow-calm-blue-500/20
          border ${borderColors[borderVariant]}
          ${className}
        `}
      >
        {/* Spotlight Effect */}
        <div 
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-75"
            style={{
                background: `radial-gradient(
                    600px circle at var(--mouse-x) var(--mouse-y),
                    rgba(165, 180, 252, 0.1),
                    transparent 80%
                )`
            }}
        />
        {/* Shimmering Border */}
        <div
            className="absolute -inset-px rounded-2xl opacity-100"
            style={{
                background: borderGradients[borderVariant],
                backgroundSize: '400% 400%',
                animation: 'aurora-bg 8s ease infinite',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
            }}
        />

        <div className="relative z-10">
            {children}
        </div>
      </motion.div>
    );
  }
);


// Define the component's specific props
interface ButtonOwnProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

// Use a generic to define the props for the polymorphic component
type PolymorphicButtonProps<C extends React.ElementType> = ButtonOwnProps &
  Omit<React.ComponentPropsWithRef<C>, keyof ButtonOwnProps> & {
    as?: C;
  };

// The actual component logic, wrapped to allow forwardRef
const ButtonImpl = <C extends React.ElementType = 'button'>(
  { as, children, variant = 'primary', className = '', disabled, ...props }: PolymorphicButtonProps<C>,
  ref: React.ComponentPropsWithRef<C>['ref']
) => {
  const Component = as || 'button';
  const MotionComponent = motion(Component as React.ElementType);

  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-calm-indigo-950 focus:ring-calm-blue-400 inline-flex items-center justify-center gap-2';
    
  const variantClasses = {
    primary: 'bg-gradient-to-r from-calm-indigo-500 to-calm-blue-500 text-white hover:from-calm-indigo-600 hover:to-calm-blue-600 shadow-lg shadow-calm-indigo-500/20 hover:shadow-calm-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]',
    secondary: 'bg-calm-blue-400 text-white hover:bg-calm-blue-500 shadow-md hover:shadow-lg',
    ghost: 'bg-transparent text-calm-blue-300 hover:bg-calm-indigo-800/50',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const componentProps = {
    ...props,
    ref,
  } as { [key: string]: any };

  if (Component === 'button') {
    componentProps.disabled = disabled;
  } else if (disabled) {
    componentProps['aria-disabled'] = true;
    const existingOnClick = (props as any).onClick;
    componentProps.onClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (existingOnClick) {
          existingOnClick(e);
      }
    };
  }

  const handleTouchStart = () => {
    if (!disabled && navigator.vibrate) {
        navigator.vibrate(10);
    }
  };

  return (
    <MotionComponent
      ref={ref}
      onTouchStart={handleTouchStart}
      whileHover={!disabled ? { scale: 1.03, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98, y: 0 } : {}}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...componentProps}
    >
      {children}
    </MotionComponent>
  );
};

// Forward the ref and cast the component to preserve generics, which is a common pattern for polymorphic components.
export const Button = React.forwardRef(ButtonImpl) as <C extends React.ElementType = 'button'>(
  props: PolymorphicButtonProps<C>
) => React.ReactElement;