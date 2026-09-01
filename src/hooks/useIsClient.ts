'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the component is mounted on the client
 * Useful for avoiding hydration mismatch errors
 */
export const useIsClient = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
};
