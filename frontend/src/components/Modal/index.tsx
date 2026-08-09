import type { ReactNode } from "react"

interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-md shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-lg">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 text-2xl leading-none cursor-pointer"
                    >
                        ×
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    )
}
