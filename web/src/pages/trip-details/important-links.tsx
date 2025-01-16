import { Link2, Plus } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { CreateLinkModal } from "./create-link-modal";
import { disableBodyScroll, enableBodyScroll } from "@blro/body-scroll-lock";
import { isValidUrl } from "../../components/validateInput";

interface Links {
  id: string
  title: string
  url: string
}

export function ImportantLinks() {
  const { tripId } = useParams()
  const [links, setLinks] = useState<Links[]>([])
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false)
  const [error, setError] = useState<string | null>()
  const [isLoading, setIsLoading] = useState(false)

  function openCreateLinkModal() {
    setIsCreateLinkModalOpen(true)
    disableBodyScroll()
  }

  function closeCreateLinkModal() {
    setIsCreateLinkModalOpen(false)
    enableBodyScroll()
  }

  async function createLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const title = data.get('title')?.toString()
    const url = data.get('url')?.toString()

    if (!title || !url || !isValidUrl(url)) {
      return setError("Por favor, preencha todos os campos corretamente")
    }

    try {
      setIsLoading(true)
      await api.post(`/trips/${tripId}/link`, { title, url })

      // atualiza lista de links
      const response = await api.get(`/trips/${tripId}/link`)
      setLinks(response.data.links)

      closeCreateLinkModal()
      setError(null)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    api.get(`/trips/${tripId}/link`).then(response => setLinks(response.data.links))
  }, [tripId])

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Links importantes</h2>

      <div className="space-y-5">
        {links.map(link => {
          return (
            <div key={link.id} className="flex items-center justify-between gap-4">
              <div className="space-y-1.5 ">
                <span className="block font-medium text-zinc-100">{link.title}</span>
                <a href={link.url} target="_blank" className="block text-xs text-zinc-400 truncate hover:text-zinc-200">{link.url}</a>
              </div>
              <Link2 className="text-zinc-400 size-5 shrink-0" />
            </div>
          )
        })}
      </div>

      <Button onClick={openCreateLinkModal} variant="secondary" size="full">
        <Plus className='size-5' />
        Cadastrar novo link
      </Button>

      {isCreateLinkModalOpen && (
        <CreateLinkModal closeCreateLinkModal={closeCreateLinkModal} createLink={createLink} error={error} isLoading={isLoading} />
      )}
    </div>

  )
}