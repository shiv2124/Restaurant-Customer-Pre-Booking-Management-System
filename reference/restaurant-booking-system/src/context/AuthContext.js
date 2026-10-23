import { createContext } from 'react';

// The context object lives in its own file; AuthProvider.jsx fills it and
// hooks/useAuth.js reads it. (Keeping components and plain objects in
// separate files is what lets Vite hot-reload components reliably.)
export const AuthContext = createContext(null);
