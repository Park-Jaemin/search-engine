import React from 'react';
import './Search.css'

interface SearchBoxProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBox({value, onChange}: SearchBoxProps) {
    return (
        <input
            type="search"
            placeholder="검색어를 입력하고 Enter를 누르세요"
            value={value}
            onChange={onChange}
            className="search-input"
        />
    );
}