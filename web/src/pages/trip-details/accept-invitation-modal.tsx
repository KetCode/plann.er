import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../../components/modal";
import { Mail, User } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TripDetails } from ".";

interface Participant {
  id: string
  name: string
  email: string
  is_confirmed: boolean
  is_owner: boolean
  trip_id: string
}

interface AccceptInvitationModalProps {
  closeAcceptInvitationModal: () => void
}

export function AccceptInvitationModal({ closeAcceptInvitationModal }: AccceptInvitationModalProps) {
  const navigate = useNavigate()
  const { participantId } = useParams()
  const [participant, setParticipant] = useState<Participant | undefined>()
  const [trip, setTrip] = useState<TripDetails | undefined>()

  useEffect(() => {
    api.get(`/participants/${participantId}`).then(response => setParticipant(response.data.participant))
  }, [participantId])

  const tripId = participant?.trip_id

  useEffect(() => {
    api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
  }, [tripId])

  const displayedDate = trip ? format(trip.starts_at, "d").concat(' a ').concat(format(trip.ends_at, "d' de 'LLLL' de 'yyyy", { locale: ptBR })) : null

  async function confirmParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const name = data.get('name')?.toString()
    const email = data.get('email')?.toString()
    const is_confirmed = true
    const is_owner = false

    await api.put(`/participants/${participantId}/confirm`, { name, email, is_confirmed, is_owner })

    closeAcceptInvitationModal()
    navigate(`/trips/${tripId}`)
  }

  return (
    <Modal
      title={"Confirmar participação"}
      description={
        <>
          Você foi convidado(a) para participar de uma viagem para <span className="font-semibold text-zinc-100">{trip?.destination}</span> nas datas de <span className="font-semibold text-zinc-100">{displayedDate}</span>.
          <br /><br />
          Para confirmar sua presença na viagem, preencha os dados abaixo:
        </>
      }
      buttonText={"Confirmar minha presença"}
      submitButton={confirmParticipant}
    >
      <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <User className='text-zinc-400 size-5' />
        <input name='name' placeholder="Seu nome completo" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>

      <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <Mail className='text-zinc-400 size-5' />
        <input name='email' placeholder="Seu e-mail" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>
    </Modal>
  )
}