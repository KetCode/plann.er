import { Mail, User } from "lucide-react";
import { FormEvent } from "react";
import { Modal } from "../../components/modal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void
  destination: string
  starts_at: Date | undefined
  ends_at: Date | undefined
  setOwnerName: (name: string) => void
  setOwnerEmail: (email: string) => void
  createTrip: (event: FormEvent<HTMLFormElement>) => void
}

export function ConfirmTripModal({ closeConfirmTripModal, createTrip, destination, starts_at, ends_at, setOwnerName, setOwnerEmail }: ConfirmTripModalProps) {
  
  const displayedDate = format(starts_at as Date, "d").concat(' a ').concat(format(ends_at as Date, "d' de 'LLLL' de 'yyyy", { locale: ptBR }))

  return (
    <Modal 
      title="Confirmar criação da viagem" 
      description={
        <> 
        Para concluir a criação da viagem para <span className="font-semibold text-zinc-100">{destination}</span> nas datas de <span className="font-semibold text-zinc-100">{displayedDate}</span> preencha seus dados abaixo: 
        </>
      } 
      buttonText="Confirmar criação da viagem" 
      closeButton={closeConfirmTripModal} 
      submitButton={createTrip}
      >
      <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <User className='text-zinc-400 size-5' />
        <input name='name' onChange={event => setOwnerName(event.target.value)} placeholder="Seu nome completo" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>

      <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <Mail className='text-zinc-400 size-5' />
        <input type="email" onChange={event => setOwnerEmail(event.target.value)} name='email' placeholder="Seu email pessoal" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>
    </Modal>
  )
}