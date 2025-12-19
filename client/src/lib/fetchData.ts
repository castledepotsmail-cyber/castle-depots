export async function fetchServerData(endpoint: string, options: RequestInit = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://castle-depots.onrender.com/api';
    const url = `${baseUrl}${endpoint}`;

    try {
        const res = await fetch(url, {
            ...options,
            next: options.next || { revalidate: 60 } // Revalidate every 60 seconds by default
        });

        if (!res.ok) {
            console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
            return null;
        }

        return res.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}
