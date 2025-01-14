import { useState, useCallback } from "react"

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
}

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId))
  }, [])

  const toast = useCallback(
    ({ duration = 3000, ...props }: Omit<ToastProps, "id">) => {
      const id = generateId()
      const newToast = { ...props, id }

      setToasts((toasts) => [...toasts, newToast])

      setTimeout(() => {
        dismiss(id)
      }, duration)

      return id
    },
    [dismiss]
  )

  return {
    toast,
    dismiss,
    toasts,
  }
}