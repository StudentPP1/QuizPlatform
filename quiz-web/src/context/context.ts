import { createContext } from "react";

export interface AuthState {
    isAuth: boolean
    setIsAuth: (isAuth: boolean) => void
}

const initAuthState: AuthState = {
    isAuth: false,
    setIsAuth: () => {}
}

export const AuthContext = createContext<AuthState>(initAuthState);