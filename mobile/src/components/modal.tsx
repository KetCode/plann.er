import { X } from "lucide-react-native"
import {
  View,
  Text,
  ModalProps,
  ScrollView,
  Modal as RNModal,
  TouchableOpacity,
} from "react-native"
import { ReactNode } from "react"
import { BlurView } from "expo-blur"

import { colors } from "@/styles/colors"

type Props = ModalProps & {
  title: string
  subtitle?: ReactNode
  onClose?: () => void
}

export function Modal({
  title,
  subtitle = "",
  onClose,
  children,
  ...rest
}: Props) {
  return (
    <RNModal transparent animationType="slide" {...rest}>
      <BlurView
        className="flex-1"
        intensity={7}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
      >
        <View className="flex-1 justify-center bg-black/60">
          <View className="bg-zinc-900 px-6 py-5 rounded-lg m-3">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row justify-between items-center">
                <Text className="text-white font-medium text-xl">{title}</Text>

                {onClose && (
                  <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
                    <X color={colors.zinc[400]} size={20} />
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-zinc-400 font-regular text-sm leading-6 my-2">
                {subtitle}
              </Text>

              {children}
            </ScrollView>
          </View>
        </View>
      </BlurView>
    </RNModal>
  )
}
