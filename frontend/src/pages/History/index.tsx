import { useEffect, useState } from "react"
import api from "../../api/api"
import type { AppointmentHistoryDetails, ActionType } from "../../types/api"
import { formatDateTimeDisplay } from "../../utils/formatDateTime"

const ACTION_LABELS: Record<ActionType, string> = {
    CRIACAO: "Criação",
    EDICAO: "Edição",
    EXCLUSAO: "Exclusão",
}

const ACTION_STYLES: Record<ActionType, string> = {
    CRIACAO: "bg-green-100 text-green-800",
    EDICAO: "bg-blue-100 text-blue-800",
    EXCLUSAO: "bg-red-100 text-red-800",
}

export default function History() {
    const [history, setHistory] = useState<AppointmentHistoryDetails[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/historico")
            .then((res) => setHistory(res.data.data))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Histórico</h1>

            <div className="bg-white rounded-md shadow p-6">
                {loading && <p className="text-gray-500 text-sm">Carregando...</p>}

                {!loading && history.length === 0 && (
                    <p className="text-gray-500 text-sm py-6 text-center">Nenhuma movimentação registrada.</p>
                )}

                {!loading && history.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-gray-200">
                                    <th className="py-2 pr-4 font-medium">Ação</th>
                                    <th className="py-2 pr-4 font-medium">Cliente</th>
                                    <th className="py-2 pr-4 font-medium">Profissional</th>
                                    <th className="py-2 pr-4 font-medium">Operador</th>
                                    <th className="py-2 pr-4 font-medium">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                        <td className="py-2 pr-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_STYLES[item.acao]}`}>
                                                {ACTION_LABELS[item.acao]}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-4">{item.cliente_nome}</td>
                                        <td className="py-2 pr-4">{item.profissional_nome}</td>
                                        <td className="py-2 pr-4">{item.usuario_nome}</td>
                                        <td className="py-2 pr-4">{formatDateTimeDisplay(item.data_hora)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
