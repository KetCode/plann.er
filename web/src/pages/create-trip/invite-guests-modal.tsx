import { AtSign, Plus, X } from "lucide-react"
import { FormEvent, useState } from "react"
import { Button } from "../../components/button"

interface InviteGuestsModalProps {
  closeGuestsModal: () => void
  emailsToInvite: string[]
  addNewEmailToInvite: (event: FormEvent<HTMLFormElement>) => void
  removeEmailFromInvites: (email: string) => void
}

export function InviteGuestsModal({ addNewEmailToInvite, closeGuestsModal, emailsToInvite, removeEmailFromInvites }: InviteGuestsModalProps) {
  const [error, setError] = useState<string | null>()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = new FormData(event.currentTarget)
    const email = form.get("email")?.toString()

    if (emailsToInvite.includes(email ?? "")) {
      setError("Este e-mail já foi adicionado")
      event.preventDefault()
    } else {
      setError(null)
      addNewEmailToInvite(event)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 m-3 overflow-y-auto max-h-[31rem]'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold' >Selecionar convidados</h2>
            <button type='button' onClick={closeGuestsModal}>
              <X className='size-5 text-zinc-400' />
            </button>
          </div>
          <p className='text-sm text-zinc-400'>Os convidados irão receber e-mails para confirmar a participação na viagem.</p>
        </div>

        <div className='flex flex-wrap gap-2'>
          {emailsToInvite.map(email => {
            return (
              <div key={email} className='py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2'>
                <span className='text-zinc-300 max-sm:text-sm truncate'>{email}</span>
                <button onClick={() => removeEmailFromInvites(email)} type='button'>
                  <X className='size-4 text-zinc-400' />
                </button>
              </div>
            )
          })}
        </div>

        <div className='w-full h-px bg-zinc-800' />

        {error && <p className="text-red-700 text-sm mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className='p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
          <div className='sm:px-2 flex items-center flex-1 gap-2'>
            <AtSign className='text-zinc-400 size-5' />
            <input type="email" name='email' placeholder="Digite o email do convidado" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1 max-sm:text-sm" />
          </div>

          <Button type='submit' className="max-sm:w-14">
            <p className="max-sm:hidden">Convidar</p>
            <Plus className='size-5' />
          </Button>
        </form>
      </div>
    </div>
  )
}