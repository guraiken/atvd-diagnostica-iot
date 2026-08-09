import type { AppointmentDetails } from "../models/Appointment"

export type SortCriterion = "data" | "cliente" | "profissional"

export const SORT_CRITERIA: SortCriterion[] = ["data", "cliente", "profissional"]

export function mergeSort(list: AppointmentDetails[], criterion: SortCriterion): AppointmentDetails[] {
    if (list.length <= 1) return list

    const middle = Math.floor(list.length / 2)
    const left = mergeSort(list.slice(0, middle), criterion)
    const right = mergeSort(list.slice(middle), criterion)

    return merge(left, right, criterion)
}

function merge(
    left: AppointmentDetails[],
    right: AppointmentDetails[],
    criterion: SortCriterion
): AppointmentDetails[] {
    const result: AppointmentDetails[] = []
    let i = 0
    let j = 0

    while (i < left.length && j < right.length) {
        const leftItem = left[i]
        const rightItem = right[j]
        if (!leftItem || !rightItem) break

        if (compare(leftItem, rightItem, criterion) <= 0) {
            result.push(leftItem)
            i++
        } else {
            result.push(rightItem)
            j++
        }
    }

    return [...result, ...left.slice(i), ...right.slice(j)]
}

function compare(a: AppointmentDetails, b: AppointmentDetails, criterion: SortCriterion): number {
    if (criterion === "cliente") return a.cliente_nome.localeCompare(b.cliente_nome, "pt-BR")
    if (criterion === "profissional") return a.profissional_nome.localeCompare(b.profissional_nome, "pt-BR")
    if (a.data_hora_inicio < b.data_hora_inicio) return -1
    if (a.data_hora_inicio > b.data_hora_inicio) return 1
    return 0
}
