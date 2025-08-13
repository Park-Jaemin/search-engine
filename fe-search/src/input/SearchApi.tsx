import {Customer} from "./SearchResults";

export async function search(query: string): Promise<Customer> {
    return fetch(`http://localhost:8080/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}