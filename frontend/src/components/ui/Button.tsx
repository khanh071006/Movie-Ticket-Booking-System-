import type { ButtonHTMLAttributes } from 'react';

type Variant = 'default' | 'outline' | 'ghost' | 'destructive';
type Size = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
}

const variantClasses: Record<Variant, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-500',
    outline: 'border border-white/20 bg-transparent text-white hover:bg-white/10',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    destructive: 'bg-red-600 text-white hover:bg-red-500',
};

const sizeClasses: Record<Size, string> = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-10 px-8',
    icon: 'h-9 w-9',
};

export const Button = ({ className = '', variant = 'default', size = 'default', ...props }: ButtonProps) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    />
);
