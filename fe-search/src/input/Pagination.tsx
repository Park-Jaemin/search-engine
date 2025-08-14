interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({currentPage, totalPages, onPageChange}: PaginationProps) {
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const displayPage = currentPage + 1; // FE 표시용 페이지 번호

        // 1부터 시작하는 페이지 번호로 표시
        for (let i = displayPage - 1; i <= displayPage + 1; i++) {
            if (i > 0 && i <= totalPages) {
                pageNumbers.push(i);
            }
        }

        return (
            <>
                <button
                    className="page-nav"
                    onClick={() => onPageChange(0)}
                    disabled={currentPage === 0}
                >
                    «
                </button>
                <button
                    className="page-nav"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    ‹
                </button>
                {pageNumbers.map(num => (
                    <button
                        key={num}
                        className={`page-number ${displayPage === num ? 'active' : ''}`}
                        onClick={() => onPageChange(num - 1)} // BE로 보낼 때는 0부터 시작하는 인덱스로 변환
                    >
                        {num}
                    </button>
                ))}
                <button
                    className="page-nav"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    ›
                </button>
                <button
                    className="page-nav"
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    »
                </button>
            </>
        );
    };

    return (
        <div className="pagination-container">
            <div className="pagination">
                {renderPageNumbers()}
            </div>
        </div>
    );
}
