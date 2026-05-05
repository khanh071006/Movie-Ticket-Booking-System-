import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/components/LoginForm';
import { SignupForm } from './features/auth/components/SignupForm';
import { MovieList } from './features/movies/components/MovieList'; // Sửa lại path
import { MovieDetail } from './features/movies/components/MovieDetail'; // Thêm dòng này

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            {/* Tự động điều hướng về login nếu vào trang chủ mà chưa xử lý logic auth */}
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;