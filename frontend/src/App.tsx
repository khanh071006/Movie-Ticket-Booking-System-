import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/components/LoginForm';
import { SignupForm } from './features/auth/components/SignupForm';
import { MovieList } from './features/movies/components/MovieList';
import { MovieDetail } from './features/movies/components/MovieDetail';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
