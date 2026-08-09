import { useEffect, useState, type FormEvent } from "react"
import axios from "axios"
import api from "../../api/api"
import type { AppointmentDetails, Customer, Address, Professional, CleaningType } from "../../types/api"
import { toDatetimeLocalInput } from "../../utils/formatDateTime"

interface AppointmentFormProps {
    appointment: AppointmentDetails | null
    customers: Customer[]
    professionals: Professional[]
    onSaved: () => void
    onCancel: () => void
}

export default function AppointmentForm({ appointment, customers, professionals, onSaved, onCancel }: AppointmentFormProps) {
    const [customerId, setCustomerId] = useState(appointment?.cliente_id ?? 0)
    const [addressId, setAddressId] = useState(appointment?.endereco_id ?? 0)
    const [professionalId, setProfessionalId] = useState(appointment?.profissional_id ?? 0)
    const [type, setType] = useState<CleaningType>(appointment?.tipo ?? "RESIDENCIAL")
    const [start, setStart] = useState(appointment ? toDatetimeLocalInput(appointment.data_hora_inicio) : "")
    const [end, setEnd] = useState(appointment ? toDatetimeLocalInput(appointment.data_hora_fim) : "")
    const [notes, setNotes] = useState(appointment?.observacoes ?? "")

    const [addresses, setAddresses] = useState<Address[]>([])
    const [error, setError] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!customerId) {
            setAddresses([])
            return
        }
        api.get(`/clientes/${customerId}/enderecos`).then((res) => setAddresses(res.data.data))
    }, [customerId])

    function selectCustomer(id: number) {
        setCustomerId(id)
        setAddressId(0)
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError("")
        setSaving(true)

        const data = {
            cliente_id: customerId,
            profissional_id: professionalId,
            endereco_id: addressId,
            tipo: type,
            data_hora_inicio: start,
            data_hora_fim: end,
            observacoes: notes || null,
        }

        try {
            if (appointment) {
                await api.put(`/agendamentos/${appointment.id}`, data)
            } else {
                await api.post("/agendamentos", data)
            }
            onSaved()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error)
            } else {
                setError("Não foi possível salvar o agendamento")
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Cliente</label>
                <select
                    value={customerId}
                    onChange={(e) => selectCustomer(Number(e.target.value))}
                    required
                    className="border border-gray-300 rounded-md px-3 py-2"
                >
                    <option value={0}>Selecione...</option>
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>{customer.nome}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Endereço</label>
                <select
                    value={addressId}
                    onChange={(e) => setAddressId(Number(e.target.value))}
                    required
                    disabled={!customerId}
                    className="border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100"
                >
                    <option value={0}>Selecione...</option>
                    {addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                            {address.logradouro}, {address.numero} — {address.bairro}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Profissional</label>
                <select
                    value={professionalId}
                    onChange={(e) => setProfessionalId(Number(e.target.value))}
                    required
                    className="border border-gray-300 rounded-md px-3 py-2"
                >
                    <option value={0}>Selecione...</option>
                    {professionals.map((professional) => (
                        <option key={professional.id} value={professional.id}>{professional.nome}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Tipo</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CleaningType)}
                    required
                    className="border border-gray-300 rounded-md px-3 py-2"
                >
                    <option value="RESIDENCIAL">Residencial</option>
                    <option value="COMERCIAL">Comercial</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Início</label>
                    <input
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Fim</label>
                    <input
                        type="datetime-local"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Observações</label>
                <textarea
                    value={notes ?? ""}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="border border-gray-300 rounded-md px-3 py-2"
                />
            </div>

            <div className="flex justify-end gap-2 mt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-md bg-cyan-700 text-white hover:bg-cyan-800 disabled:opacity-60 cursor-pointer"
                >
                    {saving ? "Salvando..." : "Salvar"}
                </button>
            </div>
        </form>
    )
}
