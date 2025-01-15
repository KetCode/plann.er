import { FormEvent, ReactNode } from "react"
import { Button } from "./button"
import { X } from "lucide-react"
import { Loading } from "./loading"

interface ModalProps {
  title: string
  description: ReactNode
  buttonText: string
  closeButton?: () => void
  submitButton: (event: FormEvent<HTMLFormElement>) => void
  children?: ReactNode
  isLoading?: boolean
}

export function Modal({ title, description, buttonText, closeButton, submitButton, children, isLoading }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center !mt-0">
      <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 m-3'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold' >{title}</h2>
            {closeButton && (<button type='button' onClick={closeButton}>
              <X className='size-5 text-zinc-400' />
            </button>)}
          </div>
          <p className='text-sm text-zinc-400 sm:w-[35rem]'>{description}</p>
        </div>

        <form onSubmit={submitButton} className='space-y-3'>
          {children}
          <Button type='submit' size="full" disabled={isLoading}>
            {isLoading ? <Loading /> : buttonText}
          </Button>
        </form>
      </div>
    </div>
  )
}