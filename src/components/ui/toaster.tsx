import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastViewport,
  } from "@/components/ui/toast"
  import { useToast } from "@/hooks/use-toast"
  
  export function Toaster() {
    const { toasts } = useToast()
  
    return (
      <ToastProvider>
        {toasts.map(function ({ id, description, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-[#E6FAF8] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00A3B1" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <ToastDescription>{description}</ToastDescription>
              </div>
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport />
      </ToastProvider>
    )
  }