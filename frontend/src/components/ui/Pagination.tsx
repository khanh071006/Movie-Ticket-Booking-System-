import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    if (endPage - startPage < 4) {
        if (startPage === 0) {
            endPage = Math.min(totalPages - 1, startPage + 4);
        } else if (endPage === totalPages - 1) {
            startPage = Math.max(0, endPage - 4);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center items-center space-x-2 mt-6">
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 0}
                className="px-3 py-1 rounded-md bg-[#252525] text-white disabled:opacity-50 transition hover:bg-[#3A3A3A]"
            >
                Trang trước
            </button>
            
            {startPage > 0 && (
                <>
                    <button onClick={() => onPageChange(0)} className="px-3 py-1 rounded-md bg-[#252525] text-white transition hover:bg-[#3A3A3A]">1</button>
                    {startPage > 1 && <span className="text-gray-400">...</span>}
                </>
            )}

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-md transition ${currentPage === page ? 'bg-blue-600 font-bold text-white' : 'bg-[#252525] text-white hover:bg-[#3A3A3A]'}`}
                >
                    {page + 1}
                </button>
            ))}

            {endPage < totalPages - 1 && (
                <>
                    {endPage < totalPages - 2 && <span className="text-gray-400">...</span>}
                    <button onClick={() => onPageChange(totalPages - 1)} className="px-3 py-1 rounded-md bg-[#252525] text-white transition hover:bg-[#3A3A3A]">{totalPages}</button>
                </>
            )}

            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 rounded-md bg-[#252525] text-white disabled:opacity-50 transition hover:bg-[#3A3A3A]"
            >
                Trang sau
            </button>
        </div>
    );
};
