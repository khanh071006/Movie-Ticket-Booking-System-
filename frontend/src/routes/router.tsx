import { Navigate, createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/PublicLayout';
import { AuthLayout } from '../components/AuthLayout';
import { AdminLayout } from '../components/AdminLayout';
import { GuestGuard } from '../guards/GuestGuard';
import { AdminGuard } from '../guards/AdminGuard';
import { HomePage } from '../pages/public/HomePage';
import { MoviesPage } from '../pages/public/MoviesPage';
import { ShowtimesPage } from '../pages/public/ShowtimesPage';
import { MovieDetailPage } from '../pages/public/MovieDetailPage';
import { SelectShowtimePage } from '../pages/public/SelectShowtimePage';
import { CinemasPage } from '../pages/public/CinemasPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { AccountManagementPage } from '../pages/admin/AccountManagementPage';
import { MovieListPage } from '../pages/admin/movies/MovieListPage';
import { MovieFormPage } from '../pages/admin/movies/MovieFormPage';
import { CinemaManagementPage } from '../pages/admin/CinemaManagementPage';
import { RoomManagementPage } from '../pages/admin/RoomManagementPage';
import { ShowtimeManagementPage } from '../pages/admin/ShowtimeManagementPage';
import { CategoryManagementPage } from '../pages/admin/CategoryManagementPage';
import { SeatTypeManagementPage } from '../pages/admin/SeatTypeManagementPage';
import { TicketTypeManagementPage } from '../pages/admin/TicketTypeManagementPage';
import { SnackManagementPage } from '../pages/admin/SnackManagementPage';
import { RoomSeatConfigPage } from '../pages/admin/RoomSeatConfigPage';
import { BookingPage } from '../pages/public/BookingPage';
import { ForbiddenPage } from '../pages/error/ForbiddenPage';
import { NotFoundPage } from '../pages/error/NotFoundPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'movies', element: <MoviesPage /> },
            { path: 'showtimes', element: <ShowtimesPage /> },
            { path: 'movies/:id', element: <MovieDetailPage /> },
            { path: 'movies/:id/booking', element: <SelectShowtimePage /> },
            { path: 'cinemas', element: <CinemasPage /> },
            { path: 'booking/:showtimeId', element: <BookingPage /> },
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
            { path: 'movies', element: <MovieListPage /> },
            { path: 'movies/create', element: <MovieFormPage /> },
            { path: 'movies/:id', element: <MovieFormPage /> },
            { path: 'cinemas', element: <CinemaManagementPage /> },
            { path: 'rooms', element: <RoomManagementPage /> },
            { path: 'rooms/:id/seats', element: <RoomSeatConfigPage /> },
            { path: 'showtimes', element: <ShowtimeManagementPage /> },
            { path: 'categories', element: <CategoryManagementPage /> },
            { path: 'seat-types', element: <SeatTypeManagementPage /> },
            { path: 'ticket-types', element: <TicketTypeManagementPage /> },
            { path: 'snacks', element: <SnackManagementPage /> },
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
