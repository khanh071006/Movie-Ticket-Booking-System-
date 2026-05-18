import type { HTMLAttributes } from 'react';

type DivProps = HTMLAttributes<HTMLDivElement>;

/* Loại bỏ bg-white và border-slate-200 mặc định để class truyền vào từ bên ngoài có tác dụng */
export const Card = ({ className = '', ...props }: DivProps) => (
    <div
        {...props}
        className={`rounded-xl border border-white/5 bg-[#141414] shadow-sm transition-all ${className}`}
    />
);

export const CardContent = ({ className = '', ...props }: DivProps) => (
    <div {...props} className={`p-6 ${className}`} />
);