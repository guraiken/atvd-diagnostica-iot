import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import api from "../api/api"
import type { PublicUser } from "../types/api"

interface AuthContextValue {
    user: PublicUser | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<PublicUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/me")
            .then((res) => setUser(res.data.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    async function login(email: string, password: string) {
        const res = await api.post("/login", { email, senha: password })
        setUser(res.data.data)
    }

    async function logout() {
        await api.post("/logout")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider")
    return context
}
