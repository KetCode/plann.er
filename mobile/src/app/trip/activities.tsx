import { View, Text, Keyboard, Alert, SectionList, TouchableOpacity } from "react-native";
import { TripData } from "./[id]"
import { Button } from "@/components/button";
import { colors } from "@/styles/colors";
import { PlusIcon, Tag, Calendar as IconCalendar, Clock, Trash2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/modal";
import { Input } from "@/components/input";
import dayjs from "dayjs";
import { Calendar } from "@/components/calendar";
import { activitiesServer } from "@/server/activities-server";
import { Activity, ActivityProps } from "@/components/activity";
import { Loading } from "@/components/loading";
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Props = {
  tripDetails: TripData
}

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  NEW_ACTIVITY = 2,
}

type TripActivities = {
  title: {
    dayNumber: number
    dayName: string
  }
  data: ActivityProps[]
}

export function Activities({ tripDetails }: Props) {
  // MODAL
  const [showModal, setShowModal] = useState(MODAL.NONE)

  // LOADING
  const [isCreatingActivity, setIsCreatingActivity] = useState(false)
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)

  // DATA
  const [activityTitle, setActivityTitle] = useState("")
  const [activityDate, setActivityDate] = useState("")
  const [activityHour, setActivityHour] = useState("")

  // LISTS
  const [tripActivities, setTripActivities] = useState<TripActivities[]>([])

  // SWIPE
  const openSwipeableRef = useRef<SwipeableMethods | null>(null)

  const handleActivityHourChange = (text: string) => {
    let formattedHour = text.replace(/[^0-9:]/g, "");

    // Se já tiver 2 números e não houver o ":", adicionar o ":"
    if (formattedHour.length > 2 && formattedHour.indexOf(":") === -1) {
      formattedHour = formattedHour.slice(0, 2) + ":" + formattedHour.slice(2, 4);
    }

    setActivityHour(formattedHour)
  }

  function resetNewActivityFields() {
    setActivityDate("")
    setActivityTitle("")
    setActivityHour("")
    setShowModal(MODAL.NONE)
  }

  async function handleCreateTripActivity() {
    try {
      const [hours, minutes] = activityHour.split(":").map((val) => parseInt(val, 10))

      if (!activityTitle || !activityDate || !activityHour) {
        return Alert.alert("Cadastrar atividade", "Preencha todos os campos!")
      }

      setIsCreatingActivity(true)

      await activitiesServer.create({
        tripId: tripDetails.id,
        occurs_at: dayjs(activityDate)
          .set("hour", hours)
          .set("minute", minutes)
          .format("YYYY-MM-DDTHH:mm"),
        title: activityTitle,
      })

      await getTripActivities()
      resetNewActivityFields()
    } catch (error) {
      console.log(error)
    } finally {
      setIsCreatingActivity(false)
    }
  }

  async function getTripActivities() {
    try {
      const activities = await activitiesServer.getActivitiesByTripId(
        tripDetails.id
      )

      const activitiesToSectionList = activities.map((dayActivity) => ({
        title: {
          dayNumber: dayjs(dayActivity.date).date(),
          dayName: dayjs(dayActivity.date).format("dddd").replace("-feira", ""),
        },
        data: dayActivity.activities.map((activity) => ({
          id: activity.id,
          title: activity.title,
          hour: dayjs(activity.occurs_at).format("HH[:]mm[h]"),
          isBefore: dayjs(activity.occurs_at).isBefore(dayjs()),
        })).sort((a, b) => {
          // Converte as horas para um formato numérico para ordenar corretamente
          const [hourA, minuteA] = a.hour.split(":").map((val) => parseInt(val, 10));
          const [hourB, minuteB] = b.hour.split(":").map((val) => parseInt(val, 10));
          return hourA * 60 + minuteA - (hourB * 60 + minuteB); // Compara em minutos
        }),
      }))

      setTripActivities(activitiesToSectionList)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingActivities(false)
    }
  }

  async function handleRemoveActivity(id: string) {
    try {
      await activitiesServer.remove({
        tripId: tripDetails.id,
        id,
      })
      getTripActivities()
    } catch (error) {
      console.log(error)
    }
  }

  function onSwipeableWillOpen(current: SwipeableMethods | null) {
    if (openSwipeableRef.current && openSwipeableRef.current !== current) {
      openSwipeableRef.current.close()
    }

    openSwipeableRef.current = current
  }

  useEffect(() => {
    getTripActivities()
  }, [])

  return (
    <View className="flex-1">
      <View className="w-full flex-row mt-5 mb-2 items-center">
        <Text className="text-zinc-50 text-2xl font-semibold flex-1">
          Atividades
        </Text>

        <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
          <PlusIcon color={colors.lime[950]} />
          <Button.Title>Nova atividade</Button.Title>
        </Button>
      </View>

      {isLoadingActivities ? (
        <Loading />
      ) : (
        <SectionList
          sections={tripActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            let current: SwipeableMethods | null = null
            return (
              <GestureHandlerRootView>
                <Swipeable
                  ref={(swipeable) => (current = swipeable)}
                  containerStyle={{
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.zinc[800],
                    backgroundColor: colors.zinc[900]
                  }}
                  overshootRight={false}
                  friction={2}
                  rightThreshold={10}
                  onSwipeableWillOpen={() => onSwipeableWillOpen(current)}
                  renderRightActions={() => (
                    <TouchableOpacity onPress={() => handleRemoveActivity(item.id)} style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: 48, backgroundColor: '#E83D55', borderTopRightRadius: 12, borderBottomRightRadius: 12 }} activeOpacity={0.6}>
                      <Trash2 color={'#FFF'} size={20} />
                    </TouchableOpacity>
                  )}>
                  <Activity data={item} />
                </Swipeable>
              </GestureHandlerRootView>
            )
          }}
          renderSectionHeader={({ section }) => (
            <View className="w-full mt-6">
              <Text className="text-zinc-50 text-2xl font-semibold">
                Dia {section.title.dayNumber + " "}
                <Text className="text-zinc-500 text-base font-regular capitalize">
                  {section.title.dayName}
                </Text>
              </Text>

              {section.data.length === 0 && (
                <Text className="text-zinc-500 font-regular text-sm my-2.5 ">
                  Nenhuma atividade cadastrada nessa data.
                </Text>
              )}
            </View>
          )}
          contentContainerClassName="gap-3 pb-28"
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={showModal === MODAL.NEW_ACTIVITY}
        title="Cadastrar atividade"
        subtitle="Todos os convidados podem visualizar as atividades"
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="mt-4 mb-3">
          <Input variant="secondary">
            <Tag color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Qual atividade?"
              onChangeText={setActivityTitle}
              value={activityTitle}
            />
          </Input>

          <View className="w-full mt-2 flex-row gap-2">
            <Input variant="secondary" className="flex-1">
              <IconCalendar color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Data"
                onChangeText={setActivityTitle}
                value={
                  activityDate ? dayjs(activityDate).format("DD [de] MMMM") : ""
                }
                onFocus={() => Keyboard.dismiss()}
                showSoftInputOnFocus={false}
                onPressIn={() => setShowModal(MODAL.CALENDAR)}
              />
            </Input>

            <Input variant="secondary" className="w-36">
              <Clock color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Horário"
                onChangeText={handleActivityHourChange
                }
                value={activityHour}
                keyboardType="numeric"
                maxLength={5}
              />
            </Input>
          </View>
        </View>

        <Button
          onPress={handleCreateTripActivity}
          isLoading={isCreatingActivity}
        >
          <Button.Title>Salvar atividade</Button.Title>
        </Button>
      </Modal>

      <Modal
        title="Selecionar data"
        subtitle="Selecione a data da atividade"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => setShowModal(MODAL.NEW_ACTIVITY)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            onDayPress={(day) => setActivityDate(day.dateString)}
            markedDates={{ [activityDate]: { selected: true } }}
            initialDate={tripDetails.starts_at.toString()}
            minDate={tripDetails.starts_at.toString()}
            maxDate={tripDetails.ends_at.toString()}
          />

          <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  )
}