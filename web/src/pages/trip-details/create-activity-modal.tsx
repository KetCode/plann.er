import { Calendar, Tag } from "lucide-react";
import { FormEvent, useState } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { Modal } from "../../components/modal";
import { enableBodyScroll } from "@blro/body-scroll-lock";

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void
}

export function CreateActivityModal({ closeCreateActivityModal }: CreateActivityModalProps) {
  const { tripId } = useParams()
  const [error, setError] = useState<string | null>()

  async function createActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const title = data.get('title')?.toString()
    const occurs_at = data.get('occurs_at')?.toString()

    if (!title || !occurs_at) {
      return setError("Por favor, preencha todos os campos")
    } else {
      setError(null)
    }

    await api.post(`/trips/${tripId}/activities`, { title, occurs_at })

    enableBodyScroll()
    location.reload()
  }

  return (
    <Modal title="Cadastrar atividade" description="Todos convidados podem visualizar as atividades." buttonText="Salvar atividade" closeButton={closeCreateActivityModal} submitButton={createActivity} >
      <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <Tag className='text-zinc-400 size-5' />
        <input name='title' placeholder="Qual a atividade?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>

      <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <Calendar className='text-zinc-400 size-5' />
        <input type="datetime-local" name='occurs_at' placeholder="Data e horário da atividade" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>

      {error && <p className="text-red-700 text-sm mt-2">{error}</p>}
    </Modal>
  )
}