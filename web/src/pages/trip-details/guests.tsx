import { CheckCircle2, CircleDashed, UserCog } from "lucide-react";
import { Button } from "../../components/button";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { UpdateGuestsModal } from "./update-guests-modal";
import { disableBodyScroll, enableBodyScroll } from "@blro/body-scroll-lock";

interface Participant {
  id: string
  name: string | null
  email: string
  is_confirmed: boolean
}

export function Guests() {
  const { tripId } = useParams()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [emailList, setEmailList] = useState<string[]>([])
  const [isUpdateGuestsModalOpen, setIsUpdateGuestsModalOpen] = useState(false)
  
  function openUpdateGuestsModal(){
    setIsUpdateGuestsModalOpen(true)
    disableBodyScroll()
  }

  function closeUpdateGuestsModal(){
    setIsUpdateGuestsModalOpen(false)
    enableBodyScroll()
  }

  async function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailList.includes(email)) {
      return
    }

    setEmailList(prevList => [...prevList, email])

    await api.post(`/trips/${tripId}/invites`, {
      name: null,
      email,
      is_confirmed: false,
      is_owner: false,
    })
  }

  useEffect(() => {
    api.get(`/trips/${tripId}/participants`).then(response => setParticipants(response.data.participants))

    const isEmailList = participants.map(participant => participant.email)
    setEmailList(isEmailList)
  }, [tripId, participants])

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>

      <div className="space-y-5">
        {participants.map((participant, index) => {
          return (
            <div key={participant.id} className="flex items-center justify-between gap-4">
              <div className="space-y-1.5 ">
                <span className="block font-medium text-zinc-100">{participant.name ?? `Convidado ${index}`}</span>
                <span className="block text-sm text-zinc-400 truncate">{participant.email }</span>
              </div>
              {participant.is_confirmed ? (
                <CheckCircle2 className="text-lime-400 size-5 shrink-0" />
              ) : (
                <CircleDashed className="text-zinc-400 size-5 shrink-0" />
              )}
            </div>
          )
        })}
      </div>

      <Button onClick={openUpdateGuestsModal} variant="secondary" size="full">
        <UserCog className='size-5' />
        Gerenciar convidados
      </Button>

      {isUpdateGuestsModalOpen && (
        <UpdateGuestsModal emailList={emailList} closeUpdateGuestsModal={closeUpdateGuestsModal} addNewEmailToInvite={addNewEmailToInvite} />
      )}
    </div>
  )
}