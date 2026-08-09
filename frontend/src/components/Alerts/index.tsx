import type { Alert, AlertType } from "../../types/api"

const STYLES: Record<AlertType, string> = {
    CONFLITO_HORARIO: "bg-red-50 border-red-200 text-red-700",
    INDISPONIBILIDADE: "bg-amber-50 border-amber-200 text-amber-800",
}

const TITLES: Record<AlertType, string> = {
    CONFLITO_HORARIO: "Conflito de horário",
    INDISPONIBILIDADE: "Profissional indisponível",
}

export default function Alerts({ alerts }: { alerts: Alert[] }) {
    if (alerts.length === 0) return null

    return (
        <div className="flex flex-col gap-2">
            {alerts.map((alert) => (
                <div key={alert.tipo} className={`border rounded-md px-3 py-2 text-sm ${STYLES[alert.tipo]}`}>
                    <p className="font-semibold">{TITLES[alert.tipo]}</p>
                    <p>{alert.mensagem}</p>
                </div>
            ))}
        </div>
    )
}
