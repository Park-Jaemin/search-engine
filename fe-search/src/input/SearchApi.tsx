export const search = async (params: URLSearchParams, endpoint: string) => {
    try {
        return await (await fetch(`http://localhost:8080/${endpoint}?${params.toString()}&sort=name,phone`, {
            method: 'GET',
        })).json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}