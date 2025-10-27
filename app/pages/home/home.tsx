import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import BottomMenu from '../../../components/BottomMenu';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import authService, { Usuario } from '../../../src/services/authService';

const { width, height } = Dimensions.get('window');

type Barbeiro = {
  id: number;
  nome: string;
  sobrenome: string;
  avaliacao: number;
};

export default function Home() {
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [locationText, setLocationText] = useState<string>('Carregando localização...');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [usuarios, setUsuarios] = useState<Barbeiro[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);

  const router = useRouter();
  const emoji = '✂️';

  const pagePerfil = (usuarioId: number) => {
    router.push(`/pages/Barbeiro/barbeiro?id=${usuarioId}`);
  };

  const buscarLocalDigitado = async () => {
    if (!locationText.trim()) return;
    try {
      const resultados = await Location.geocodeAsync(locationText);
      if (resultados.length > 0) {
        const local = resultados[0];
        setLocation({ latitude: local.latitude, longitude: local.longitude });
      } else alert('Local não encontrado');
    } catch (error) {
      console.error('Erro ao buscar local:', error);
      alert('Erro ao buscar local');
    }
  };

  const obterLocalizacao = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('Permissão negada');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const coords = position.coords;
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });

      const [endereco] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      setLocationText(
        `${endereco.city || ''} ${endereco.region || ''}`.trim() || 'Localização encontrada'
      );
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setLocationText('Erro ao obter localização');
    }
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        const userData = await AsyncStorage.getItem('@usuario');
        if (userData) setUsuarioLogado(JSON.parse(userData));

        const usuariosAPI: Usuario[] = await authService.getUsuarios();
        const barbeiros: Barbeiro[] = usuariosAPI.map((u) => ({
          id: u.id,
          nome: u.nome,
          sobrenome: u.sobrenome || '',
          avaliacao: 4.7,
        }));
        setUsuarios(barbeiros);

        await obterLocalizacao();
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setLocationText('Erro ao obter localização');
      }
    }
    carregarDados();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {usuarioLogado?.nome}, encontre o seu barbeiro favorito {emoji}
      </Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua localização..."
          value={locationText}
          onChangeText={setLocationText}
        />
        <TouchableOpacity onPress={buscarLocalDigitado}>
          <Ionicons name="search-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {location && (
        <MapView
          style={{ width: width - 32, height: height * 0.25, borderRadius: 10, marginBottom: 16 }}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker coordinate={location} title="Local selecionado" />
        </MapView>
      )}

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}></View>
            <View style={styles.info}>
              <Text style={styles.nome}>
                {item.nome} {item.sobrenome}
              </Text>
              <View style={styles.avaliacao}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => setNotaSelecionada(i + 1)}>
                    <Ionicons
                      name={i < item.avaliacao ? 'star' : 'star-outline'}
                      size={16}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
                <Text style={styles.nota}>{item.avaliacao}</Text>
              </View>
              <TouchableOpacity style={styles.botao} onPress={() => pagePerfil(item.id)}>
                <Text style={styles.textoBotao}>Ver Perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={{ flexGrow: 0, maxHeight: height * 0.35 }}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <BottomMenu />
    </View>
  );
}
