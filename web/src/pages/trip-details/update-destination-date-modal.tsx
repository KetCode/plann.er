import { Calendar, MapPin, X } from "lucide-react";
import { Modal } from "../../components/modal";
import { useParams } from "react-router-dom";
import { FormEvent, useState } from "react";
import { api } from "../../lib/axios";
import { DateRange, DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { enableBodyScroll } from "@blro/body-scroll-lock";

interface UpdateDestinationDateModalProps {
  destination: string | undefined
  displayedDate: string | null
  starts_at: string | undefined
  ends_at: string | undefined
  closeUpdateDestinationDateModal: () => void
}

export function UpdateDestinationDateModal({ destination, displayedDate, starts_at, ends_at, closeUpdateDestinationDateModal }: UpdateDestinationDateModalProps) {
  const { tripId } = useParams()
  const [isDestination, setIsDestination] = useState(destination)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>({
    from: new Date(starts_at as string),
    to: new Date(ends_at as string),
  })
  const today = new Date()

  function openDatePicker() {
    return setIsDatePickerOpen(true)
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false)
  }

  const displayedDateUpdate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to ? format(eventStartAndEndDates.from, "d' de 'LLL").concat(' até ').concat(format(eventStartAndEndDates.to, "d' de 'LLL")) : displayedDate

  async function updateDestinationDate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const destination = data.get('destination')?.toString()
    const starts_at = eventStartAndEndDates?.from
    const ends_at = eventStartAndEndDates?.to

    await api.put(`/trips/${tripId}/update`, { destination, starts_at, ends_at })

    enableBodyScroll()
    location.reload();
  }

  return (
    <Modal title="Alterar local e data" description="Todos convidados podem visualizar as alterações." buttonText="Salvar local e data" closeButton={closeUpdateDestinationDateModal} submitButton={updateDestinationDate}>
      <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <MapPin className='text-zinc-400 size-5' />
        <input name='destination' value={isDestination} onChange={event => setIsDestination(event.target.value)} placeholder="Para onde você vai?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>

      <div onClick={openDatePicker} className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <Calendar className='text-zinc-400 size-5' />
        <span className="text-lg text-zinc-400 w-40 flex-1 max-sm:text-base">{displayedDateUpdate || 'Quando?'}</span>
      </div>

      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className='rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 max-sm:h-[350px] m-3'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Selecione a data</h2>
                <button type='button' onClick={closeDatePicker}>
                  <X className='size-5 text-zinc-400' />
                </button>
              </div>
            </div>

            <DayPicker className="max-sm:scale-[.88] max-sm:origin-top-left" mode="range" selected={eventStartAndEndDates} onSelect={setEventStartAndEndDates} disabled={{ before: today }} />
          </div>
        </div>
      )}
    </Modal>
  )
}