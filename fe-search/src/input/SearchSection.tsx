import React, {useEffect, useState} from "react";
import {Customer, SearchResults} from "./SearchResults";
import {search} from "./SearchApi";

export interface SearchParams {
    name?: string;
    phone?: string;
}

interface SearchSectionProps {
    endPoint: string;
    searchParams: SearchParams;
    currentPage: number;
    onUpdateTotalPages?: (pages: number) => void;
}

export const SearchSection = ({endPoint, searchParams, currentPage, onUpdateTotalPages}: SearchSectionProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        if (!searchParams.name && !searchParams.phone) {
            setCustomers([]);
            return;
        }

        const debounceTimeout = setTimeout(() => {
            fetchData(currentPage);
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [searchParams, currentPage]);

    const fetchData = async (page: number = 0) => {
        try {
            const params = new URLSearchParams();
            if (searchParams.name) params.append('name', searchParams.name);
            if (searchParams.phone) params.append('phone', searchParams.phone);
            params.append('page', String(page));

            const result = await search(params, page, endPoint);
            setCustomers(result.contents);
            if (endPoint === 'db') {
                onUpdateTotalPages?.(result.totalPage);
            }
        } catch (error) {
            console.error('검색 중 오류 발생:', error);
            setCustomers([]);
        }
    };

    return (
        <div className="search-container">
            <SearchResults contents={customers}/>
        </div>
    );
};

