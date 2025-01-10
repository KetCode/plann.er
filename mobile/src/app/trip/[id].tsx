import { CalendarRange, Info, MapPin, Settings2, Calendar as IconCalendar, User, Mail } from "lucide-react-native"
import { Alert, Keyboard, TouchableOpacity, View, Text } from "react-native"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils"
import { TripDetails, tripServer } from "@/server/trip-server"
import { router, useLocalSearchParams } from "expo-router"
import { DateData } from "react-native-calendars"
import { Calendar } from "@/components/calendar"
import { Loading } from "@/components/loading"
import { Button } from "@/components/button"
import React, { useEffect, useState } from "react"
import { Input } from "@/components/input"
import { Modal } from "@/components/modal"
import { Activities } from "./activities"
import { colors } from "@/styles/colors"
import { Details } from "./details"
import dayjs from "dayjs"
import { validateInput } from "@/utils/validateInput"
import { participantsServer } from "@/server/participants-server"
import { tripStorage } from "@/storage/trip"

export type TripData = TripDetails & { when: string, date: string }

enum MODAL {
  NONE = 0,
  UPDATE_TRIP = 1,
  CALENDAR = 2,
  CONFIRM_ATTENDANCE = 3,
}

export default function Trip() {
  // LOADING
  const [isLoadingTrip, setIsLoadingTrip] = useState(true)
  const [isUpdatingTrip, setIsUpdatingTrip] = useState(false)
  const [isConfirmingAttendance, setIsConfirmingAttendance] = useState(false)

  // MODAL
  const [showModal, setShowModal] = useState(MODAL.NONE)

  // DATA
  const [tripDetails, setTripDetails] = useState({} as TripData)
  const [option, setOption] = useState<"activity" | "details">("activity")
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected)
  const [destination, setDestination] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")

  const tripParams = useLocalSearchParams<{
    id: string
    participant?: string
  }>()

  function getAllDatesBetween(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) {
    let dates: { [key: string]: {} } = {}
    let currentDate = startDate.clone()

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      const dateString = currentDate.format('YYYY-MM-DD')
      dates[dateString] = { selected: true }
      currentDate = currentDate.add(1, 'day')
    }
  
    return dates;
  }

  async function getTripDetails() {
    try {
      setIsLoadingTrip(true)

      if (tripParams.participant) {
        setShowModal(MODAL.CONFIRM_ATTENDANCE)
      }

      if (!tripParams.id) {
        return router.back()
      }

      const trip = await tripServer.getById(tripParams.id)

      const maxLengthDestination = 13
      const destination =
        trip.destination.length > maxLengthDestination
          ? trip.destination.slice(0, maxLengthDestination) + "..."
          : trip.destination

      setDestination(trip.destination)

      setTripDetails({
        ...trip,
        when: `${destination}`,
        date: `${dayjs(trip.starts_at).format("DD")} de ${dayjs(trip.starts_at).format("MMM")} a ${dayjs(trip.ends_at).format("DD")} de ${dayjs(trip.starts_at).format("MMM")}`,
      })

      setSelectedDates({
        startsAt: { 
          day: dayjs(trip.starts_at).date(),
          month: dayjs(trip.starts_at).month() + 1,
          year: dayjs(trip.starts_at).year(),
          timestamp: dayjs(trip.starts_at).valueOf(),
          dateString: dayjs(trip.starts_at).format("YYYY-MM-DD"),
        },
        endsAt: { 
          day: dayjs(trip.ends_at).date(),
          month: dayjs(trip.ends_at).month() + 1,
          year: dayjs(trip.ends_at).year(),
          timestamp: dayjs(trip.ends_at).valueOf(),
          dateString: dayjs(trip.ends_at).format("YYYY-MM-DD")
        },
        dates: getAllDatesBetween(dayjs(trip.starts_at), dayjs(trip.ends_at)),
        formatDatesInText: tripDetails.date
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingTrip(false)
    }
  }

  function handleSelectDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    })

    setSelectedDates(dates)
  }

  async function handleUpdateTrip() {
    try {
      if (!tripParams.id) {
        return
      }

      if (!destination || !selectedDates.startsAt || !selectedDates.endsAt) {
        return Alert.alert(
          "Atualizar viagem",
          "Lembre-se de, além de preencher o destino, selecione data de início e fim da viagem."
        )
      }

      setIsUpdatingTrip(true)

      await tripServer.update({
        id: tripParams.id,
        destination,
        starts_at: dayjs(selectedDates.startsAt.dateString).toISOString(),
        ends_at: dayjs(selectedDates.endsAt.dateString).toISOString(),
      })

      setShowModal(MODAL.NONE)
      getTripDetails()
    } catch (error) {
      console.log(error)
    } finally {
      setIsUpdatingTrip(false)
    }
  }

  async function handleConfirmAttendance() {
    try {
      if (!tripParams.id || !tripParams.participant) {
        return
      }

      if (!guestName.trim() || !guestEmail.trim()) {
        return Alert.alert(
          "Confirmação",
          "Preencha nome e e-mail para confirmar a viagem!"
        )
      }

      if (!validateInput.email(guestEmail.trim())) {
        return Alert.alert("Confirmação", "E-mail inválido!")
      }

      setIsConfirmingAttendance(true)

      await participantsServer.confirmTripByParticipantId({
        participantId: tripParams.participant,
        name: guestName,
        email: guestEmail.trim(),
      })

      await tripStorage.save(tripParams.id)

      setShowModal(MODAL.NONE)
    } catch (error) {
      console.log(error)
      Alert.alert("Confirmação", "Não foi possível confirmar!")
    } finally {
      setIsConfirmingAttendance(false)
    }
  }

  async function handleRemoveTrip() {
    try {
      Alert.alert("Remover viagem", "Tem certeza que deseja remover a viagem", [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            await tripStorage.remove()
            router.navigate("/")
          },
        },
      ])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTripDetails()
  }, [])

  if (isLoadingTrip) {
    return <Loading />
  }

  return (
    <View className="flex-1 px-5 pt-16">
      <Input variant="tertiary" className="h-16 gap-2 rounded-xl">
        <View className="flex-1 flex-row items-center justify-between gap-5">
          <View className="flex-1 flex-row items-center gap-2">
            <MapPin color={colors.zinc[400]} size={20} />
            <Input.Field value={tripDetails.when} readOnly />
          </View>

          <Text className="text-zinc-100 text-right">{tripDetails.date}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setShowModal(MODAL.UPDATE_TRIP)}
        >
          <View className="w-9 h-9 bg-zinc-800 items-center justify-center rounded-lg">
            <Settings2 color={colors.zinc[400]} size={20} />
          </View>
        </TouchableOpacity>
      </Input>

      {option === "activity" ? (
        <Activities tripDetails={tripDetails} />
      ) : (
        <Details tripId={tripDetails.id} />
      )}

      <View className="w-full absolute -bottom-1 self-center justify-end pb-5 z-10 bg-zinc-950">
        <View className="w-full flex-row bg-zinc-900 p-4 rounded-xl border border-zinc-800 gap-2">
          <Button
            style={{ flex: 1 }}
            onPress={() => setOption("activity")}
            variant={option === "activity" ? "primary" : "secondary"}
          >
            <CalendarRange
              color={
                option === "activity" ? colors.lime[950] : colors.zinc[200]
              }
              size={20}
            />
            <Button.Title>Atividades</Button.Title>
          </Button>

          <Button
            style={{ flex: 1 }}
            onPress={() => setOption("details")}
            variant={option === "details" ? "primary" : "secondary"}
          >
            <Info
              color={option === "details" ? colors.lime[950] : colors.zinc[200]}
              size={20}
            />
            <Button.Title>Detalhes</Button.Title>
          </Button>
        </View>
      </View>

      <Modal
        title="Atualizar viagem"
        subtitle="Somente quem criou a viagem pode editar."
        visible={showModal === MODAL.UPDATE_TRIP}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-2 my-4">
          <Input variant="secondary">
            <MapPin color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Para onde você vai?"
              onChangeText={setDestination}
              value={destination}
            />
          </Input>

          <Input variant="secondary">
            <IconCalendar color={colors.zinc[400]} size={20} />

            <Input.Field
              placeholder="Quando?"
              defaultValue={tripDetails.date}
              value={selectedDates.formatDatesInText}
              onPressIn={() => setShowModal(MODAL.CALENDAR)}
              onFocus={() => Keyboard.dismiss()}
            />
          </Input>
        </View>

        <Button onPress={handleUpdateTrip} isLoading={isUpdatingTrip}>
          <Button.Title>Atualizar</Button.Title>
        </Button>

        <TouchableOpacity activeOpacity={0.8} onPress={handleRemoveTrip}>
          <Text className="text-red-400 text-center mt-6">Remover viagem</Text>
        </TouchableOpacity>
      </Modal>

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta da viagem"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => setShowModal(MODAL.UPDATE_TRIP)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            minDate={dayjs().toISOString()}
            onDayPress={handleSelectDate}
            markedDates={selectedDates.dates}
          />

          <Button onPress={() => setShowModal(MODAL.UPDATE_TRIP)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Confirmar presença"
        subtitle={
          <>
          Você foi convidado(a) para participar de uma viagem para <Text className="font-semibold text-zinc-100">{destination}</Text> nas datas de <Text className="font-semibold text-zinc-100">{dayjs(selectedDates.startsAt?.dateString).date()} a{" "}{dayjs(selectedDates.endsAt?.dateString).date()} de{" "}{dayjs(selectedDates.endsAt?.dateString).format("MMMM")} de{" "}{dayjs(selectedDates.endsAt?.dateString).format("YYYY")}</Text>.
          {"\n\n"}
          Para confirmar sua presença na viagem, preencha os dados abaixo:
          </>
        }
        visible={showModal === MODAL.CONFIRM_ATTENDANCE}
      >
        <View className="gap-4 mt-4">
          <Input variant="secondary">
            <User color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Seu nome completo"
              onChangeText={setGuestName}
            />
          </Input>

          <Input variant="secondary">
            <Mail color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="E-mail de confirmação"
              keyboardType="email-address"
              onChangeText={setGuestEmail}
            />
          </Input>

          <Button
            isLoading={isConfirmingAttendance}
            onPress={handleConfirmAttendance}
          >
            <Button.Title>Confirmar minha presença</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  )
}