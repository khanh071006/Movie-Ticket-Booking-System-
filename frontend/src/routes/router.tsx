import { Navigate, createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/PublicLayout';
import { AuthLayout } from '../components/AuthLayout';
import { SuperAdminLayout } from '../components/SuperAdminLayout';
import { ManagerLayout } from '../components/ManagerLayout';
import { StaffLayout } from '../components/StaffLayout';
import { SuperAdminGuard } from '../guards/SuperAdminGuard';
import { ManagerGuard } from '../guards/ManagerGuard';
import { StaffGuard } from '../guards/StaffGuard';
import { GuestGuard } from '../guards/GuestGuard';
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
import { ScanTicketPage } from '../pages/admin/ScanTicketPage';
import { BookingPage } from '../pages/public/BookingPage';
import { ForbiddenPage } from '../pages/error/ForbiddenPage';
import { NotFoundPage } from '../pages/error/NotFoundPage';

import { PaymentReturnPage } from '../pages/public/PaymentReturnPage';

import { ProfilePage } from '../pages/public/ProfilePage';

import { getStoredToken, hasSuperAdminRole, hasManagerRole, hasStaffRole } from '../features/auth/utils/session';

const AdminRedirect = () => {
    const token = getStoredToken();
    if (token) {
        if (hasSuperAdminRole(token)) return <Navigate to="/superadmin" replace />;
        if (hasManagerRole(token)) return <Navigate to="/manager" replace />;
        if (hasStaffRole(token)) return <Navigate to="/staff" replace />;
    }
    return <Navigate to="/login" replace />;
};

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
            { path: 'payment/vnpay-return', element: <PaymentReturnPage /> },
            { path: 'profile', element: <ProfilePage /> },
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
        element: <AdminRedirect />
    },
    {
        path: '/superadmin',
        element: (
            <SuperAdminGuard>
                <SuperAdminLayout />
            </SuperAdminGuard>
        ),
        children: [
            { index: true, element: <DashboardPage /> },
            { path: 'dashboard', element: <Navigate to="/superadmin" replace /> },
            { path: 'accounts', element: <AccountManagementPage /> },
            { path: 'cinemas', element: <CinemaManagementPage /> },
            { path: 'movies', element: <MovieListPage /> },
            { path: 'movies/create', element: <MovieFormPage /> },
            { path: 'movies/:id', element: <MovieFormPage /> },
        ],
    },
    {
        path: '/manager',
        element: (
            <ManagerGuard>
                <ManagerLayout />
            </ManagerGuard>
        ),
        children: [
            { index: true, element: <DashboardPage /> },
            { path: 'dashboard', element: <Navigate to="/manager" replace /> },
            { path: 'accounts', element: <AccountManagementPage /> },
            { path: 'movies', element: <MovieListPage /> },
            { path: 'movies/create', element: <MovieFormPage /> },
            { path: 'movies/:id', element: <MovieFormPage /> },
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
        path: '/staff',
        element: (
            <StaffGuard>
                <StaffLayout />
            </StaffGuard>
        ),
        children: [
            { index: true, element: <Navigate to="/staff/scan-ticket" replace /> },
            { path: 'movies', element: <MovieListPage /> },
            { path: 'rooms', element: <RoomManagementPage /> },
            { path: 'showtimes', element: <ShowtimeManagementPage /> },
            { path: 'scan-ticket', element: <ScanTicketPage /> },
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
