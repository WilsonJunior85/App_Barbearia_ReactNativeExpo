import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { Avaliacao } from '../Avaliacao/avaliacao';

type Servico = {
  id: string;
  nome: string;
  preco: string;
};

type AvaliacaoItem = {
  id: string;
  comentario: string;
  nota: number;
};

const barbeiro = {
  nome: 'Henrique Gandini',
  avatar: require('../../../assets/barber.png'),
  servicos: [
    { id: '1', nome: 'Corte masculino', preco: 'R$ 29,90' },
    { id: '2', nome: 'Corte feminino', preco: 'R$ 49,90' },
    { id: '3', nome: 'Barba', preco: 'R$ 19,90' },
  ],
  avaliacoes: [
    {
      id: '1',
      comentario: 'Muito bom este cortador, muito educado e atencioso. Recomendo demais!',
      nota: 5,
    },
  ],
};

export default function Barbeiro() {
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [avaliacoes] = useState<AvaliacaoItem[]>(barbeiro.avaliacoes);

  const renderServico = ({ item }: { item: Servico }) => (
    <View style={styles.servicoContainer}>
      <View>
        <Text style={styles.servicoNome}>{item.nome}</Text>
        <Text style={styles.servicoPreco}>{item.preco}</Text>
      </View>
      <TouchableOpacity style={styles.botaoAgendar}>
        <Text style={styles.textoBotao}>Agendar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header com avatar e nome */}
      <View style={styles.header}>
        <Image source={barbeiro.avatar} style={styles.avatar} />
        <View style={styles.infoHeader}>
          <Text style={styles.nome}>{barbeiro.nome}</Text>

          {/* Estrelas clicáveis no cabeçalho */}
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

        <TouchableOpacity style={styles.favorito}>
          <Ionicons name="heart-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Lista de serviços */}
      <Text style={styles.tituloLista}>Lista de serviços</Text>
      <FlatList
        data={barbeiro.servicos}
        keyExtractor={(item) => item.id}
        renderItem={renderServico}
        style={{ marginBottom: 20 }}
      />

      {/* Avaliações (agora com componente separado) */}
      <Text style={styles.tituloLista}>Avaliações</Text>
      <FlatList
        data={avaliacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Avaliacao comentario={item.comentario} notaInicial={item.nota} />
        )}
      />
    </View>
  );
}
