import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react";
import { Button } from "../../../components/button";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { format } from 'date-fns'
import 'react-day-picker/dist/style.css'

interface DestinationDateStepProps {
  isGuestsInputOpen: boolean
  eventStartAndEndDates: DateRange | undefined
  closeGuestsInput: () => void
  openGuestsInput: () => void
  setDestination: (destination: string) => void
  setEventStartAndEndDates: (dates: DateRange | undefined) => void
}

export function DestinationDateStep({ isGuestsInputOpen, closeGuestsInput, openGuestsInput, setDestination, eventStartAndEndDates, setEventStartAndEndDates }: DestinationDateStepProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const today = new Date()

  function openDatePicker() {
    return setIsDatePickerOpen(true)
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false)
  }

  const displayedDate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to ? format(eventStartAndEndDates.from, "d' de 'LLL").concat(' até ').concat(format(eventStartAndEndDates.to, "d' de 'LLL")) : null


  return (
    <div className="h-16 bg-zinc-900 px-4 rounded-xl sm:flex max-sm:h-36 max-sm:py-3 items-center shadow-shape gap-3">
      <div className="flex items-center gap-2 flex-1">
        <MapPin className='size-5 text-zinc-400' />
        <input disabled={isGuestsInputOpen} onChange={event => setDestination(event.target.value)} type="text" placeholder="Para onde você vai?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>

      <button  onClick={openDatePicker} disabled={isGuestsInputOpen} className="flex items-center gap-2 text-left w-60 max-sm:my-3">
        <Calendar className='size-5 text-zinc-400' />
        <span className="text-lg text-zinc-400 w-40 flex-1">{displayedDate || 'Quando?'}</span>
      </button>

      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className='rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 max-sm:h-[350px] m-3'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold' >Selecione a data</h2>
                <button type='button' onClick={closeDatePicker}>
                  <X className='size-5 text-zinc-400' />
                </button>
              </div>
            </div>

            <DayPicker className="max-sm:scale-[.88] max-sm:origin-top-left" mode="range" selected={eventStartAndEndDates} onSelect={setEventStartAndEndDates} disabled={{ before: today }} />
          </div>
        </div>
      )}

      <div className='max-sm:hidden w-px h-6 bg-zinc-800' />

      {isGuestsInputOpen ? (
        <Button onClick={closeGuestsInput} variant="secondary" className="max-sm:w-full">
          Alterar local e data
          <Settings2 className='size-5' />
        </Button>
      ) : (
        <Button onClick={openGuestsInput} className="max-sm:w-full">
          Continuar
          <ArrowRight className='size-5' />
        </Button>
      )}
    </div>
  )
}