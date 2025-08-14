import './Search.css';
import {Pagination} from "./Pagination";

interface Customer {
    name: string;
    phone: string;
}

interface SearchResultsProps {
    contents: Customer[];
}

export function SearchResults({contents}: SearchResultsProps) {
    return (
        <div className="search-results-container">
            <div className="search-content">
                {contents.length === 0 ? (
                    <div className="empty-results">
                        검색 결과가 없습니다
                    </div>
                ) : (
                    <ul className="results-list">
                        {contents.map((item, index) => (
                            <li key={index} className="result-item">
                                <div className="patient-info">
                                    <div className="patient-main-info">
                                        <span className="patient-name">{item.name}</span>
                                        <span className="patient-phone">
                                            <span className="info-icon">📞</span>
                                            {item.phone}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export type {Customer, SearchResultsProps};