import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import authService, { Usuario } from '../../../src/services/authService';
// import { UserContext } from '../../../app/contexts/UserContext';
import { Avaliacao } from '../Avaliacao/avaliacao';
import BarberModal from '../../../components/Modal/BarberModal/BarberModal';

// const { width } = Dimensions.get('window');
// const IMAGE_HEIGHT = 250;
const FADE_DURATION = 1000;
const INTERVAL = 4000;

export default function Barbeiro() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const barbeiroId = params.id ? Number(params.id) : null;

  // const { state: usuarioLogado } = useContext(UserContext);

  const [barbeiro, setBarbeiro] = useState<Usuario | null>(null);
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false); // controla modal
  const [servicoSelecionado, setServicoSelecionado] = useState<string | null>(null);

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

  // 🔹 Carrega os dados do barbeiro real
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

  // 🔹 Efeito de troca automática das imagens do topo
  useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => (prev + 1) % imagensTopo.length);
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start();
      });
    }, INTERVAL);
    return () => clearInterval(timer);
  });

  if (!barbeiro) return <Text>Carregando barbeiro...</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* TOPO - Slider de imagens */}
      <View style={styles.topoContainer}>
        <Animated.Image
          source={imagensTopo[currentIndex]}
          style={[styles.imagemTopo, { opacity }]}
          resizeMode="cover"
        />
        <View style={styles.overlay} />

        {/* Botão voltar */}
        <View style={styles.botaoVoltar}>
          <TouchableOpacity onPress={() => router.push('/pages/home/home')}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Cabeçalho com nome e estrelas */}
        <View style={styles.header}>
          <Image
            source={
              (barbeiro as any)?.avatar
                ? { uri: (barbeiro as any).avatar }
                : require('../../../assets/barber.png')
            }
            style={styles.avatar}
          />
          <Text style={styles.nome}>
            {barbeiro.nome} {barbeiro.sobrenome}
          </Text>

          <View style={styles.avaliacao}>
            {Array.from({ length: 5 }).map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setNotaSelecionada(i + 1)}>
                <Ionicons
                  name={i < notaSelecionada ? 'star' : 'star-outline'}
                  size={24}
                  color="#FFD700"
                  style={styles.estrela}
                />
              </TouchableOpacity>
            ))}
            <Text style={styles.nota}>{notaSelecionada}</Text>
          </View>
        </View>
      </View>

      {/* CONTEÚDO */}
      <View style={styles.conteudo}>
        <Text style={styles.tituloLista}>Lista de serviços</Text>

        {servicos.map((item) => (
          <View key={item.id} style={styles.servicoContainer}>
            <View>
              <Text style={styles.servicoNome}>{item.nome}</Text>
              <Text style={styles.servicoPreco}>{item.preco}</Text>
            </View>

            {/* ✅ Abre a modal passando nome e avatar do barbeiro */}
            <TouchableOpacity
              style={styles.botaoAgendar}
              onPress={() => {
                setServicoSelecionado(item.nome);
                setMostrarModal(true);
              }}>
              <Text style={styles.textoBotao}>Agendar</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.tituloLista}>Avaliações</Text>
        {avaliacoesMockadas.map((item) => (
          <Avaliacao key={item.id} comentario={item.comentario} notaInicial={item.nota} />
        ))}
      </View>

      {/* ✅ Modal com dados reais do barbeiro */}
      {mostrarModal && (
        <BarberModal
          servico={servicoSelecionado || undefined}
          barbeiroNome={`${barbeiro.nome} ${barbeiro.sobrenome}`}
          barbeiroAvatar={(barbeiro as any)?.avatar || null}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </ScrollView>
  );
}
