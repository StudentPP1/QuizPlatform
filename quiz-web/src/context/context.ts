import { createContext } from "react";
import { Creator } from "../models/user/Creator";

export interface AuthState {
    user: Creator | null;
    setUser: (user: Creator | null) => void
}

const initAuthState: AuthState = {
    user: null,
    setUser: () => {}
}

export const AuthContext = createContext<AuthState>(initAuthState);