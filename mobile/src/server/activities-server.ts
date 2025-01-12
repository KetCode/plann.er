import { api } from "./api"

type Activity = {
  id: string
  occurs_at: string
  title: string
}

type ActivityCreate = Omit<Activity, "id"> & {
  tripId: string
}

type ActivityResponse = {
  activities: {
    date: string
    activities: Activity[]
  }[]
}

type ActivityRemove = Omit<Activity, "title" | "occurs_at"> & {
  tripId: string
}

async function create({ tripId, occurs_at, title }: ActivityCreate) {
  try {
    const { data } = await api.post<{ activityId: string }>(
      `/trips/${tripId}/activities`,
      { occurs_at, title }
    )

    return data
  } catch (error) {
    throw error
  }
}

async function getActivitiesByTripId(tripId: string) {
  try {
    const { data } = await api.get<ActivityResponse>(
      `/trips/${tripId}/activities`
    )
    return data.activities
  } catch (error) {
    throw error
  }
}

async function remove({ tripId, id }: ActivityRemove){
  try {
    await api.delete(`/trips/${tripId}/activities/${id}`)
  } catch (error) {
    throw error
    }
}

export const activitiesServer = { create, getActivitiesByTripId, remove }
