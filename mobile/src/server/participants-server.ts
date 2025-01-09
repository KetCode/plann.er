import { api } from "./api"

export type Participant = {
  id: string
  name: string
  email: string
  is_confirmed: boolean
  is_owner: boolean
}

type ParticipantConfirm = {
  participantId: string
  name: string
  email: string
}

type InviteParticipant = Omit<Participant, "id" | "name"> & {
  tripId: string
  name: null
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
  participantId,
  name,
  email,
}: ParticipantConfirm) {
  try {
    await api.put(`/participants/${participantId}/confirm`, { name, email })
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

export const participantsServer = { getByTripId, confirmTripByParticipantId, inviteNewParticipant }
