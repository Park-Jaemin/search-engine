import './App.css';
import React, {useState} from 'react';
import {SearchParams, SearchSection} from "./input/SearchSection";
import {SearchBox} from "./input/SearchBox";
import {Pagination} from "./input/Pagination";

function App() {
    // 기존 단일 입력 → 3개 입력으로 분리
    const [nameInput, setNameInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');
    const [hospitalIdInput, setHospitalIdInput] = useState('');

    const [searchParams, setSearchParams] = useState<SearchParams>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 각각 변경 시 SearchParams 구성
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ?? '';
        setNameInput(value);
        setCurrentPage(0);
        setSearchParams(prev => {
            const next: SearchParams = {...prev};
            if (value.trim().length > 0) next.name = value.trim(); else delete (next as any).name;
            return next;
        });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ?? '';
        setPhoneInput(value);
        setCurrentPage(0);
        setSearchParams(prev => {
            const next: SearchParams = {...prev};
            if (value.trim().length > 0) next.phone = value.trim(); else delete (next as any).phone;
            return next;
        });
    };

    const handleHospitalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ?? '';
        setHospitalIdInput(value);
        setCurrentPage(0);
        setSearchParams(prev => {
            const next: SearchParams = {...prev};
            const num = Number(value);
            if (value.trim().length > 0 && !Number.isNaN(num)) {
                // SearchParams에 hospitalId 필드가 정의되어 있어야 합니다.
                (next as any).hospitalId = num;
            } else {
                delete (next as any).hospitalId;
            }
            return next;
        });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const updateTotalPages = (pages: number) => {
        setTotalPages(pages);
    };

    return (
        <div className="app-container">
            <div className="search-box-wrapper">
                <div className="search-box-wrapper">
                    <div className="search-box-container">
                        <SearchBox value={nameInput} onChange={handleNameChange} placeholder="이름(부분 일치)"
                                   searchLabel="이름"/>
                    </div>
                    <div className="search-box-container">
                        <SearchBox value={phoneInput} onChange={handlePhoneChange} placeholder="휴대폰번호(끝자리)"
                                   searchLabel="휴대폰번호"/>
                    </div>
                    <div className="search-box-container">
                        <SearchBox value={hospitalIdInput} onChange={handleHospitalIdChange} placeholder="병원 ID(숫자)"
                                   searchLabel="병원 ID"/>
                    </div>
                </div>

            </div>
            <div className="results-container">
                <div className="search-section">
                    <h2 className="search-title">DB LIKE 검색</h2>
                    <SearchSection
                        endPoint="db"
                        searchParams={searchParams}
                        currentPage={currentPage}
                        delay={500}
                    />
                </div>
                <div className="search-section">
                    <h2 className="search-title">Elastic Search 검색</h2>
                    <SearchSection
                        endPoint="el"
                        searchParams={searchParams}
                        currentPage={currentPage}
                        onUpdateTotalPages={updateTotalPages}
                        delay={100}
                    />
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default App;