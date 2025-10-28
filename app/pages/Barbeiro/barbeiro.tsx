import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import authService, { Usuario } from '../../../src/services/authService';
import { UserContext } from '../../../app/contexts/UserContext';
import { Avaliacao } from '../Avaliacao/avaliacao';

// Estilo local para ocupar toda a área do topo
const localStyles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default function Barbeiro() {
  const router = useRouter();
  // CAPTURA DE PARÂMETROS DA ROTA
  const params = useLocalSearchParams();
  const barbeiroId = params.id ? Number(params.id) : null;

  // CONTEXTO DO USUÁRIO LOGADO
  const { state: usuarioLogado } = useContext(UserContext); // pega o usuário logado

  // ESTADOS LOCAIS
  const [barbeiro, setBarbeiro] = useState<Usuario | null>(null);
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [loading, setLoading] = useState(true);

  // AVALIAÇÕES MOCKADAS (simulação)
  const avaliacoesMockadas = [
    { id: '1', comentario: 'Muito bom, recomendo!', nota: 5 },
    { id: '2', comentario: 'Atendimento excelente', nota: 4 },
  ];

  //Slide Topo
  const imagensTopo = [
    require('../../../assets/corte1.png'),
    require('../../../assets/corte2.png'),
    require('../../../assets/corte3.png'),
    require('../../../assets/corte4.png'),
  ];

  // useEffect: Carregar barbeiro pelo ID
  // - Busca os dados do barbeiro pela API
  // - Atualiza o estado e remove o loading
  useEffect(() => {
    const carregarBarbeiro = async () => {
      if (!barbeiroId) return;

      try {
        const barbeiroApi = await authService.getUsuarioById(barbeiroId);
        setBarbeiro(barbeiroApi);
      } catch (err) {
        console.error('Erro ao carregar barbeiro:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarBarbeiro();
  }, [barbeiroId]);

  // EXIBIÇÃO DE CARREGAMENTO
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  // ERRO AO CARREGAR BARBEIRO
  if (!barbeiro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Erro ao carregar perfil do barbeiro</Text>
      </View>
    );
  }

  // FUNÇÃO: Abrir conversa no WhatsApp
  // - Monta mensagem automática com nome do usuário e serviço
  const abrirWhatsApp = (servico: string) => {
    const telefone = (barbeiro as any).telefone || '5521984028545';
    const mensagem = `Olá! Meu nome é *${usuarioLogado.nome} ${usuarioLogado.sobrenome}* Gostaria de agendar um horário para *${servico}* ✂️`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    Linking.openURL(url).catch(() => {
      alert('Não foi possível abrir o WhatsApp. Verifique se ele está instalado.');
    });
  };

  // LISTA DE SERVIÇOS (mock)
  const servicos = [
    { id: '1', nome: 'Corte masculino', preco: 'R$ 29,90' },
    { id: '2', nome: 'Corte feminino', preco: 'R$ 49,90' },
    { id: '3', nome: 'Barba', preco: 'R$ 19,90' },
  ];

  // RENDERIZAÇÃO DO COMPONENTE
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* TOPO AZUL */}
      <View style={styles.Topo}>
        {/* Conteúdo por cima */}
        <View style={styles.Setas}>
          {/* Botão voltar */}
          <TouchableOpacity onPress={() => router.push('/pages/home/home')}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Avatar + Nome + Estrelas */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Image
            source={
              (barbeiro as any).avatar
                ? { uri: (barbeiro as any).avatar }
                : require('../../../assets/barber.png')
            }
            style={[
              styles.avatar,
              { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#fff' },
            ]}
          />
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
            {barbeiro.nome} {barbeiro.sobrenome}
          </Text>

          {/* Estrelas */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setNotaSelecionada(i + 1)}>
                <Ionicons
                  name={i < notaSelecionada ? 'star' : 'star-outline'}
                  size={18}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
            <Text style={{ color: '#fff', marginLeft: 6, fontSize: 14 }}>
              {notaSelecionada || '0'}
            </Text>
          </View>
        </View>
      </View>

      {/* CONTEÚDO BRANCO */}
      <View style={{ flex: 1, padding: 20 }}>
        {/* Lista de serviços */}
        <Text style={styles.tituloLista}>Lista de serviços</Text>
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.servicoContainer}>
              <View>
                <Text style={styles.servicoNome}>{item.nome}</Text>
                <Text style={styles.servicoPreco}>{item.preco}</Text>
              </View>
              <TouchableOpacity
                style={styles.botaoAgendar}
                onPress={() => abrirWhatsApp(item.nome)}>
                <Text style={styles.textoBotao}>Agendar</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Avaliações */}
        <Text style={styles.tituloLista}>Avaliações</Text>
        <FlatList
          data={avaliacoesMockadas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Avaliacao comentario={item.comentario} notaInicial={item.nota} />
          )}
        />
      </View>
    </View>
  );
}
