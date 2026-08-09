import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { useAuth } from "../../contexts/AuthContext"

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        try {
            await login(email, password)
            navigate("/")
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error)
            } else {
                setError("Não foi possível conectar ao servidor")
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white px-10 py-8 rounded-md shadow-md w-full max-w-sm flex flex-col gap-4"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Faxinator</h1>
                    <p className="text-gray-500 text-sm">Acesso do operador</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="text-sm font-medium">Senha</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-cyan-700 hover:bg-cyan-800 text-white rounded-md py-2 font-medium transition-colors disabled:opacity-60 cursor-pointer"
                >
                    {submitting ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    )
}
