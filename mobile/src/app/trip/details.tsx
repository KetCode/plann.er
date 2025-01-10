import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { TripLink, TripLinkProps } from "@/components/tripLink";
import { Participant, ParticipantProps } from "@/components/participant";
import { linksServer } from "@/server/links-server";
import { colors } from "@/styles/colors";
import { validateInput } from "@/utils/validateInput";
import { AtSign, Link2, Plus, Tag, UserCog } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View, Text, Alert, FlatList } from "react-native";
import { participantsServer } from "@/server/participants-server";
import { GuestEmail } from "@/components/email";

export function Details({ tripId }: { tripId: string }) {
    // MODAL
    const [showNewLinkModal, setShowNewLinkModal] = useState(false)
    const [showManageGuestsModal, setShowManageGuestsModal] = useState(false)

    // LOADING
    const [isCreatingLinkTrip, setIsCreatingLinkTrip] = useState(false)

    // LITS
    const [links, setLinks] = useState<TripLinkProps[]>([])
    const [participants, setParticipants] = useState<ParticipantProps[]>([])
    
    // EMAIL
    const [emailToInvite, setEmailToInvite] = useState("")
    const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

    // DATA
    const [linkTitle, setLinkTitle] = useState("")
    const [linkURL, setLinkURL] = useState("")

    function resetNewLinkFields() {
        setLinkTitle("")
        setLinkURL("")
        setShowNewLinkModal(false)
    }

    async function handleCreateTripLink() {
        try {
            if (!linkTitle.trim()) {
                return Alert.alert("Link", "Informe um título para o link.")
            }

            if (!validateInput.url(linkURL.trim())) {
                return Alert.alert("Link", "Link inválido!")
            }

            setIsCreatingLinkTrip(true)

            await linksServer.create({
                tripId,
                title: linkTitle,
                url: linkURL,
            })

            resetNewLinkFields()
            await getTripLinks()
        } catch (error) {
            console.log(error)
        } finally {
            setIsCreatingLinkTrip(false)
        }
    }

    async function handleRemoveEmail(email: string) {
        const updatedParticipants = participants.filter((participant) => participant.email !== email)
        setParticipants(updatedParticipants)

        await participantsServer.remove({
            tripId,
            email
        })
    }

    async function handleAddEmail() {
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

        await participantsServer.inviteNewParticipant({
            tripId,
            name: null,
            email: emailToInvite,
            is_confirmed: false,
            is_owner: false,
        })

        await getTripParticipants()
    }

    async function getTripLinks() {
        try {
            const links = await linksServer.getLinksByTripId(tripId)

            setLinks(links)
        } catch (error) {
            console.log(error)
        }
    }

    async function getTripParticipants() {
        try {
            const participants = await participantsServer.getByTripId(tripId)
            setParticipants(participants)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTripLinks()
        getTripParticipants()
    }, [])

    return (
    <View className="flex-1 mt-6">
        <Text className="text-zinc-50 text-2xl font-semibold mb-5">
            Links importantes
        </Text>

        <View className="h-64">
            {links.length > 0 ? (
                <FlatList
                    data={links}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TripLink data={item} />}
                    contentContainerClassName="gap-4 pb-2"
                />
            ) : (
                <Text className="flex-1 text-zinc-400 font-regular text-base mt-2 mb-6">
                    Nenhum link adicionado.
                </Text>
            )}

            <Button variant="secondary" onPress={() => setShowNewLinkModal(true)} className="mt-2">
                <Plus color={colors.zinc[200]} size={20} />
                <Button.Title>Cadastrar novo link</Button.Title>
            </Button>
        </View>

        <View className="flex-1 border-t border-zinc-800 mt-6 mb-[105px]">
            <Text className="text-zinc-50 text-2xl font-semibold my-5">
                Convidados
            </Text>

            <FlatList
                data={participants}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Participant data={item} />}
                contentContainerClassName="gap-4 pb-2"
            />

            <Button variant="secondary" onPress={() => setShowManageGuestsModal(true)} className="mt-2">
                <UserCog color={colors.zinc[200]} size={20} />
                <Button.Title>Gerenciar convidados</Button.Title>
            </Button>
        </View>

        <Modal
            title="Cadastrar link"
            subtitle="Todos os convidados podem visualizar os links importantes."
            visible={showNewLinkModal}
            onClose={() => setShowNewLinkModal(false)}
        >
            <View className="gap-2 mb-3">
                <Input variant="secondary">
                    <Tag color={colors.zinc[400]} size={20} />
                    <Input.Field placeholder="Título do link" onChangeText={setLinkTitle} />
                </Input>

                <Input variant="secondary">
                    <Link2 color={colors.zinc[400]} size={20} />
                    <Input.Field placeholder="URL" onChangeText={setLinkURL} />
                </Input>
            </View>

            <Button isLoading={isCreatingLinkTrip} onPress={handleCreateTripLink}>
                <Button.Title>Salvar link</Button.Title>
            </Button>
        </Modal>

        <Modal
            title="Selecionar convidados"
            subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
            visible={showManageGuestsModal}
            onClose={() => {
                setShowManageGuestsModal(false)
                getTripParticipants()
            }}
        >
            <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 pt-2 pb-5 items-start">
                {participants.length > 0 ? (participants.map((participant) => (
                    <GuestEmail key={participant.id} email={participant.email} onRemove={() => handleRemoveEmail(participant.email)} />
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
    </View>
    )
}