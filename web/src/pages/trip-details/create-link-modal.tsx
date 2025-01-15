import { Link2, Tag } from "lucide-react";
import { Modal } from "../../components/modal";
import { FormEvent } from "react";

interface CreateLinkModalProps {
  closeCreateLinkModal: () => void
  createLink: (event: FormEvent<HTMLFormElement>) => void
  error: string | null | undefined
}

export function CreateLinkModal({ closeCreateLinkModal, createLink, error }: CreateLinkModalProps) {
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

      {error && <p className="text-red-700 text-sm mt-2">{error}</p>}
    </Modal>
  )
}