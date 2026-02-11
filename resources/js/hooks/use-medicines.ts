import { useCallback, useEffect, useRef, useState } from 'react';

export interface Medicine {
    name: string;
    company: string;
    sale_price: number | string;
    pack_size: string;
    mrp: number | string;
}

interface UseMedicinesReturn {
    medicines: Medicine[];
    loading: boolean;
    error: string | null;
    search: (query: string) => void;
    searchQuery: string;
}

export function useMedicines(): UseMedicinesReturn {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchMedicines = useCallback(async (search: string = '') => {
        // Cancel previous request if any
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setLoading(true);
        setError(null);

        try {
            // Use the search endpoint
            const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
            const url = `/medicines/search${searchParam}`;
            const response = await fetch(url, {
                signal: abortController.signal,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch medicines: ${response.status}`);
            }

            const data: Medicine[] = await response.json();
            
            // Only update if request wasn't aborted
            if (!abortController.signal.aborted) {
                setMedicines(data);
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                // Request was cancelled, ignore
                return;
            }
            
            if (!abortController.signal.aborted) {
                setError(err instanceof Error ? err.message : 'Failed to fetch medicines');
                setMedicines([]);
            }
        } finally {
            if (!abortController.signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    const search = useCallback((query: string) => {
        setSearchQuery(query);

        // Clear existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Debounce search requests (300ms delay)
        debounceTimeoutRef.current = setTimeout(() => {
            fetchMedicines(query.trim());
        }, 300);
    }, [fetchMedicines]);

    // Fetch initial data on mount
    useEffect(() => {
        fetchMedicines('');

        return () => {
            // Cleanup: cancel any pending requests
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [fetchMedicines]);

    return {
        medicines,
        loading,
        error,
        search,
        searchQuery,
    };
}
