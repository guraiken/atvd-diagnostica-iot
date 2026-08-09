import { NavLink, Outlet, useNavigate } from "react-router"
import { useAuth } from "../contexts/AuthContext"

const links = [
    { to: "/", label: "Início" },
    { to: "/agendamentos", label: "Cadastro de Agendamento" },
    { to: "/gestao", label: "Gestão de Agendamentos" },
    { to: "/historico", label: "Histórico" },
]

export default function DashboardLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-cyan-800 text-white">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                        <span className="font-bold text-lg">Faxinator</span>
                        <nav className="flex flex-wrap gap-4 text-sm">
                            {links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.to === "/"}
                                    className={({ isActive }) =>
                                        isActive ? "text-white font-semibold" : "text-cyan-200 hover:text-white"
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-cyan-100">Olá, {user?.nome}</span>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-md text-sm transition-colors cursor-pointer"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    )
}
