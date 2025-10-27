import '../global.css';

import { Stack } from 'expo-router';
import { UserProvider } from '../app/contexts/UserContext';

export default function Layout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="home" />
        <Stack.Screen name="barbeiro" />
      </Stack>
    </UserProvider>
  );
}
