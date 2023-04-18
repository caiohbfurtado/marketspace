import AsyncStorage from '@react-native-async-storage/async-storage'

import { USER_STORAGE } from './storageConfig'
import { UserDTO } from '@dtos/UserDTO'

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
}

export async function storageUserGet() {
  const userStringify = await AsyncStorage.getItem(USER_STORAGE)
  const user = JSON.parse(userStringify ?? '{}')

  return user
}

export async function storageUserDelete() {
  await AsyncStorage.removeItem(USER_STORAGE)
}
