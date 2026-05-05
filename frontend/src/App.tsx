import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/components/LoginForm';
import { SignupForm } from './features/auth/components/SignupForm';
import { MovieList } from './features/movies/components/MovieList'; // Sửa lại path
import { MovieDetail } from './features/movies/components/MovieDetail'; // Thêm dòng này
import { AdminDashboard } from './features/admin/components/AdminDashboard';
import { ProfilePage } from './features/profile/components/ProfilePage';
import { getStoredToken, hasAdminRole } from './features/auth/utils/session';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const token = getStoredToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
    const token = getStoredToken();
    if (!token || !hasAdminRole(token)) {
        return <Navigate to="/movies" replace />;
    }
    return <>{children}</>;
};

function App() {
    const token = getStoredToken();
    const defaultRoute = token ? (hasAdminRole(token) ? '/admin/dashboard' : '/movies') : '/login';

    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/movies" element={<RequireAuth><MovieList /></RequireAuth>} />
            <Route path="/movies/:id" element={<RequireAuth><MovieDetail /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route
                path="/admin/dashboard"
                element={(
                    <RequireAdmin>
                        <AdminDashboard />
                    </RequireAdmin>
                )}
            />
            {/* Tự động điều hướng về login nếu vào trang chủ mà chưa xử lý logic auth */}
            <Route path="/" element={<Navigate to={defaultRoute} />} />
        </Routes>
    );
}

export default App;
