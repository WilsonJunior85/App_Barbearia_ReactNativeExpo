import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../pages/Barbeiro/styles';

type AvaliacaoProps = {
  comentario: string;
  notaInicial: number;
};

// Componente Avaliacao
// Exibe um conjunto de estrelas interativas e um comentário.
// As estrelas podem ser clicadas para alterar a nota localmente.
export const Avaliacao: React.FC<AvaliacaoProps> = ({ comentario, notaInicial }) => {
  const [nota, setNota] = useState(notaInicial);

  return (
    <View style={styles.avaliacaoContainer}>
      {/* =========================================
          SEÇÃO DAS ESTRELAS DE AVALIAÇÃO
          - Cria 5 estrelas com base em um array de 5 posições.
          - Cada estrela pode ser clicada para alterar a nota.
      ========================================= */}
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <TouchableOpacity key={i} onPress={() => setNota(i + 1)}>
            <Ionicons name={i < nota ? 'star' : 'star-outline'} size={14} color="#FFD700" />
          </TouchableOpacity>
        ))}
      </View>

      {/* =========================================
          SEÇÃO DO COMENTÁRIO
          - Mostra o texto da avaliação feita pelo cliente.
      ========================================= */}
      <Text style={styles.avaliacaoComentario}>{comentario}</Text>
    </View>
  );
};
