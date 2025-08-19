import React, {useEffect, useMemo, useState} from "react";
import {Customer, SearchResults} from "./SearchResults";
import {search} from "./SearchApi";

export interface SearchParams {
    name?: string;
    phone?: string;
    hospitalId?: number;
}

interface SearchSectionProps {
    endPoint: string;
    searchParams: SearchParams;
    currentPage: number;
    onUpdateTotalPages?: (pages: number) => void;
    delay: number;
}

export const SearchSection = ({endPoint, searchParams, currentPage, onUpdateTotalPages, delay}: SearchSectionProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [durationMs, setDurationMs] = useState<number>(0);

    // 검색어 키 생성
    const searchKey = useMemo(
        () => `${searchParams.name ?? ''}|${searchParams.phone ?? ''}|${searchParams.hospitalId ?? ''}`,
        [searchParams.name, searchParams.phone, searchParams.hospitalId]
    );

    // 검색어 변경 시 초기화
    useEffect(() => {
        setCustomers([]);
        setDurationMs(0);
        onUpdateTotalPages?.(0);
    }, [searchKey, endPoint]);

    useEffect(() => {
        if (!searchParams.name && !searchParams.phone) {
            setCustomers([]);
            return;
        }

        const timer = setTimeout(() => {
            if (endPoint === 'db') {
                fetchDb(currentPage);
            } else {
                fetchEl(currentPage);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [currentPage, searchKey, endPoint]);

    const fetchDb = async (page: number) => {
        try {
            const params = new URLSearchParams();
            if (searchParams.name) params.append('name', searchParams.name);
            if (searchParams.phone) params.append('phone', searchParams.phone);
            if (searchParams.hospitalId) params.append('hospitalId', String(searchParams.hospitalId));
            params.append('page', String(page));

            const t0 = performance.now();
            const result: any = await search(params, 'db');
            const t1 = performance.now();

            setDurationMs(Math.floor(t1 - t0));
            setCustomers((result?.contents ?? []) as Customer[]);
        } catch (e) {
            console.error('DB 검색 중 오류:', e);
            setCustomers([]);
        }
    };

    const fetchEl = async (page: number) => {
        try {
            const params = new URLSearchParams();
            if (searchParams.name) params.append('name', searchParams.name);
            if (searchParams.phone) params.append('phone', searchParams.phone);
            if (searchParams.hospitalId) params.append('hospitalId', String(searchParams.hospitalId));
            params.append('page', String(page));

            const t0 = performance.now();
            const result: any = await search(params, 'el');
            const t1 = performance.now();

            setDurationMs(Math.floor(t1 - t0));
            setCustomers((result?.contents ?? []) as Customer[]);

            if (typeof result?.totalPage === 'number') {
                onUpdateTotalPages?.(result.totalPage);
            }
        } catch (e) {
            console.error('EL 검색 중 오류:', e);
            setCustomers([]);
        }
    };

    return (
        <div className="search-container">
            <SearchResults contents={customers} duration={durationMs}/>
        </div>
    );
};
