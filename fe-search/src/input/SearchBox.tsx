import React from 'react';

interface SearchBoxProps {
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    searchLabel?: string;
}

export function SearchBox({value = '', onChange, placeholder, searchLabel}: SearchBoxProps) {
    return (
        <div className="search-box-container">
            <label className="search-label">{searchLabel}</label>
            <input
                type="text"
                className="search-box"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete="off"
            />
            <div className="search-hint">
                * 이름.전화번호 형식으로 입력하면 두 조건으로 검색됩니다
            </div>
        </div>
    );
}