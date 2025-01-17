import { Calendar, Clock, Tag, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { Modal } from "../../components/modal";
import { enableBodyScroll } from "@blro/body-scroll-lock";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TripDetails } from ".";

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void
}

export function CreateActivityModal({ closeCreateActivityModal }: CreateActivityModalProps) {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<TripDetails | undefined>()
  const [error, setError] = useState<string | null>()
  const [isLoading, setIsLoading] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [activityDate, setActivityDate] = useState<Date>()
  const [activityHour, setActivityHour] = useState<string>('')
  const today = new Date()

  const displayedDate = activityDate ? format(activityDate, "d' de 'LLLL", { locale: ptBR }) : null

  function openDatePicker() {
    return setIsDatePickerOpen(true)
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false)
  }

  function formatHour(value: string) {
    let formattedHour = value.replace(/[^0-9:]/g, "")

    if (formattedHour.length === 2) {
      formattedHour = formattedHour + ":00"
    } else if (formattedHour.length > 2 && formattedHour.indexOf(":") === -1) {
      formattedHour = formattedHour.slice(0, 2) + ":" + formattedHour.slice(2, 4);
    }

    return formattedHour
  }

  function handleHourChange(event: React.ChangeEvent<HTMLInputElement>) {
    const hour = formatHour(event.target.value)
    setActivityHour(hour)
  }

  async function createActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const title = data.get('title')?.toString()
    const [hours, minutes] = activityHour.split(":").map((val) => parseInt(val, 10))

    if (!title || !activityDate || !activityHour) {
      return setError("Por favor, preencha todos os campos")
    } else {
      setError(null)
    }

    activityDate.setHours(hours)
    activityDate.setMinutes(minutes)
    const occurs_at = format(activityDate, "yyyy-LL-dd'T'HH:mm")

    try {
      setIsLoading(true)
      await api.post(`/trips/${tripId}/activities`, { title, occurs_at })

      enableBodyScroll()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
      closeCreateActivityModal()
    }
  }

  useEffect(() => {
    api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
  }, [tripId])

  return (
    <Modal title="Cadastrar atividade" description="Todos convidados podem visualizar as atividades." buttonText="Salvar atividade" closeButton={closeCreateActivityModal} submitButton={createActivity} isLoading={isLoading} >
      <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
        <Tag className='text-zinc-400 size-5' />
        <input name='title' placeholder="Qual a atividade?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
      </div>

      <div className="w-full mt-2 flex flex-row gap-2">
        <div onClick={openDatePicker} className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex w-full items-center gap-2'>
          <Calendar className='size-5 text-zinc-400' />
          <span className="text-lg text-zinc-400 w-40 flex-1">{displayedDate || 'Quando?'}</span>
        </div>

        <div className='px-4 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
          <Clock className='text-zinc-400 size-5' />
          <input name='hour' placeholder="Horário" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" value={activityHour} onChange={handleHourChange} maxLength={5} />
        </div>
      </div>

      {error && <p className="text-red-700 text-sm mt-2">{error}</p>}

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

            <DayPicker className="max-sm:scale-[.88] max-sm:origin-top-left" mode="single" selected={activityDate} onSelect={(day) => setActivityDate(day)} disabled={{ before: (trip?.starts_at ? new Date(trip.starts_at) : today), after: trip?.ends_at ? new Date(trip.ends_at) : undefined }} />
          </div>
        </div>
      )}
    </Modal>
  )
}