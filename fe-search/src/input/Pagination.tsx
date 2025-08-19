import React, {useEffect, useState} from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({currentPage, totalPages, onPageChange}: PaginationProps) {
    const [pageInput, setPageInput] = useState<string>(String(currentPage + 1));

    // currentPage 변경 시 입력창과 동기화
    useEffect(() => {
        setPageInput(String(currentPage + 1));
    }, [currentPage]);

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    const handleJump = () => {
        if (!totalPages || totalPages < 1) return;

        const parsed = parseInt(pageInput, 10);
        if (isNaN(parsed)) {
            // 비어있거나 숫자가 아니면 현재 페이지로 복구
            setPageInput(String(currentPage + 1));
            return;
        }
        const clamped = clamp(parsed, 1, totalPages);
        setPageInput(String(clamped)); // 표시값 클램프 반영
        const zeroBased = clamped - 1;
        if (zeroBased !== currentPage) {
            onPageChange(zeroBased);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 숫자만 허용
        const next = e.target.value.replace(/[^\d]/g, '');
        setPageInput(next);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleJump();
        }
    };

    const handleInputBlur = () => {
        // 포커스 아웃 시 비어있으면 현재 페이지로 복구
        if (pageInput.trim() === '') {
            setPageInput(String(currentPage + 1));
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers: number[] = [];
        const displayPage = currentPage + 1; // FE 표시용 페이지 번호

        for (let i = displayPage - 2; i <= displayPage + 2; i++) {
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
                    aria-label="첫 페이지"
                    title="첫 페이지"
                >
                    «
                </button>
                <button
                    className="page-nav"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    aria-label="이전 페이지"
                    title="이전 페이지"
                >
                    ‹
                </button>
                {pageNumbers.map(num => (
                    <button
                        key={num}
                        className={`page-number ${displayPage === num ? 'active' : ''}`}
                        onClick={() => onPageChange(num - 1)}
                        aria-current={displayPage === num ? 'page' : undefined}
                    >
                        {num}
                    </button>
                ))}
                <button
                    className="page-nav"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1 || totalPages === 0}
                    aria-label="다음 페이지"
                    title="다음 페이지"
                >
                    ›
                </button>
                <button
                    className="page-nav"
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={currentPage === totalPages - 1 || totalPages === 0}
                    aria-label="마지막 페이지"
                    title="마지막 페이지"
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

                {/* 페이지 점프 입력 영역 */}
                <div className="page-jump"
                     style={{display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 12}}>
                    <label htmlFor="pageJumpInput" style={{fontSize: 12, color: '#666'}}>페이지 이동</label>
                    <input
                        id="pageJumpInput"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={pageInput}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onBlur={handleInputBlur}
                        placeholder={totalPages > 0 ? `1~${totalPages}` : '0'}
                        style={{
                            width: 64,
                            padding: '6px 8px',
                            border: '1px solid #ccc',
                            borderRadius: 4
                        }}
                        disabled={totalPages === 0}
                        aria-label="페이지 번호 입력"
                    />
                    <button
                        className="page-nav"
                        onClick={handleJump}
                        disabled={totalPages === 0}
                        style={{padding: '6px 10px'}}
                        aria-label="입력한 페이지로 이동"
                    >
                        이동
                    </button>
                </div>
            </div>
            {totalPages > 0 && (
                <div className="pagination-info" style={{marginTop: 6, fontSize: 12, color: '#666'}}>
                    총 {totalPages} 페이지
                </div>
            )}
        </div>
    );
}
