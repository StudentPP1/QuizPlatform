import { createContext } from "react";
import { Creator } from "../models/Creator";

export interface AuthState {
    user: Creator | null;
    setUser: (user: Creator) => void
}

const initAuthState: AuthState = {
    user: null,
    setUser: () => {}
}

export const AuthContext = createContext<AuthState>(initAuthState);