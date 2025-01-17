import { MapPin, Calendar, Settings2 } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UpdateDestinationDateModal } from "./update-destination-date-modal";
import { disableBodyScroll, enableBodyScroll } from "@blro/body-scroll-lock";
import { TripDetails } from ".";

export function DestinationDateHeader() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<TripDetails | undefined>()
  const [isUpdateDestinationDateModalOpen, setIsUpdateDestinationDateModalOpen] = useState(false)

  function openUpdateDestinationDateModal() {
    setIsUpdateDestinationDateModalOpen(true)
    disableBodyScroll()
  }

  function closeUpdateDestinationDateModal() {
    setIsUpdateDestinationDateModalOpen(false)
    enableBodyScroll()
  }

  useEffect(() => {
    api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
  }, [tripId])

  const displayedDate = trip ? format(trip.starts_at, "d' de 'LLL", { locale: ptBR }).concat(' até ').concat(format(trip.ends_at, "d' de 'LLL", { locale: ptBR })) : null

  return (
    <div className="px-4 max-sm:py-3 h-16 sm:flex max-sm:h-[8.5rem] rounded-xl bg-zinc-900 shadow-shape items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">{trip?.destination}</span>
      </div>

      <div className="sm:flex items-center gap-5">
        <div className="flex items-center gap-2 max-sm:my-3">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">{displayedDate}</span>
        </div>

        <div className='max-sm:hidden w-px h-6 bg-zinc-800' />

        <Button onClick={openUpdateDestinationDateModal} variant="secondary" className="max-sm:w-full">
          Alterar local e data
          <Settings2 className='size-5' />
        </Button>
      </div>

      {isUpdateDestinationDateModalOpen && (
        <UpdateDestinationDateModal destination={trip?.destination} displayedDate={displayedDate} starts_at={trip?.starts_at} ends_at={trip?.ends_at} closeUpdateDestinationDateModal={closeUpdateDestinationDateModal} />
      )}
    </div>
  )
}