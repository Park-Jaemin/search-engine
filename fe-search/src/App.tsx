import './App.css';
import React, {useEffect, useState} from 'react';
import {SearchBox} from "./input/SearchBox";
import {Customer, SearchResults} from "./input/SearchResults";
import {search} from "./input/SearchApi";


function App() {
    const [query, setQuery] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setCustomers([]);
            return;
        }

        const fetchData = async () => {
            setSearching(true);
            try {
                const result = await search(query);
                // result가 JSON 객체라고 가정
                // name 필드를 꺼내 배열 형태로 변환
                setCustomers([{name: result.name}]);
            } catch (error) {
                console.error('검색 중 오류 발생:', error);
                setCustomers([]);
            } finally {
                setSearching(false);
            }
        };

        const debounceTimeout = setTimeout(() => {
            fetchData();
        }, 500); // 타이핑 후 500ms 후에 검색 실행

        return () => clearTimeout(debounceTimeout);
    }, [query]);


    return (
        <div className="search-container">
            <SearchBox value={query} onChange={(e) => setQuery(e.target.value)}/>
            <SearchResults customers={customers} searching={searching}/>
        </div>
    );
}

export default App;