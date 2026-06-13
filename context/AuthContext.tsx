import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  name: string;
  email: string;
  birthdate: string;
  phone: string;
  foodPreference: string;
  password: string;
} //Define exactamente cómo debe verse un usuario. 

interface AuthContextType {
  user: User | null;   // el usuario actual (o null si no hay sesión)
  isLoading: boolean; // true mientras carga AsyncStorage
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: User) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const USERS_KEY = 'tastego_users';      // lista de todos los usuarios registrados
const SESSION_KEY = 'tastego_session';  // email del usuario con sesión activa

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // user empieza en null
  const [isLoading, setIsLoading] = useState(true); // esta verificando si hay sesion guardada

  // Al iniciar la app, restaurar sesión activa
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      // Paso 1: busca el email de la sesión guardada
      const sessionEmail = await AsyncStorage.getItem(SESSION_KEY);
      if (sessionEmail) {
        // Paso 2: carga la lista de todos los usuarios
        const usersRaw = await AsyncStorage.getItem(USERS_KEY);
        const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
        // Paso 3: busca el usuario que corresponde al email
        const found = users.find((u) => u.email === sessionEmail);
       // Paso 4: si lo encuentra, restaura la sesión 
        if (found) setUser(found);
      }
    } catch (e) {
      console.error('Error restaurando sesión:', e);
    } finally {
      // Paso 5: sin importar qué pasó, termina la carga
      setIsLoading(false);
    }
  };

  // Obtener todos los usuarios registrados
  const getUsers = async (): Promise<User[]> => {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];             
  };  // Lee la lista de usuarios de AsyncStorage. Como AsyncStorage solo 
  // guarda texto, usa JSON.parse para convertir el texto en un array de objetos JavaScript.

  // Guardar lista de usuarios
  const saveUsers = async (users: User[]) => {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }; // Guarda la lista. JSON.stringify convierte el array de objetos en texto para poder guardarlo.

  // - REGISTRO: verifica que el email no exista y guarda el usuario -
  const register = async (userData: User): Promise<{ success: boolean; error?: string }> => {
    try {
      // Paso 1: cargar usuarios existentes
      const users = await getUsers();
      // Paso 2: verificar que el email no esté tomado
      const exists = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
      if (exists) {
        return { success: false, error: 'Ya existe una cuenta con este correo electrónico.' };
      }
      // Paso 3: agregar el nuevo usuario a la lista
      const newUsers = [...users, userData];
      await saveUsers(newUsers);
      // Iniciar sesión automáticamente tras registrarse
      await AsyncStorage.setItem(SESSION_KEY, userData.email);
      setUser(userData);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Error al crear la cuenta. Intenta de nuevo.' };
    }
  };

  // LOGIN: verifica email y contraseña contra los usuarios guardados
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = await getUsers();

       // Busca usuario que coincida en email Y contraseña
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        // Distinguir si el email existe pero la contraseña es incorrecta
        const emailExists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
          return { success: false, error: 'Contraseña incorrecta. Intenta de nuevo.' };
        }
        return { success: false, error: 'No existe una cuenta con este correo. ¿Quieres registrarte?' };
      }
       // Login exitoso
      await AsyncStorage.setItem(SESSION_KEY, found.email);
      setUser(found);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Error al iniciar sesión. Intenta de nuevo.' };
    }
  };

  // LOGOUT
  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY); // borra el email guardado
    setUser(null); // limpia el usuario en memoria
  }; //borra la sesión de AsyncStorage y pone user en null. El Guard en _layout.
  // tsx detecta que user es null y redirige al login automáticamente.

  // ACTUALIZAR PERFIL
  const updateProfile = async (data: Partial<User>) => {
  if (!user) return;
  
  // Combina los datos actuales con los nuevos
  const updated = { ...user, ...data };
  // Ejemplo: { ...{name:'Ricardo', email:'r@r.com'}, ...{name:'Ricardo M'} }
  // Resultado: { name:'Ricardo M', email:'r@r.com' }
  
  const users = await getUsers();
  
  // Reemplaza solo el usuario que cambió, mantiene los demás igual
  const newUsers = users.map((u) => 
    u.email === user.email ? updated : u
  );
  
  await saveUsers(newUsers);
  await AsyncStorage.setItem(SESSION_KEY, updated.email);
  setUser(updated); // actualiza en memoria
};

  // CAMBIAR CONTRASEÑA
  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    
    if (!user) return { success: false, error: 'No hay sesión activa.' };
     // Verifica que la contraseña actual sea correcta
    if (user.password !== currentPassword) {
      return { success: false, error: 'La contraseña actual es incorrecta.' };
    }
     // Reutiliza updateProfile para actualizar solo la contraseña
    await updateProfile({ password: newPassword });
    return { success: true };
  }; // En lugar de duplicar código, llama a updateProfile que ya sabe cómo guardar en AsyncStorage. 
  // Solo le pasa { password: newPassword } y el spread operator se encarga del resto.

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
  // Pone todos los datos y funciones disponibles en el "canal".
  // Todo componente que esté dentro de <AuthProvider> puede acceder a esto.
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fuera de AuthProvider');
  return ctx;
};
// Es el gancho personalizado que cualquier pantalla usa para conectarse al contexto.
// Si alguien llama useAuth() fuera del <AuthProvider>, lanza un error descriptivo 