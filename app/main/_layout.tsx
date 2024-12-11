import { SafeAreaView } from 'react-native'
import { Stack, Redirect } from 'expo-router'
import { userAtom } from '@/utils/atoms/userAtom'
import { useAtomValue } from 'jotai'

export default function Main() {
  const user = useAtomValue(userAtom)

  if (!user) {
    return <Redirect href="/" />
  }

  return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#191919", height: "100%"},
          animation: "default"
        }}
      ></Stack>
  )
}