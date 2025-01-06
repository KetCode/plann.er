import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../../components/modal";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Trip {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

interface AcceptInvitationTripModalProps {
  closeAcceptInvitationTripModal: () => void
}

export function AcceptInvitationTripModal({ closeAcceptInvitationTripModal }: AcceptInvitationTripModalProps) {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | undefined>()
  
  useEffect(() => {
      api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
    }, [tripId])
  
  const displayedDate = trip ? format(trip.starts_at, "d").concat(' a ').concat(format(trip.ends_at, "d' de 'LLLL' de 'yyyy", { locale: ptBR })) : null

  function handleClose() {
    closeAcceptInvitationTripModal()
    navigate(`/trips/${tripId}`)
  }
  
  function confirmTrip() {
    api.patch(`/trips/${tripId}/confirm`)
    
    handleClose()
  }

  return (
    <Modal
      title={"Confirmar viagem"}
      description={
        <>
          Você solicitou a criação de uma viagem para <span className="font-semibold text-zinc-100">{trip?.destination}</span> nas datas de <span className="font-semibold text-zinc-100">{displayedDate}</span>.
          <br /><br />
          Para confirmar sua viagem, clique no botão abaixo:
        </>
      }
      buttonText={"Confirmar viagem"}
      closeButton={handleClose}
      submitButton={confirmTrip}
    >
    </Modal>
  )
}