import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import api from "../../api/api"
import type {
    AppointmentDetails, Alert, SortCriterion, Availability, Professional, CleaningType
} from "../../types/api"
import Alerts from "../../components/Alerts"
import { formatDateTimeDisplay, weekdayName, toDatetimeLocalInput } from "../../utils/formatDateTime"

export default function AppointmentManagement() {
    const [criterion, setCriterion] = useState<SortCriterion>("data")
    const [appointments, setAppointments] = useState<AppointmentDetails[]>([])
    const [professionals, setProfessionals] = useState<Professional[]>([])

    const [selected, setSelected] = useState<AppointmentDetails | null>(null)
    const [type, setType] = useState<CleaningType>("RESIDENCIAL")
    const [professionalId, setProfessionalId] = useState(0)
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const [availability, setAvailability] = useState<Availability[]>([])
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [error, setError] = useState("")
    const [saving, setSaving] = useState(false)

    async function loadList() {
        const res = await api.get("/agendamentos/ordenados", { params: { criterio: criterion } })
        setAppointments(res.data.data)
    }

    useEffect(() => {
        loadList()
    }, [criterion])

    useEffect(() => {
        api.get("/profissionais").then((res) => setProfessionals(res.data.data))
    }, [])

    useEffect(() => {
        if (!professionalId) {
            setAvailability([])
            return
        }
        api.get(`/profissionais/${professionalId}/disponibilidade`).then((res) => setAvailability(res.data.data))
    }, [professionalId])

    function select(appointment: AppointmentDetails) {
        setSelected(appointment)
        setType(appointment.tipo)
        setProfessionalId(appointment.profissional_id)
        setStart(toDatetimeLocalInput(appointment.data_hora_inicio))
        setEnd(toDatetimeLocalInput(appointment.data_hora_fim))
        setAlerts([])
        setError("")
    }

    async function handleSave() {
        if (!selected) return
        setError("")
        setSaving(true)

        const data = {
            cliente_id: selected.cliente_id,
            profissional_id: professionalId,
            endereco_id: selected.endereco_id,
            tipo: type,
            data_hora_inicio: start,
            data_hora_fim: end,
            observacoes: selected.observacoes,
        }

        try {
            const res = await api.put(`/agendamentos/${selected.id}`, data)
            setAlerts(res.data.alertas)
            setSelected(res.data.data)
            toast.success("Movimentação registrada com sucesso")
            await loadList()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error)
            } else {
                setError("Não foi possível salvar a movimentação")
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Gestão de Agendamentos</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-md shadow p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Agendamentos</h2>
                        <select
                            value={criterion}
                            onChange={(e) => setCriterion(e.target.value as SortCriterion)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                            <option value="data">Ordenar por data</option>
                            <option value="cliente">Ordenar por cliente</option>
                            <option value="profissional">Ordenar por profissional</option>
                        </select>
                    </div>

                    <ul className="flex flex-col gap-1 max-h-[480px] overflow-y-auto">
                        {appointments.map((appointment) => (
                            <li key={appointment.id}>
                                <button
                                    onClick={() => select(appointment)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm border cursor-pointer ${selected?.id === appointment.id
                                        ? "border-cyan-700 bg-cyan-50"
                                        : "border-transparent hover:bg-gray-50"
                                        }`}
                                >
                                    <p className="font-medium">{appointment.cliente_nome} — {appointment.profissional_nome}</p>
                                    <p className="text-gray-500">{formatDateTimeDisplay(appointment.data_hora_inicio)}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-md shadow p-6 flex flex-col gap-4">
                    <h2 className="font-semibold">Movimentação</h2>

                    {!selected && (
                        <p className="text-gray-500 text-sm">Selecione um agendamento na lista ao lado.</p>
                    )}

                    {selected && (
                        <>
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
                                    {error}
                                </div>
                            )}

                            <Alerts alerts={alerts} />

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Tipo de faxina</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as CleaningType)}
                                    className="border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value="RESIDENCIAL">Residencial</option>
                                    <option value="COMERCIAL">Comercial</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Profissional alocado</label>
                                <select
                                    value={professionalId}
                                    onChange={(e) => setProfessionalId(Number(e.target.value))}
                                    className="border border-gray-300 rounded-md px-3 py-2"
                                >
                                    {professionals.map((professional) => (
                                        <option key={professional.id} value={professional.id}>{professional.nome}</option>
                                    ))}
                                </select>
                                {availability.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Disponível: {availability.map((a) =>
                                            `${weekdayName(a.dia_semana)} ${a.hora_inicio.slice(0, 5)}–${a.hora_fim.slice(0, 5)}`
                                        ).join(" · ")}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Início</label>
                                    <input
                                        type="datetime-local"
                                        value={start}
                                        onChange={(e) => setStart(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Fim</label>
                                    <input
                                        type="datetime-local"
                                        value={end}
                                        onChange={(e) => setEnd(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 rounded-md bg-cyan-700 text-white hover:bg-cyan-800 disabled:opacity-60 self-end cursor-pointer"
                            >
                                {saving ? "Salvando..." : "Salvar movimentação"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
