import { useEffect, useState } from "react"
import api from "../../api/api"
import type { AppointmentDetails } from "../../types/api"
import { formatDateTimeDisplay } from "../../utils/formatDateTime"

export default function UpcomingAppointments() {
    const [appointments, setAppointments] = useState<AppointmentDetails[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/agendamentos/proximos", { params: { horas: 72 } })
            .then((res) => setAppointments(res.data.data))
            .finally(() => setLoading(false))
    }, [])

    if (loading || appointments.length === 0) return null

    return (
        <div className="bg-amber-50 border border-amber-300 rounded-md p-4">
            <h2 className="font-semibold text-amber-800 mb-2">
                Agendamentos nas próximas 72 horas
            </h2>
            <ul className="flex flex-col gap-1 text-sm text-amber-900">
                {appointments.map((appointment) => (
                    <li key={appointment.id}>
                        {formatDateTimeDisplay(appointment.data_hora_inicio)} — {appointment.cliente_nome} com {appointment.profissional_nome}
                    </li>
                ))}
            </ul>
        </div>
    )
}
