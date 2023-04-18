import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { useTheme } from 'native-base'
import { House, Tag, SignOut } from 'phosphor-react-native'
import { Fragment } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { CreateAnnouncement } from '../screens/CreateAnnouncement'

import { Home } from '../screens/Home'
import { MyAnnouncements } from '../screens/MyAnnouncements'
import { PreviewAnnouncement } from '../screens/PreviewAnnouncement'
import { EditAnnouncement } from '../screens/EditAnnouncement'
import { useAuth } from '../hooks/useAuth'

const { Navigator, Screen } = createBottomTabNavigator()

type AppRoutesProps = {
  Home: undefined
  MyAnnouncements: undefined
  CreateAnnouncement: undefined
  PreviewAnnouncement: {
    createAnnouncement: boolean
    id?: string
  }
  EditAnnouncement: {
    id: string
  }
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesProps>

export function AppRoutes() {
  const { colors, sizes } = useTheme()
  const { signOut } = useAuth()
  const iconSize = sizes[6]
  const isActiveIconColor = colors.gray[200]

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: isActiveIconColor,
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.gray[700],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <House
              weight={color === isActiveIconColor ? 'bold' : 'regular'}
              color={color}
              size={iconSize}
            />
          ),
        }}
      />
      <Screen
        name="MyAnnouncements"
        component={MyAnnouncements}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Tag
                weight={color === isActiveIconColor ? 'bold' : 'regular'}
                color={color}
                size={iconSize}
              />
            )
          },
        }}
      />
      <Screen
        name="SignOut"
        component={Fragment}
        options={{
          tabBarIcon: () => {
            return <SignOut color={colors.red[300]} size={iconSize} />
          },
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={() => signOut()} />
          ),
        }}
      />
      <Screen
        name="CreateAnnouncement"
        component={CreateAnnouncement}
        options={{
          tabBarButton: () => null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <Screen
        name="PreviewAnnouncement"
        component={PreviewAnnouncement}
        options={{
          tabBarButton: () => null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <Screen
        name="EditAnnouncement"
        component={EditAnnouncement}
        options={{
          tabBarButton: () => null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
    </Navigator>
  )
}
