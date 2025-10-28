import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import authService, { Usuario } from '../../../src/services/authService';
import { UserContext } from '../../../app/contexts/UserContext';
import { Avaliacao } from '../Avaliacao/avaliacao';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = 250;
const FADE_DURATION = 1000; // 1s para fade in/out
const INTERVAL = 4000; // 4s entre imagens

export default function Barbeiro() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const barbeiroId = params.id ? Number(params.id) : null;

  const { state: usuarioLogado } = useContext(UserContext);

  const [barbeiro, setBarbeiro] = useState<Usuario | null>(null);
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const opacity = useRef(new Animated.Value(1)).current;

  const imagensTopo = [
    require('../../../assets/corte1.png'),
    require('../../../assets/corte2.png'),
    require('../../../assets/corte3.png'),
    require('../../../assets/corte4.png'),
  ];

  const avaliacoesMockadas = [
    { id: '1', comentario: 'Muito bom, recomendo!', nota: 5 },
    { id: '2', comentario: 'Atendimento excelente', nota: 4 },
  ];

  const servicos = [
    { id: '1', nome: 'Corte masculino', preco: 'R$ 29,90' },
    { id: '2', nome: 'Corte feminino', preco: 'R$ 49,90' },
    { id: '3', nome: 'Barba', preco: 'R$ 19,90' },
  ];

  // Carregar barbeiro
  useEffect(() => {
    const carregarBarbeiro = async () => {
      if (!barbeiroId) return;
      try {
        const barbeiroApi = await authService.getUsuarioById(barbeiroId);
        setBarbeiro(barbeiroApi);
      } catch (err) {
        console.error('Erro ao carregar barbeiro:', err);
      }
    };
    carregarBarbeiro();
  }, [barbeiroId]);

  // Cross-fade automático
  useEffect(() => {
    const timer = setInterval(() => {
      // Fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(() => {
        // Troca a imagem
        setCurrentIndex((prev) => (prev + 1) % imagensTopo.length);

        // Fade in
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start();
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const abrirWhatsApp = (servico: string) => {
    const telefone = (barbeiro as any)?.telefone || '5521984028545';
    const mensagem = `Olá! Meu nome é *${usuarioLogado.nome} ${usuarioLogado.sobrenome}* Gostaria de agendar um horário para *${servico}* ✂️`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url).catch(() => alert('Não foi possível abrir o WhatsApp.'));
  };

  if (!barbeiro) return <Text>Carregando barbeiro...</Text>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Topo - Slide com cross-fade */}
      <View style={{ height: IMAGE_HEIGHT }}>
        <Animated.Image
          source={imagensTopo[currentIndex]}
          style={{
            width,
            height: IMAGE_HEIGHT,
            opacity,
            position: 'absolute',
          }}
          resizeMode="cover"
        />

        {/* Overlay escuro */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        />

        {/* Botão voltar */}
        <View style={{ position: 'absolute', top: 40, left: 20 }}>
          <TouchableOpacity onPress={() => router.push('/pages/home/home')}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Avatar, nome e estrelas */}
        <View
          style={{ position: 'absolute', bottom: 20, alignSelf: 'center', alignItems: 'center' }}>
          <Image
            source={
              (barbeiro as any)?.avatar
                ? { uri: (barbeiro as any).avatar }
                : require('../../../assets/barber.png')
            }
            style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#fff' }}
          />
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 8 }}>
            {barbeiro.nome} {barbeiro.sobrenome}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setNotaSelecionada(i + 1)}>
                <Ionicons
                  name={i < notaSelecionada ? 'star' : 'star-outline'}
                  size={24}
                  color="#FFD700"
                  style={{ marginHorizontal: 2 }}
                />
              </TouchableOpacity>
            ))}
            <Text style={{ color: '#fff', marginLeft: 6, fontSize: 16 }}>{notaSelecionada}</Text>
          </View>
        </View>
      </View>

      {/* Conteúdo abaixo */}
      <View style={{ padding: 20 }}>
        <Text style={styles.tituloLista}>Lista de serviços</Text>
        {servicos.map((item) => (
          <View key={item.id} style={styles.servicoContainer}>
            <View>
              <Text style={styles.servicoNome}>{item.nome}</Text>
              <Text style={styles.servicoPreco}>{item.preco}</Text>
            </View>
            <TouchableOpacity style={styles.botaoAgendar} onPress={() => abrirWhatsApp(item.nome)}>
              <Text style={styles.textoBotao}>Agendar</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.tituloLista}>Avaliações</Text>
        {avaliacoesMockadas.map((item) => (
          <Avaliacao key={item.id} comentario={item.comentario} notaInicial={item.nota} />
        ))}
      </View>
    </ScrollView>
  );
}
