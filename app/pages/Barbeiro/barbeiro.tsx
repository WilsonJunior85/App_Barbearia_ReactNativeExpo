// Importações principais do React e React Native
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
  Modal,
} from 'react-native';

// Ícones do pacote Expo (usados para estrelas e botão voltar)
import { Ionicons } from '@expo/vector-icons';

// Importa o arquivo de estilos centralizado
import { styles } from './styles';

// Importa utilitários do Expo Router (para navegação)
import { useLocalSearchParams, useRouter } from 'expo-router';

// Serviço de autenticação e model do usuário
import authService, { Usuario } from '../../../src/services/authService';

// Contexto global do usuário logado
import { UserContext } from '../../../app/contexts/UserContext';

// Componente reutilizável que exibe uma avaliação individual
import { Avaliacao } from '../Avaliacao/avaliacao';

// Constantes globais de layout e animação
const { width } = Dimensions.get('window'); // Largura da tela
const IMAGE_HEIGHT = 250; // Altura fixa do banner superior
const FADE_DURATION = 1000; // Tempo do fade in/out (1s)
const INTERVAL = 4000; // Tempo de troca entre imagens (4s)

export default function Barbeiro() {
  // Hook para navegação entre telas
  const router = useRouter();

  // Obtém parâmetros da URL (ex: id do barbeiro)
  const params = useLocalSearchParams();
  const barbeiroId = params.id ? Number(params.id) : null;

  // Pega o usuário logado do contexto global
  const { state: usuarioLogado } = useContext(UserContext);

  // Estados locais do componente
  const [barbeiro, setBarbeiro] = useState<Usuario | null>(null); // Dados do barbeiro
  const [notaSelecionada, setNotaSelecionada] = useState(0); // Estrelas clicadas
  const [currentIndex, setCurrentIndex] = useState(0); // Índice atual da imagem no slider

  // const [agendarServico, setAgendarServico] = useState(null);
  // const [showModal, setShowModal] = useState(false); // Vai controlar a exibição do modal

  // Valor animado para o efeito de fade entre imagens
  const opacity = useRef(new Animated.Value(1)).current;

  // Imagens do topo (banner que alterna automaticamente)
  const imagensTopo = [
    require('../../../assets/corte1.png'),
    require('../../../assets/corte2.png'),
    require('../../../assets/corte3.png'),
    require('../../../assets/corte4.png'),
  ];

  // Avaliações de exemplo (mockadas)
  const avaliacoesMockadas = [
    { id: '1', comentario: 'Muito bom, recomendo!', nota: 5 },
    { id: '2', comentario: 'Atendimento excelente', nota: 4 },
  ];

  // Lista fixa de serviços oferecidos
  const servicos = [
    { id: '1', nome: 'Corte masculino', preco: 'R$ 29,90' },
    { id: '2', nome: 'Corte feminino', preco: 'R$ 49,90' },
    { id: '3', nome: 'Barba', preco: 'R$ 19,90' },
  ];

  /**
   * useEffect para carregar os dados do barbeiro ao abrir a tela.
   * Usa o ID vindo por parâmetro e faz a chamada à API.
   */
  useEffect(() => {
    const carregarBarbeiro = async () => {
      if (!barbeiroId) return;
      try {
        const barbeiroApi = await authService.getUsuarioById(barbeiroId);
        setBarbeiro(barbeiroApi); // Salva o barbeiro no estado
      } catch (err) {
        console.error('Erro ao carregar barbeiro:', err);
      }
    };
    carregarBarbeiro();
  }, [barbeiroId]);

  /**
   * useEffect responsável pelo slide automático de imagens.
   * Faz o fade out/in entre as imagens a cada INTERVAL milissegundos.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      // Inicia fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(() => {
        // Troca a imagem quando o fade termina
        setCurrentIndex((prev) => (prev + 1) % imagensTopo.length);

        // Inicia o fade in
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start();
      });
    }, INTERVAL);

    // Limpa o timer ao desmontar o componente
    return () => clearInterval(timer);
  });

  /**
   * Função que abre o WhatsApp com mensagem pré-formatada
   * contendo o nome do usuário e o serviço escolhido.
   */
  const abrirWhatsApp = (servico: string) => {
    const telefone = (barbeiro as any)?.telefone || '5521984028545'; // fallback padrão
    const mensagem = `Olá! Meu nome é *${usuarioLogado.nome} ${usuarioLogado.sobrenome}* Gostaria de agendar um horário para *${servico}* ✂️`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url).catch(() => alert('Não foi possível abrir o WhatsApp.'));
  };

  // Enquanto os dados do barbeiro não carregam, mostra mensagem simples
  if (!barbeiro) return <Text>Carregando barbeiro...</Text>;

  /**
   * Renderização principal da tela
   * (ScrollView para permitir rolagem do conteúdo)
   */
  return (
    <ScrollView style={styles.container}>
      {/* TOPO - Slider de imagens com efeito de fade */}
      <View style={styles.topoContainer}>
        {/* Imagem animada com fade */}
        <Animated.Image
          source={imagensTopo[currentIndex]}
          style={[styles.imagemTopo, { opacity }]}
          resizeMode="cover"
        />

        {/* Overlay escuro para contraste do texto */}
        <View style={styles.overlay} />

        {/* Botão voltar para a tela anterior */}
        <View style={styles.botaoVoltar}>
          <TouchableOpacity onPress={() => router.push('/pages/home/home')}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Cabeçalho: avatar, nome e estrelas */}
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

          {/* Estrelas de avaliação clicáveis */}
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

      {/* CONTEÚDO INFERIOR */}
      <View style={styles.conteudo}>
        {/* Seção de serviços */}
        <Text style={styles.tituloLista}>Lista de serviços</Text>

        {servicos.map((item, key) => (
          <View key={item.id} style={styles.servicoContainer}>
            <View>
              <Text style={styles.servicoNome}>{item.nome}</Text>
              <Text style={styles.servicoPreco}>{item.preco}</Text>
            </View>
            {/* Botão de agendamento via WhatsApp */}
            {/* <TouchableOpacity style={styles.botaoAgendar} onPress={() => abrirWhatsApp(item.nome)}> */}
            <TouchableOpacity
              style={styles.botaoAgendar}
              onPress={() =>
                router.push({
                  pathname: '/pages/Modal/BarberModal/BarberModal',
                  params: { servico: item.nome },
                })
              }>
              <Text style={styles.textoBotao}>Agendar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Seção de avaliações */}
        <Text style={styles.tituloLista}>Avaliações</Text>

        {/* Renderiza avaliações mockadas usando o componente Avaliacao */}
        {avaliacoesMockadas.map((item) => (
          <Avaliacao key={item.id} comentario={item.comentario} notaInicial={item.nota} />
        ))}
      </View>
    </ScrollView>
  );
}
