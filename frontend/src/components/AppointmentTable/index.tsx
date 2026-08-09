import type { AppointmentDetails } from "../../types/api"
import { formatDateTimeDisplay } from "../../utils/formatDateTime"

interface AppointmentTableProps {
    appointments: AppointmentDetails[]
    onEdit: (appointment: AppointmentDetails) => void
    onDelete: (appointment: AppointmentDetails) => void
}

export default function AppointmentTable({ appointments, onEdit, onDelete }: AppointmentTableProps) {
    if (appointments.length === 0) {
        return <p className="text-gray-500 text-sm py-6 text-center">Nenhum agendamento encontrado.</p>
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                        <th className="py-2 pr-4 font-medium">Cliente</th>
                        <th className="py-2 pr-4 font-medium">Profissional</th>
                        <th className="py-2 pr-4 font-medium">Tipo</th>
                        <th className="py-2 pr-4 font-medium">Início</th>
                        <th className="py-2 pr-4 font-medium">Fim</th>
                        <th className="py-2 pr-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id} className="border-b border-gray-100 last:border-0">
                            <td className="py-2 pr-4">{appointment.cliente_nome}</td>
                            <td className="py-2 pr-4">{appointment.profissional_nome}</td>
                            <td className="py-2 pr-4">{appointment.tipo === "RESIDENCIAL" ? "Residencial" : "Comercial"}</td>
                            <td className="py-2 pr-4">{formatDateTimeDisplay(appointment.data_hora_inicio)}</td>
                            <td className="py-2 pr-4">{formatDateTimeDisplay(appointment.data_hora_fim)}</td>
                            <td className="py-2 pr-4">
                                <div className="flex gap-3">
                                    <button onClick={() => onEdit(appointment)} className="text-cyan-700 hover:underline cursor-pointer">
                                        Editar
                                    </button>
                                    <button onClick={() => onDelete(appointment)} className="text-red-600 hover:underline cursor-pointer">
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
