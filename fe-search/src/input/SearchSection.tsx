import React, {useEffect, useMemo, useState} from "react";
import {Customer, SearchResults} from "./SearchResults";
import {search} from "./SearchApi";

export interface SearchParams {
    name?: string;
    phone?: string;
    cursor?: string | null;
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

    // 페이지별 cursor 캐시: page 인덱스 -> 해당 페이지 요청 시 전송할 cursor
    const [cursorByPage, setCursorByPage] = useState<Record<number, string | null>>({0: null});

    // 검색어 키 생성
    const searchKey = useMemo(
        () => `${searchParams.name ?? ''}|${searchParams.phone ?? ''}`,
        [searchParams.name, searchParams.phone]
    );

    // 검색어 변경 시 초기화
    useEffect(() => {
        setCustomers([]);
        setDurationMs(0);
        setCursorByPage({0: null});
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
            params.append('page', String(page));

            const t0 = performance.now();
            const result: any = await search(params, 'db');
            const t1 = performance.now();

            setDurationMs(Math.floor(t1 - t0));
            setCustomers((result?.contents ?? []) as Customer[]);
            if (typeof result?.totalPage === 'number') {
                onUpdateTotalPages?.(result.totalPage);
            }
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

            // 페이지 변경 시에만 cursor 전송: 0페이지는 전송하지 않음
            const cursor = cursorByPage[page] ?? null;
            if (cursor) {
                params.append('cursor', cursor);
                params.append('cursor2', cursor);
            }

            const t0 = performance.now();
            const result: any = await search(params, 'el');
            const t1 = performance.now();

            setDurationMs(Math.floor(t1 - t0));
            setCustomers((result?.contents ?? []) as Customer[]);

            // 서버가 내려준 다음 페이지용 cursor를 캐시에 저장
            // 다음 페이지가 있을 때만 저장
            if (result?.cursor) {
                setCursorByPage(prev => ({...prev, [page + 1]: String(result.cursor)}));
            } else {
                // 다음 페이지가 없으면 이후 커서는 유지/무시(선택)
                setCursorByPage(prev => ({...prev}));
            }

            // 서버가 totalPage를 내려주면 반영 (선택)
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
