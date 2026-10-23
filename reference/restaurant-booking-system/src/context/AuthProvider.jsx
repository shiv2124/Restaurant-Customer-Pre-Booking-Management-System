import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { STORAGE_KEYS } from '../constants/options';
import { generateId } from '../utils/id';
import { loadJSON, removeItem, saveJSON } from '../utils/storage';

/**
 * Holds the logged-in user for the whole app.
 *
 * NOTE: login/signup are mocked, exactly like the original project: no
 * server checks the password. The forms validate the input; swap the bodies
 * of `login` and `signup` for real API calls when a backend exists.
 */
export function AuthProvider({ children }) {
  // Lazy initial state: read the saved user once, before the first render,
  // so protected pages never flash the login screen on refresh.
  const [user, setUser] = useState(() => loadJSON(STORAGE_KEYS.USER));

  const startSession = (nextUser) => {
    setUser(nextUser);
    saveJSON(STORAGE_KEYS.USER, nextUser);
    return nextUser;
  };

  const login = async (email, _password, userType) =>
    startSession({
      id: generateId(),
      email,
      name: email.split('@')[0],
      userType,
    });

  const signup = async (email, _password, name, userType) =>
    startSession({ id: generateId(), email, name, userType });

  const logout = () => {
    setUser(null);
    removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
