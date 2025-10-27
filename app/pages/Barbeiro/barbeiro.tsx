import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { useLocalSearchParams } from 'expo-router';
import authService, { Usuario } from '../../../src/services/authService';
import { UserContext } from '../../../app/contexts/UserContext';
import { Avaliacao } from '../Avaliacao/avaliacao';

export default function Barbeiro() {
  const params = useLocalSearchParams();
  const barbeiroId = params.id ? Number(params.id) : null;

  const { state: usuarioLogado } = useContext(UserContext); // pega o usuário logado
  const [barbeiro, setBarbeiro] = useState<Usuario | null>(null);
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [loading, setLoading] = useState(true);

  // Avaliações mockadas, já que a API não retorna ainda
  const avaliacoesMockadas = [
    { id: '1', comentario: 'Muito bom, recomendo!', nota: 5 },
    { id: '2', comentario: 'Atendimento excelente', nota: 4 },
  ];

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  if (!barbeiro) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Erro ao carregar perfil do barbeiro</Text>
      </View>
    );
  }

  const abrirWhatsApp = (servico: string) => {
    const telefone = (barbeiro as any).telefone || '5521984028545';
    const mensagem = `Olá! Meu nome é *${usuarioLogado.nome} ${usuarioLogado.sobrenome}* Gostaria de agendar um horário para *${servico}* ✂️`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    Linking.openURL(url).catch(() => {
      alert('Não foi possível abrir o WhatsApp. Verifique se ele está instalado.');
    });
  };

  const servicos = [
    { id: '1', nome: 'Corte masculino', preco: 'R$ 29,90' },
    { id: '2', nome: 'Corte feminino', preco: 'R$ 49,90' },
    { id: '3', nome: 'Barba', preco: 'R$ 19,90' },
  ];

  return (
    <View style={styles.container}>
      {/* Header do barbeiro */}
      <View style={styles.header}>
        <Image
          source={
            (barbeiro as any).avatar
              ? { uri: (barbeiro as any).avatar }
              : require('../../../assets/barber.png')
          }
          style={styles.avatar}
        />
        <View style={styles.infoHeader}>
          <Text style={styles.nome}>
            {barbeiro.nome} {barbeiro.sobrenome}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setNotaSelecionada(i + 1)}>
                <Ionicons
                  name={i < notaSelecionada ? 'star' : 'star-outline'}
                  size={16}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
            <Text style={styles.nota}> {notaSelecionada || '0'}</Text>
          </View>
        </View>
      </View>

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
            <TouchableOpacity style={styles.botaoAgendar} onPress={() => abrirWhatsApp(item.nome)}>
              <Text style={styles.textoBotao}>Agendar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Avaliações mockadas */}
      <Text style={styles.tituloLista}>Avaliações</Text>
      <FlatList
        data={avaliacoesMockadas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Avaliacao comentario={item.comentario} notaInicial={item.nota} />
        )}
      />
    </View>
  );
}
