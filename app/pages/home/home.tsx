import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import authService, { Usuario as UsuarioAPI } from '../../../src/services/authService';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ListRenderItem,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import BottomMenu from '../../../components/BottomMenu';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const barbeiros = [
  { id: '1', nome: 'Cesar Bastos', avaliacao: 4.7 },
  { id: '2', nome: 'Henrique Gandini', avaliacao: 4.7 },
  { id: '3', nome: 'Wilson Júnior', avaliacao: 4.7 },
  { id: '4', nome: 'Renan Castilho', avaliacao: 4.7 },
];

export default function Home() {
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [locationText, setLocationText] = useState<string>('Carregando localização...');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const router = useRouter();

  // Usuário logado (único)
  const [usuarios, setUsuarios] = useState<UsuarioCard[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioCard | null>(null);

  // Lista de outros usuários/barbeiros
  // const [usuario, setUsuario] = useState<Usuario[] | null>(null);

  // type Usuario = {
  //   id: number;
  //   nome: string;
  //   sobrenome: string;
  //   email: string;
  //   // avaliacao: number; // se quiser mostrar estrelas
  // };

  type UsuarioCard = {
    id: number;
    nome: string;
    sobrenome: string;
  };

  type Barbeiro = {
    id: string;
    nome: string;
    avaliacao: number;
  };

  type AvaliacaoItem = {
    id: string;
    comentario: string;
    nota: number;
  };

  const pagePerfil = () => {
    // Navega para a tela de cadastro
    router.push('/pages/Barbeiro/barbeiro');
  };

  // Função: buscar endereço digitado
  const buscarLocalDigitado = async () => {
    if (!locationText.trim()) return;

    try {
      const resultados = await Location.geocodeAsync(locationText);
      if (resultados.length > 0) {
        const local = resultados[0];
        setLocation({
          latitude: local.latitude,
          longitude: local.longitude,
        });
      } else {
        alert('Local não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar local:', error);
      alert('Erro ao buscar local');
    }
  };

  // Pega localização
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

      // Converte para endereço legível
      const [endereco] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (endereco) {
        const texto = `${endereco.city || ''} ${endereco.region || ''}`.trim();
        setLocationText(texto || 'Localização encontrada');
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setLocationText('Erro ao obter localização');
    }
  };

  // Pega localização atual ao abrir
  useEffect(() => {
    async function obterLocalizacao() {
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

        if (endereco) {
          const texto = `${endereco.city || ''} ${endereco.region || ''}`.trim();
          setLocationText(texto || 'Localização encontrada');
        }
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        setLocationText('Erro ao obter localização');
      }
    }

    obterLocalizacao();

    // Carrega usuário salvo
    async function carregarDados() {
      // Usuário logado
      const userData = await AsyncStorage.getItem('@usuario');
      if (userData) setUsuarioLogado(JSON.parse(userData));

      // Lista de usuários da API
      try {
        const usuariosAPI: UsuarioAPI[] = await authService.getUsuarios();
        // Map para pegar apenas nome e sobrenome
        const usuariosCard: UsuarioCard[] = usuariosAPI.map((u) => ({
          id: u.id,
          nome: u.nome,
          sobrenome: (u as any).sobrenome || '',
        }));
        setUsuarios(usuariosCard);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
      }

      // Localização
      await obterLocalizacao();
    }

    carregarDados();
  }, []);

  const barbeiros = [
    { id: '1', nome: 'Cesar Bastos', avaliacao: 4.7 },
    { id: '2', nome: 'Henrique Gandini', avaliacao: 4.7 },
    { id: '3', nome: 'Wilson Júnior', avaliacao: 4.7 },
    { id: '4', nome: 'Renan Castilho', avaliacao: 4.7 },
  ];

  //CARREGAR ITEMS
  // const renderItem: ListRenderItem<Barbeiro> = ({ item }) => (
  //   <View style={styles.card}>
  //     <View style={styles.avatar}></View>
  //     <View style={styles.info}>
  //       <Text style={styles.nome}>{item.nome}</Text>
  //       <View style={styles.avaliacao}>
  //         {Array.from({ length: 5 }).map((_, i) => (
  //           <TouchableOpacity key={i} onPress={() => setNotaSelecionada(i + 1)}>
  //             <Ionicons
  //               name={i < notaSelecionada ? 'star' : 'star-outline'}
  //               size={16}
  //               color="#FFD700"
  //             />
  //           </TouchableOpacity>
  //         ))}
  //         <Text style={styles.nota}>{item.avaliacao}</Text>
  //       </View>
  //       <TouchableOpacity style={styles.botao} onPress={pagePerfil}>
  //         <Text style={styles.textoBotao}>Ver Perfil</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  const emoji = '✂️';

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {usuarioLogado?.nome}, encontre o seu barbeiro favorito {emoji}
      </Text>

      {/* Campo de localização editável */}
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

      {/* Mapa */}
      {location && (
        <MapView
          style={{
            width: width - 32,
            height: height * 0.25,
            borderRadius: 10,
            marginBottom: 16,
          }}
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
        data={barbeiros} // array com todos os usuários
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}></View>
            <View style={styles.info}>
              <Text style={styles.nome}>
                {/* {item.nome} {item.nome} */}
                {item.nome}
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
              <TouchableOpacity style={styles.botao} onPress={pagePerfil}>
                <Text style={styles.textoBotao}>Ver Perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <BottomMenu />
    </View>
  );
}
