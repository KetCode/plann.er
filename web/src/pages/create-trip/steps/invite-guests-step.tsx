import { ArrowRight, UserRoundPlus } from "lucide-react";
import { Button } from "../../../components/button";

interface InviteGuestsStepProps {
  openGuestsModal: () => void
  emailsToInvite: string[]
  openConfirmTripModal: () => void
}

export function InviteGuestsStep({ openConfirmTripModal, openGuestsModal, emailsToInvite}: InviteGuestsStepProps) {
  return (
    <div className="h-16 bg-zinc-900 px-4 rounded-xl sm:flex max-sm:h-[6.3rem] max-sm:py-3 items-center shadow-shape gap-3">
      <button type="button" onClick={openGuestsModal} className="flex items-center gap-2 flex-1 text-left max-sm:mb-3">
        <UserRoundPlus className='size-5 text-zinc-400' />
        {emailsToInvite.length > 0 ? (
          <span className="text-lg max-sm:text-base text-zinc-100 flex-1">{emailsToInvite.length} pessoa(s) convidada(s)</span>
        ) : (
          <span className="text-lg max-sm:text-base text-zinc-400 flex-1">Quem estará na viagem?</span>
        )}
      </button>

      <div className='max-sm:hidden w-px h-6 bg-zinc-800' />

      <Button onClick={openConfirmTripModal} className="max-sm:w-full">
        Confirmar viagem
        <ArrowRight className='size-5' />
      </Button>
    </div>
  )
}