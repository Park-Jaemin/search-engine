import './App.css';
import React, {useState} from 'react';
import {SearchParams, SearchSection} from "./input/SearchSection";
import {SearchBox} from "./input/SearchBox";
import {Pagination} from "./input/Pagination";

function App() {
    const [inputValue, setInputValue] = useState('');
    const [searchParams, setSearchParams] = useState<SearchParams>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setCurrentPage(0); // 검색어 변경 시 페이지 초기화

        if (/^\d+$/.test(value)) {
            setSearchParams({phone: value});
            return;
        }

        if (value.includes('.')) {
            const [nameParam, phoneParam] = value.split('.');
            setSearchParams({
                name: nameParam.trim(),
                phone: phoneParam.trim()
            });
            return;
        }

        setSearchParams({name: value});
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
                <SearchBox value={inputValue} onChange={handleChange}/>
            </div>
            <div className="results-container">
                <div className="search-section">
                    <h2 className="search-title">DB LIKE 검색</h2>
                    <SearchSection
                        endPoint="db"
                        searchParams={searchParams}
                        currentPage={currentPage}
                        onUpdateTotalPages={updateTotalPages}
                    />
                </div>
                <div className="search-section">
                    <h2 className="search-title">Elastic Search 검색</h2>
                    <SearchSection
                        endPoint="el"
                        searchParams={searchParams}
                        currentPage={currentPage}
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