import { useState, useEffect } from 'react';

/**
 * Hook para manejar la hidratación del lado del cliente
 * Evita errores de hidratación al asegurar que el componente esté montado
 */
export function useClientSide() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted;
}

/**
 * Hook para manejar localStorage de manera segura
 * Evita errores durante SSR
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
    }, [key, mounted]);

    const setValue = (value: T | ((val: T) => T)) => {
        if (!mounted) return;

        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue] as const;
} 