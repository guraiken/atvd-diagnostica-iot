import { Link } from "react-router"
import { useAuth } from "../../contexts/AuthContext"
import UpcomingAppointments from "../../components/UpcomingAppointments"

export default function Home() {
    const { user } = useAuth()

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold">Bem-vindo, {user?.nome}</h1>
                <p className="text-gray-500">Painel de Agendamentos</p>
            </div>

            <UpcomingAppointments />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    to="/agendamentos"
                    className="bg-white rounded-md shadow p-6 hover:shadow-md transition-shadow"
                >
                    <h2 className="font-semibold text-lg text-cyan-800">Cadastro de Agendamento</h2>
                    <p className="text-sm text-gray-500 mt-1">Listar, criar, editar e excluir agendamentos.</p>
                </Link>
                <Link
                    to="/gestao"
                    className="bg-white rounded-md shadow p-6 hover:shadow-md transition-shadow"
                >
                    <h2 className="font-semibold text-lg text-cyan-800">Gestão de Agendamentos</h2>
                    <p className="text-sm text-gray-500 mt-1">Ordenar, alocar profissionais e verificar conflitos.</p>
                </Link>
                <Link
                    to="/historico"
                    className="bg-white rounded-md shadow p-6 hover:shadow-md transition-shadow"
                >
                    <h2 className="font-semibold text-lg text-cyan-800">Histórico</h2>
                    <p className="text-sm text-gray-500 mt-1">Consultar o registro de todas as movimentações.</p>
                </Link>
            </div>
        </div>
    )
}
