export const search = async (params: URLSearchParams, page: number, endpoint: string) => {
    try {
        return await (await fetch(`http://localhost:8080/${endpoint}?${params.toString()}`, {
            method: 'GET',
        })).json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}