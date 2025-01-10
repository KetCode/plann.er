import { MapPin, Calendar as IconCalendar, Settings2, UserRoundPlus, ArrowRight, AtSign, Mail, User } from "lucide-react-native"
import { View, Text, Image, Keyboard, Alert } from "react-native"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils"
import { validateInput } from "@/utils/validateInput"
import { DateData } from "react-native-calendars"
import { tripServer } from "@/server/trip-server"
import { Calendar } from "@/components/calendar"
import { GuestEmail } from "@/components/email"
import { Loading } from "@/components/loading"
import { tripStorage } from "@/storage/trip"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Modal } from "@/components/modal"
import { colors } from "@/styles/colors"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import dayjs from "dayjs"

enum StepForm {
    TRIP_DETAILS = 1,
    ADD_EMAIL = 2,
}

enum MODAL {
    NONE = 0,
    CALENDAR = 1,
    GUESTS = 2,
    OWNER = 3,
}


export default function Index() {
    const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS)
    const [destination, setDestination] = useState("")

    // DATA
    const [selectedDates, setSelectedDates] = useState({} as DatesSelected)

    // MODAL
    const [showModal, setShowModal] = useState(MODAL.NONE)

    // EMAIL
    const [emailToInvite, setEmailToInvite] = useState("")
    const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

    // OWNER
    const [ownerName, setOwnerName] = useState("")
    const [ownerEmail, setOwnerEmail] = useState("")

    // LOADING
    const [isCreatingTrip, setIsCreatingTrip] = useState(false)
    const [isGettingTrip, setIsGettingTrip] = useState(true)

    function handleNextStepForm() {
        if (destination.trim().length === 0 || !selectedDates.startsAt || !selectedDates.endsAt) {
            return Alert.alert("Detalhes da viagem", "Preencha todos os informações da viagem para seguir.")
        }

        if (destination.length < 4) {
            return Alert.alert("Detalhes da viagem", "O destino deve ter pelo menos 4 caracteres.")
        }

        if (stepForm === StepForm.TRIP_DETAILS) {
            return setStepForm(StepForm.ADD_EMAIL)
        }

        setShowModal(MODAL.OWNER)
    }

    function handleSelectDate(selectedDay: DateData) {
        const dates = calendarUtils.orderStartsAtAndEndsAt({
            startsAt: selectedDates.startsAt,
            endsAt: selectedDates.endsAt,
            selectedDay,
        })

        setSelectedDates(dates)
    }

    function handleRemoveEmail(emailToRemove: string) {
        setEmailsToInvite((prevState) => prevState.filter((email) => email !== emailToRemove))
    }

    function handleAddEmail() {
        if (!validateInput.email(emailToInvite)) {
            return Alert.alert("Convidado", "E-mail inválido!")
        }

        const emailAlreadyExists = emailsToInvite.find(
            (email) => email === emailToInvite
        )

        if (emailAlreadyExists) {
            return Alert.alert("Convidado", "E-mail já foi adicionado!")
        }

        setEmailsToInvite((prevState) => [...prevState, emailToInvite])
        setEmailToInvite("")
    }

    async function saveTrip(tripId: string) {
        try {
            await tripStorage.save(tripId)
            router.navigate("/trip/" + tripId)
        } catch (error) {
            Alert.alert(
                "Salvar viagem",
                "Não foi possível salvar o id da viagem no dispositivo."
            )
            console.log(error)
        }
    }

    async function createTrip() {
        setShowModal(MODAL.NONE)

        try {
            setIsCreatingTrip(true)

            const newTrip = await tripServer.create({
                destination,
                starts_at: dayjs(selectedDates.startsAt?.dateString).toISOString(),
                ends_at: dayjs(selectedDates.endsAt?.dateString).toISOString(),
                owner_name: ownerName,
                owner_email: ownerEmail,
                emails_to_invite: emailsToInvite,
            })

            saveTrip(newTrip.tripId)
        } catch (error) {
            console.log(error)
            setIsCreatingTrip(false)
        }
    }

    async function getTrip() {
        try {
            const tripID = await tripStorage.get()

            if (!tripID) {
                return setIsGettingTrip(false)
            }

            const trip = await tripServer.getById(tripID)

            if (trip) {
                return router.navigate("/trip/" + trip.id)
            }
        } catch (error) {
            setIsGettingTrip(false)
            console.log(error)
        }
    }

    useEffect(() => {
        getTrip()
    }, [])

    if (isGettingTrip) {
        return <Loading />
    }

    return (
        <View className="flex-1 items-center justify-center px-5">
            <Image source={require("@/assets/logo.png")} className="h-8" resizeMode="contain" />

            <Image source={require("@/assets/bg.png")} className="absolute" />
            <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
                Convide seus amigos e planeje sua{"\n"}próxima viagem!
            </Text>
            <View className="w-full bg-zinc-900 px-4 py-3 rounded-lg my-8 border border-zinc-800 gap-1.5">
                <Input>
                    <MapPin color={colors.zinc[400]} size={20} />
                    <Input.Field placeholder="Para onde você vai?" editable={stepForm === StepForm.TRIP_DETAILS} onChangeText={setDestination} value={destination} />
                </Input>

                <Input>
                    <IconCalendar color={colors.zinc[400]} size={20} />
                    <Input.Field placeholder="Quando?" editable={stepForm === StepForm.TRIP_DETAILS} onFocus={() => Keyboard.dismiss()} showSoftInputOnFocus={false} onPressIn={() => stepForm === StepForm.TRIP_DETAILS && setShowModal(MODAL.CALENDAR)} value={selectedDates.formatDatesInText} />
                </Input>

                {stepForm === StepForm.ADD_EMAIL && (
                    <View className="gap-1.5">
                        <View className="border-b pb-3 border-zinc-800">
                            <Button variant="secondary" onPress={() => setStepForm(StepForm.TRIP_DETAILS)}>
                                <Button.Title>Alterar local/data</Button.Title>
                                <Settings2 color={colors.zinc[200]} size={20} />
                            </Button>
                        </View>

                        <Input>
                            <UserRoundPlus color={colors.zinc[400]} size={20} />
                            <Input.Field placeholder="Quem estará na viagem?" autoCorrect={false} value={emailsToInvite.length > 0 ? `${emailsToInvite.length} pessoa(s) convidada(s)` : ""} onPress={() => {
                                Keyboard.dismiss()
                                setShowModal(MODAL.GUESTS)
                            }} showSoftInputOnFocus={false} />
                        </Input>
                    </View>
                )}

                <Button onPress={handleNextStepForm} isLoading={isCreatingTrip}>
                    <Button.Title>{stepForm === StepForm.TRIP_DETAILS ? "Continuar" : "Confirmar Viagem"}</Button.Title>
                    <ArrowRight color={colors.lime[950]} size={20} />
                </Button>
            </View>

            <Text className="text-zinc-500 font-regular text-center text-base">Ao planejar sua viagem pela plann.er você automaticamente concorda com nossos{" "}<Text className="text-zinc-300 underline">termos de uso</Text> e <Text className="text-zinc-300 underline">políticas de privacidade</Text>.</Text>

            <Modal title="Selecionar datas" subtitle="Selecione a data de ida e volta da viagem" visible={showModal === MODAL.CALENDAR} onClose={() => setShowModal(MODAL.NONE)}>
                <View className="gap-4 mt-4">
                    <Calendar minDate={dayjs().toISOString()} onDayPress={handleSelectDate} markedDates={selectedDates.dates} />

                    <Button onPress={() => setShowModal(MODAL.NONE)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>

            <Modal title="Selecionar convidados" subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem." visible={showModal === MODAL.GUESTS} onClose={() => setShowModal(MODAL.NONE)}>
                <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 pt-2 pb-5 items-start">
                    {emailsToInvite.length > 0 ? (emailsToInvite.map((email) => (
                        <GuestEmail key={email} email={email} onRemove={() => handleRemoveEmail(email)} />
                    ))) : (<Text className="text-zinc-600 text-base font-regular">Nenhum e-mail adicionado.</Text>)}
                </View>

                <View className="gap-4 mt-4">
                    <Input variant="secondary">
                        <AtSign color={colors.zinc[400]} size={20} />
                        <Input.Field placeholder="Digite o e-mail do convidado" keyboardType="email-address" onChangeText={(text) => setEmailToInvite(text.toLowerCase())} value={emailToInvite} returnKeyType="send" onSubmitEditing={handleAddEmail} />
                    </Input>

                    <Button onPress={handleAddEmail}>
                        <Button.Title>Convidar</Button.Title>
                    </Button>
                </View>
            </Modal>

            <Modal 
                title="Confirmar criação da viagem" 
                subtitle={
                    <>
                    Para concluir a criação da viagem para <Text className="font-semibold text-zinc-100">{destination}</Text> nas datas de <Text className="font-semibold text-zinc-100">{dayjs(selectedDates.startsAt?.dateString).date()} a{" "}{dayjs(selectedDates.endsAt?.dateString).date()} de{" "}{dayjs(selectedDates.endsAt?.dateString).format("MMMM")} de{" "}{dayjs(selectedDates.endsAt?.dateString).format("YYYY")}</Text> preencha seus dados abaixo:
                    </>
                }
                visible={showModal === MODAL.OWNER} 
                onClose={() => setShowModal(MODAL.NONE)}>

                <View className="gap-4 mt-4">
                    <Input variant="secondary">
                        <User color={colors.zinc[400]} size={20} />
                        <Input.Field placeholder="Seu nome completo" onChangeText={setOwnerName} />
                    </Input>
                    <Input variant="secondary">
                        <Mail color={colors.zinc[400]} size={20} />
                        <Input.Field placeholder="Seu e-mail pessoal" keyboardType="email-address" onChangeText={setOwnerEmail} />
                    </Input>

                    <Button onPress={createTrip}>
                        <Button.Title>Confirmar criação da viagem</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}