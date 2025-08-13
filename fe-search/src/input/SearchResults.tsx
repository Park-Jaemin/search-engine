interface Customer {
    name: string;
}

interface SearchResultsProps {
    customers: Customer[];
    searching: boolean;
}

export function SearchResults({customers, searching}: SearchResultsProps) {
    return (
        <article aria-busy={searching}>
            {searching ? (
                "잠시만 기다려주세요. 고객을 검색하고 있습니다."
            ) : (
                <>
                    <header>총 {customers.length}개의 고객이 검색되었습니다.</header>
                    <ul>
                        {customers.map(({name}, index) => (
                            <li key={index}>
                                {name}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </article>
    );
}

export type {Customer};