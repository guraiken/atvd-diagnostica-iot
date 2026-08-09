import { AppError } from "./errorTreatment"

const DATE_TIME_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/

export function formatDate(date: string): string {
    return date.replace(" ", "T")
}

export function normalizeDateTime(value: string, field: string): string {
    const parts = value?.match(DATE_TIME_REGEX)
    if (!parts) {
        throw new AppError(`O campo "${field}" deve estar no formato AAAA-MM-DDTHH:mm`, 400, "DATA_INVALIDA")
    }
    const [, year, month, day, hour, minute, second = "00"] = parts
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`
}

export function nowLocal(): string {
    return formatLocal(new Date())
}

export function addHoursLocal(hours: number): string {
    return formatLocal(new Date(Date.now() + hours * 60 * 60 * 1000))
}

function formatLocal(date: Date): string {
    const p = (value: number) => String(value).padStart(2, "0")
    return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}` +
        `T${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`
}

export function weekdayOf(dateTime: string): number {
    const [, year, month, day] = dateTime.match(DATE_TIME_REGEX) ?? []
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).getUTCDay()
}

export function minutesOfDay(dateTime: string): number {
    const [, , , , hour, minute] = dateTime.match(DATE_TIME_REGEX) ?? []
    return Number(hour) * 60 + Number(minute)
}

export function minutesFromTime(time: string): number {
    const [h, m] = time.split(":").map(Number)
    return (h ?? 0) * 60 + (m ?? 0)
}
