import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../pages/Barbeiro/styles';

type AvaliacaoProps = {
  comentario: string;
  notaInicial: number;
};

export const Avaliacao: React.FC<AvaliacaoProps> = ({ comentario, notaInicial }) => {
  const [nota, setNota] = useState(notaInicial);

  return (
    <View style={styles.avaliacaoContainer}>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <TouchableOpacity key={i} onPress={() => setNota(i + 1)}>
            <Ionicons name={i < nota ? 'star' : 'star-outline'} size={14} color="#FFD700" />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.avaliacaoComentario}>{comentario}</Text>
    </View>
  );
};
