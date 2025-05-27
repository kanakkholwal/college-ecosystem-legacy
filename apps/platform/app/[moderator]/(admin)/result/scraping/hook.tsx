import { useEffect, useState } from 'react';

function useSSE<Data>(url: string): {
    data: Data | null;
    error: string | null;
} {
    const [data, setData] = useState<Data | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const eventSource = new EventSource(url);

        // Handle incoming data
        eventSource.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setData(newData);
        };

        // Handle errors
        eventSource.onerror = () => {
            setError('Connection lost. Trying to reconnect...');
            eventSource.close();
        };

        // Cleanup when component unmounts
        return () => eventSource.close();
    }, [url]);

    return { data, error };
}

export default useSSE;