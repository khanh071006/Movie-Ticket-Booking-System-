import type { HTMLAttributes } from 'react';

type DivProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ className = '', ...props }: DivProps) => (
    <div {...props} className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`} />
);

export const CardContent = ({ className = '', ...props }: DivProps) => <div {...props} className={`p-6 ${className}`} />;
