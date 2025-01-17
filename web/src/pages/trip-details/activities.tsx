import { Activity, CircleCheck, CircleDashed, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "../../components/button";

interface Activity {
  date: string
  activities: {
    id: string
    title: string
    occurs_at: string
  }[]
}

interface ActivitiesProps {
  openCreateActivityModal: () => void
}

export function Activities({ openCreateActivityModal }: ActivitiesProps) {
  const { tripId } = useParams()
  const [activities, setActivities] = useState<Activity[]>([])
  const today = format(new Date(), "yyyy-MM-dd'T'HH:mm")

  async function getTripActivities() {
    try {
      const response = await api.get(`/trips/${tripId}/activities`)
      setActivities(response.data.activities)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleRemoveActivity(activityId: string) {
    try {
      const { data } = await api.delete(`/trips/${tripId}/activities/${activityId}`)
      getTripActivities()
      return data.activities
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTripActivities()
  })

  return (
    <div className="flex-1 space-y-6">


      <div className="flex max-[830px]:block last:justify-items-end items-center justify-between">
        <h2 className="text-3xl font-semibold max-[830px]:mb-2">Atividades</h2>

        <Button onClick={openCreateActivityModal} className="last:max-[830px]:justify-self-stretch">
          <Plus className='size-5' />
          Cadastrar atividade
        </Button>
      </div>

      <div className="space-y-8">

        {activities.map(category => {
          return (
            <div key={category.date} className="space-y-2.5">
              <div className="flex gap-2 items-baseline">
                <span className="text-xl text-zinc-300 font-semibold">Dia {format(category.date, 'd')}</span>
                <span className="text-xs text-zinc-500">{format(category.date, 'EEEE', { locale: ptBR })}</span>
              </div>

              {category.activities.length > 0 ? (
                <div className="space-y-2.5">
                  {category.activities.map(activity => {
                    return (
                      <div key={activity.id} className="relative px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3 group">
                        {activity.occurs_at < String(today) ? (<CircleCheck className="size-5 text-lime-300" />) : (<CircleDashed className="size-5 text-zinc-400" />)}
                        <span className="text-zinc-100">{activity.title}</span>
                        <span className="text-zinc-400 text-sm ml-auto">{format(activity.occurs_at, 'HH:mm')}h</span>

                        <button
                          onClick={() => handleRemoveActivity(activity.id)}
                          className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 rounded-xl shadow-shape"
                        >
                          <Trash className="text-red-500" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}