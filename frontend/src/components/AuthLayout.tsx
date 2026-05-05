import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = ({ children }: { children?: ReactNode }) => (
    <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-[2px]"></div>
        <div className="relative flex min-h-screen items-center justify-center p-4">{children ?? <Outlet />}</div>
    </div>
);
