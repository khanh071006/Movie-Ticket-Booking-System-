import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar } from './AppBar';

interface PublicLayoutProps {
    children?: ReactNode;
    showSearch?: boolean;
    onSearchChange?: (value: string) => void;
}

export const PublicLayout = ({ children, showSearch = true, onSearchChange }: PublicLayoutProps) => (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
        <AppBar showSearch={showSearch} onSearchChange={onSearchChange} />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">{children ?? <Outlet />}</main>
        <footer className="border-t border-white/10 py-6 text-center text-xs text-[#A3A3A3]">
            MOVIE-APP © 2026
        </footer>
    </div>
);
