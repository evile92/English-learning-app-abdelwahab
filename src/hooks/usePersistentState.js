// src/hooks/usePersistentState.js

import { useState, useEffect } from 'react';

// Custom Hook for persistent state
export function usePersistentState(key, defaultValue) {
    const [state, setState] = useState(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            if (storedValue !== null) {
                return JSON.parse(storedValue);
            }
            return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [key, state]);

    return [state, setState];
}
