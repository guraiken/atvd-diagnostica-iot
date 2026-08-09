export function toDatetimeLocalInput(value: string): string {
    return value.slice(0, 16)
}

export function formatDateTimeDisplay(value: string): string {
    const [date, time] = value.split("T")
    const [year, month, day] = date.split("-")
    return `${day}/${month}/${year} ${time.slice(0, 5)}`
}

export function formatDateDisplay(value: string): string {
    const [date] = value.split("T")
    const [year, month, day] = date.split("-")
    return `${day}/${month}/${year}`
}

export function weekdayName(day: number): string {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    return days[day] ?? ""
}
