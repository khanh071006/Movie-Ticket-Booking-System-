import { Navigate, createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/PublicLayout';
import { AuthLayout } from '../components/AuthLayout';
import { AdminLayout } from '../components/AdminLayout';
import { GuestGuard } from '../guards/GuestGuard';
import { AdminGuard } from '../guards/AdminGuard';
import { HomePage } from '../pages/public/HomePage';
import { MoviesPage } from '../pages/public/MoviesPage';
import { MovieDetailPage } from '../pages/public/MovieDetailPage';
import { CinemasPage } from '../pages/public/CinemasPage';
import { PromotionsPage } from '../pages/public/PromotionsPage';
import { BookingPage } from '../pages/public/BookingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { AccountManagementPage } from '../pages/admin/AccountManagementPage';
import { MovieManagementPage } from '../pages/admin/MovieManagementPage';
import { CinemaManagementPage } from '../pages/admin/CinemaManagementPage';
import { RoomManagementPage } from '../pages/admin/RoomManagementPage';
import { ShowtimeManagementPage } from '../pages/admin/ShowtimeManagementPage';
import { CategoryManagementPage } from '../pages/admin/CategoryManagementPage';
import { ForbiddenPage } from '../pages/error/ForbiddenPage';
import { NotFoundPage } from '../pages/error/NotFoundPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'movies', element: <MoviesPage /> },
            { path: 'movies/:id', element: <MovieDetailPage /> },
            { path: 'cinemas', element: <CinemasPage /> },
            { path: 'promotions', element: <PromotionsPage /> },
            { path: 'booking/:movieId/:showtimeId', element: <BookingPage /> },
        ],
    },
    {
        path: '/',
        element: (
            <GuestGuard>
                <AuthLayout />
            </GuestGuard>
        ),
        children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'signup', element: <Navigate to="/register" replace /> },
        ],
    },
    {
        path: '/admin',
        element: (
            <AdminGuard>
                <AdminLayout />
            </AdminGuard>
        ),
        children: [
            { index: true, element: <DashboardPage /> },
            { path: 'dashboard', element: <Navigate to="/admin" replace /> },
            { path: 'accounts', element: <AccountManagementPage /> },
            { path: 'movies', element: <MovieManagementPage /> },
            { path: 'cinemas', element: <CinemaManagementPage /> },
            { path: 'rooms', element: <RoomManagementPage /> },
            { path: 'showtimes', element: <ShowtimeManagementPage /> },
            { path: 'categories', element: <CategoryManagementPage /> },
        ],
    },
    {
        path: '/403',
        element: <ForbiddenPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);
