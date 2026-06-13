import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define qué estará disponible para toda la app
interface FavoritesContextType {
  favorites: string[];                    // IDs guardados: ['1', '3']
  toggleFavorite: (id: string) => void;   // agrega o quita un favorito
  isFavorite: (id: string) => boolean;    // true/false si es favorito
}

// Canal vacío, el Provider lo llenará con datos reales
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  
  // Lista de IDs en memoria, empieza vacía
  const [favorites, setFavorites] = useState<string[]>([]);

  // Al abrir la app: carga los favoritos guardados en el dispositivo
  useEffect(() => {
    AsyncStorage.getItem('tastego_favs').then((d) => {
      if (d) setFavorites(JSON.parse(d)); // texto → array ['1','3']
    });
  }, []); // [] = solo se ejecuta una vez al inicio

  // Toca ❤️ → si ya existe lo quita, si no existe lo agrega
  // Luego guarda el resultado en el dispositivo
  const toggleFavorite = async (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)  // quita
      : [...favorites, id];                 // agrega
    setFavorites(updated);                  // actualiza memoria
    await AsyncStorage.setItem('tastego_favs', JSON.stringify(updated)); // guarda
  };

  // Consulta si un ID está en la lista → muestra ❤️ o 🤍
  const isFavorite = (id: string) => favorites.includes(id);

  // Pone todo disponible para cualquier pantalla
  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Gancho que cualquier pantalla usa para acceder al contexto
// Ejemplo: const { isFavorite, toggleFavorite } = useFavorites();
export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites fuera de FavoritesProvider');
  return ctx;
};