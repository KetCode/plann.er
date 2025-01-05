import { Link2, Tag } from "lucide-react";
import { Modal } from "../../components/modal";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { FormEvent } from "react";
import { enableBodyScroll } from "@blro/body-scroll-lock";

interface CreateLinkModalProps {
  closeCreateLinkModal: () => void
}

export function CreateLinkModal({ closeCreateLinkModal }: CreateLinkModalProps) {
  const { tripId } = useParams()

  async function createLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const title = data.get('title')?.toString()
    const url = data.get('url')?.toString()

    await api.post(`/trips/${tripId}/link`, { title, url })

    enableBodyScroll()
    location.reload()
  }

  return (
    <Modal title="Cadastrar link" description="Todos convidados podem visualizar os links importantes." buttonText="Salvar link" closeButton={closeCreateLinkModal} submitButton={createLink}>
      <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <Tag className='text-zinc-400 size-5' />
        <input name='title' placeholder="Título do link" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>

      <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <Link2 className='text-zinc-400 size-5' />
        <input name='url' placeholder="URL" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>
    </Modal>
  )
}