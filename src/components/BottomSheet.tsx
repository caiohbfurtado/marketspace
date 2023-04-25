import BottomSheetGorhom, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import {
  Box,
  Center,
  HStack,
  Heading,
  Stack,
  VStack,
  useTheme,
} from 'native-base'
import { X } from 'phosphor-react-native'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Modal, TouchableOpacity, useWindowDimensions } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

type Props = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  renderFooter?: ReactNode | (() => ReactNode)
}

export function BottomSheet({
  isOpen,
  onClose,
  renderFooter: renderFooterProp,
  children,
}: Props) {
  const bottomSheetRef = useRef<BottomSheetGorhom>(null)
  const { width } = useWindowDimensions()
  const snapPoints = useMemo(() => ['50%', '75%', '90%'], [])
  const [index, setIndex] = useState(-1)
  const { colors } = useTheme()

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.forceClose()
    setIndex(-1)
    onClose()
  }, [onClose])

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setIndex(-1)
        bottomSheetRef.current?.forceClose()
        handleClose()
      }
    },
    [handleClose],
  )

  useEffect(() => {
    if (!isOpen && index !== -1) {
      bottomSheetRef.current?.forceClose()
      handleClose()
    }

    if (isOpen && index === -1) {
      bottomSheetRef.current?.collapse()
      setIndex(0)
    }
  }, [handleClose, index, isOpen, onClose])

  const Backdrop = (props: BottomSheetBackdropProps) => {
    return (
      <TouchableOpacity
        style={{ backgroundColor: colors.gray[100], flex: 1, opacity: 0.8 }}
        activeOpacity={0.8}
        onPress={() => bottomSheetRef.current?.close()}
      >
        <BottomSheetBackdrop opacity={0} {...props} />
      </TouchableOpacity>
    )
  }

  const renderFooter = () => {
    return typeof renderFooterProp === 'function'
      ? renderFooterProp()
      : renderFooterProp
  }

  return (
    <Modal animationType="fade" visible={isOpen && index !== -1} transparent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetGorhom
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={index}
          onChange={handleSheetChanges}
          backdropComponent={Backdrop}
          enablePanDownToClose
          handleComponent={null}
        >
          <VStack flex={1} alignItems="center" px={4} borderRadius="2xl">
            <Center p={4}>
              <Box h={1} w={14} backgroundColor="gray.400" opacity={0.3} />
            </Center>

            <HStack w="full" alignItems="center" justifyContent="space-between">
              <Heading fontFamily="heading" color="gray.100" fontSize="xl">
                Filtrar anúncios
              </Heading>

              <TouchableOpacity onPress={handleClose}>
                <X size={24} color={colors.gray[400]} />
              </TouchableOpacity>
            </HStack>

            <BottomSheetScrollView
              contentContainerStyle={{
                backgroundColor: colors.white,
                flex: 1,
              }}
              style={{
                backgroundColor: colors.white,
                width: width - 40,
              }}
              horizontal={false}
            >
              {children}
            </BottomSheetScrollView>
          </VStack>
        </BottomSheetGorhom>
        {renderFooterProp && (
          <Stack w="full" px={6} position="absolute" bottom={8}>
            {renderFooter()}
          </Stack>
        )}
      </GestureHandlerRootView>
    </Modal>
  )
}
