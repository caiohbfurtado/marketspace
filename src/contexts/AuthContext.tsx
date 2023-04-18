/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-catch */
import { createContext, ReactNode, useEffect, useState } from 'react'
import { UserDTO } from '../dtos/UserDTO'
import { api } from '../services/api'
import {
  storageAuthTokenDelete,
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '../storage/storageAuthToken'
import {
  storageUserDelete,
  storageUserGet,
  storageUserSave,
} from '../storage/storageUser'

type StorageAuthProps = {
  user: UserDTO
  token: string
}

type SignInProps = {
  email: string
  password: string
}

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (data: SignInProps) => Promise<void>
  signOut: () => void
  refreshedToken: string
  isLoadingStoragedUserData: boolean
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [refreshedToken, setRefreshedToken] = useState('')
  const [isLoadingStoragedUserData, setIsLoadingStoragedUserData] =
    useState(true)

  async function getUser() {
    try {
      setIsLoadingStoragedUserData(true)
      const storagedUser = await storageUserGet()
      const token = await storageAuthTokenGet()

      if (token) {
        userAndTokenUpdate({ user: storagedUser, token })
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingStoragedUserData(false)
    }
    const userStoraged: UserDTO = await storageUserGet()

    setUser(userStoraged)
  }

  async function userAndTokenUpdate({
    user: userData,
    token,
  }: StorageAuthProps) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    setUser(userData)
  }

  function refreshedTokenUpdated(newToken: string) {
    setRefreshedToken(newToken)
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager({
      signOut,
      refreshedTokenUpdated,
    })

    return () => {
      subscribe()
    }
  }, [signOut])

  async function storageUserAndTokenSave({
    user: userData,
    token,
  }: StorageAuthProps) {
    try {
      setIsLoadingStoragedUserData(true)
      await storageUserSave(userData)
      await storageAuthTokenSave(token)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingStoragedUserData(false)
    }
  }

  async function signIn({ email, password }: SignInProps) {
    try {
      const { data } = await api.post('/sessions', {
        email,
        password,
      })

      if (data.user && data.token) {
        setIsLoadingStoragedUserData(true)
        await storageUserAndTokenSave({ user: data.user, token: data.token })

        userAndTokenUpdate(data)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingStoragedUserData(false)
    }
  }

  async function signOut() {
    try {
      setIsLoadingStoragedUserData(true)
      await storageUserDelete()
      await storageAuthTokenDelete()

      setUser({} as UserDTO)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingStoragedUserData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        isLoadingStoragedUserData,
        signOut,
        refreshedToken,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
