import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateActivityModal } from "./create-activity-modal";
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Activities } from "./activities";
import { DestinationDateHeader } from "./destination-date-header";
import { Button } from "../../components/button";
import { disableBodyScroll, enableBodyScroll } from "@blro/body-scroll-lock";
import { AccceptInvitationModal } from "./accept-invitation-modal";
import { AcceptTripModal } from "./accept-trip-modal";

export interface TripDetails {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export function TripDetailsPage() {
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false)
  const [isAcceptInvitationModalOpen, setIsAcceptInvitationModalOpen] = useState(false)
  const [isAcceptTripModalOpen, setIsAcceptTripModalOpen] = useState(false)

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true)
    disableBodyScroll()
  }

  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false)
    enableBodyScroll()
  }

  function openAcceptInvitationModal() {
    setIsAcceptInvitationModalOpen(true)
    disableBodyScroll()
  }

  function closeAcceptInvitationModal() {
    setIsAcceptInvitationModalOpen(false)
    enableBodyScroll()
  }

  function openAcceptTripModal() {
    setIsAcceptTripModalOpen(true)
    disableBodyScroll()
  }

  function closeAcceptTripModal() {
    setIsAcceptTripModalOpen(false)
    enableBodyScroll()
  }

  useEffect(() => {
    if (location.pathname.match(/^\/participants\/[^/]+\/confirm$/)) {
      openAcceptInvitationModal()
    }
  })

  useEffect(() => {
    if (location.pathname.match(/^\/trips\/[^/]+\/confirm$/)) {
      openAcceptTripModal()
    }
  })

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
      <DestinationDateHeader />

      <main className="sm:flex max-[681px]:block gap-16 px-4">
        <div className="flex-1 space-y-6">
          <div className="flex max-[830px]:block last:justify-items-end items-center justify-between">
            <h2 className="text-3xl font-semibold max-[830px]:mb-2">Atividades</h2>

            <Button onClick={openCreateActivityModal} className="last:max-[830px]:justify-self-stretch">
              <Plus className='size-5' />
              Cadastrar atividade
            </Button>
          </div>

          <Activities />
        </div>

        <div className="sm:w-80 space-y-6">
          <div className='hidden max-sm:block w-full h-px bg-zinc-800 mt-6' />
          <ImportantLinks />
          <div className='w-full h-px bg-zinc-800' />
          <Guests />
        </div>
      </main>

      {isCreateActivityModalOpen && (
        <CreateActivityModal closeCreateActivityModal={closeCreateActivityModal} />
      )}

      {isAcceptInvitationModalOpen && (
        <AccceptInvitationModal closeAcceptInvitationModal={closeAcceptInvitationModal} />
      )}

      {isAcceptTripModalOpen && (
        <AcceptTripModal closeAcceptTripModal={closeAcceptTripModal} />
      )}

    </div>
  )
}