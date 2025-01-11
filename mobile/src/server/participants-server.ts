import { api } from "./api"

export type Participant = {
  id: string
  name: string
  email: string
  is_confirmed: boolean
  is_owner: boolean
}

type InviteParticipant = Omit<Participant, "id" | "name"> & {
  tripId: string
  name: null
}

type RemoveParticipant = Omit<Participant, "id" | "name" | "is_confirmed" | "is_owner"> & {
  tripId: string
}

async function getByTripId(tripId: string) {
  try {
    const { data } = await api.get<{ participants: Participant[] }>(
      `/trips/${tripId}/participants`
    )

    return data.participants
  } catch (error) {
    throw error
  }
}

async function confirmTripByParticipantId({
  id,
  name,
  email,
  is_confirmed,
  is_owner
}: Participant) {
  try {
    await api.put(`/participants/${id}/confirm`, { name, email, is_confirmed, is_owner })
  } catch (error) {
    throw error
  }
}

async function inviteNewParticipant({ tripId, name, email, is_confirmed, is_owner }: InviteParticipant) {
  try {
    const { data } = await api.post<{ participantId: string }>(
      `/trips/${tripId}/invites`,
      {name, email, is_confirmed, is_owner}
    )
    return data.participantId
  } catch (error) {
    throw error
  }
}

async function remove({ tripId, email }: RemoveParticipant) {
  try {
    await api.delete(`/trips/${tripId}/participants/${email}`)
  } catch (error) {
    throw error
    }
}

export const participantsServer = { getByTripId, confirmTripByParticipantId, inviteNewParticipant, remove }
