import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className = '', ...props }: InputProps) => (
    <input
        {...props}
        className={`h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
);
