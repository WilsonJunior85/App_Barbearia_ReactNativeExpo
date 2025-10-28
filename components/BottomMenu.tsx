import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function BottomMenu() {
  const router = useRouter();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 4,
        elevation: 5,
      }}>
      {/* Ícone Home */}
      <TouchableOpacity onPress={() => router.push('/pages/home/home')}>
        <Image
          source={require('../assets/home.png')}
          style={{ width: 26, height: 26, tintColor: '#4EADBE' }}
        />
      </TouchableOpacity>

      {/* Ícone Agenda */}
      <TouchableOpacity onPress={() => router.push('/pages/TabBar/Busca/Busca')}>
        <Image
          source={require('../assets/search.png')}
          style={{ width: 26, height: 26, tintColor: '#4EADBE' }}
        />
      </TouchableOpacity>

      {/* Botão central destacado */}
      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          backgroundColor: '#4EADBE',
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: -25,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 8,
        }}
        onPress={() => router.push('/pages/TabBar/Appointments/Appointments')}>
        <Image
          source={require('../assets/today.png')}
          style={{ width: 28, height: 28, tintColor: '#fff' }}
        />
      </TouchableOpacity>

      {/* Ícone Favoritos */}
      <TouchableOpacity onPress={() => router.push('/pages/TabBar/Favorites/Favorites')}>
        <Image
          source={require('../assets/favorite_full.png')}
          style={{ width: 26, height: 26, tintColor: '#4EADBE' }}
        />
      </TouchableOpacity>

      {/* Ícone Perfil */}
      <TouchableOpacity onPress={() => router.push('/pages/TabBar/Profile/Profile')}>
        <Image
          source={require('../assets/account.png')}
          style={{ width: 26, height: 26, tintColor: '#4EADBE' }}
        />
      </TouchableOpacity>
    </View>
  );
}
