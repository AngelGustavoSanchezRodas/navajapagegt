"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Inicializamos el estado con el valor inicial
  // Esto previene discrepancias de hidratación en SSR (Next.js)
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Cargamos desde LocalStorage una vez montado el componente en el cliente
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedValue = JSON.parse(item);
        setTimeout(() => {
          setStoredValue(parsedValue);
        }, 0);
      }
    } catch (error) {
      console.warn(`Error leyendo la clave "${key}" de localStorage:`, error);
    }
  }, [key]);

  // Retornamos un setter envuelto que guarda en localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error guardando la clave "${key}" en localStorage:`, error);
      }
    },
    [key, storedValue]
  );

  // Método para remover la clave del localStorage y reiniciar el estado
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error eliminando la clave "${key}" de localStorage:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
