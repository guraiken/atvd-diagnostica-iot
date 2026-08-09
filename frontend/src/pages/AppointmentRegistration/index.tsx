import { useEffect, useState, type FormEvent } from "react"
import { Link } from "react-router"
import { toast } from "react-toastify"
import api from "../../api/api"
import type { AppointmentDetails, Customer, Professional } from "../../types/api"
import Modal from "../../components/Modal"
import AppointmentForm from "../../components/AppointmentForm"
import AppointmentTable from "../../components/AppointmentTable"

export default function AppointmentRegistration() {
    const [appointments, setAppointments] = useState<AppointmentDetails[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [search, setSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState<AppointmentDetails | null>(null)

    async function loadAppointments(term = "") {
        const res = await api.get("/agendamentos", { params: term ? { busca: term } : {} })
        setAppointments(res.data.data)
    }

    useEffect(() => {
        loadAppointments()
        api.get("/clientes").then((res) => setCustomers(res.data.data))
        api.get("/profissionais").then((res) => setProfessionals(res.data.data))
    }, [])

    function handleSearch(e: FormEvent) {
        e.preventDefault()
        loadAppointments(search)
    }

    function openNew() {
        setEditingAppointment(null)
        setModalOpen(true)
    }

    function openEdit(appointment: AppointmentDetails) {
        setEditingAppointment(appointment)
        setModalOpen(true)
    }

    async function handleSaved() {
        setModalOpen(false)
        toast.success(editingAppointment ? "Agendamento atualizado com sucesso" : "Agendamento criado com sucesso")
        await loadAppointments(search)
    }

    async function handleDelete(appointment: AppointmentDetails) {
        if (!window.confirm(`Excluir o agendamento de ${appointment.cliente_nome}?`)) return
        await api.delete(`/agendamentos/${appointment.id}`)
        toast.success("Agendamento excluído com sucesso")
        await loadAppointments(search)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Cadastro de Agendamento</h1>
                <Link to="/" className="text-sm text-cyan-700 hover:underline">← Voltar</Link>
            </div>

            <div className="bg-white rounded-md shadow p-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por cliente, profissional, tipo..."
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-72"
                        />
                        <button type="submit" className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50 cursor-pointer">
                            Buscar
                        </button>
                    </form>
                    <button
                        onClick={openNew}
                        className="px-4 py-2 rounded-md bg-cyan-700 text-white text-sm hover:bg-cyan-800 cursor-pointer"
                    >
                        Novo agendamento
                    </button>
                </div>

                <AppointmentTable
                    appointments={appointments}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingAppointment ? "Editar agendamento" : "Novo agendamento"}
            >
                <AppointmentForm
                    appointment={editingAppointment}
                    customers={customers}
                    professionals={professionals}
                    onSaved={handleSaved}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>
        </div>
    )
}
