import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-4 text-center text-white">
        <p className="text-7xl font-black text-[#E50914]">404</p>
        <h1 className="mt-2 text-2xl font-bold">Không tìm thấy trang</h1>
        <p className="mt-2 text-[#A3A3A3]">Đường dẫn bạn truy cập không tồn tại.</p>
        <Link to="/" className="mt-6 rounded-xl bg-[#E50914] px-5 py-3 font-semibold text-white hover:bg-[#c50711]">
            Quay về trang chủ
        </Link>
    </div>
);
