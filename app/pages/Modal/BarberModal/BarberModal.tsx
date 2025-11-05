import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, Linking } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './styles';
// Contexto global do usuário logado
import { UserContext } from '../../../../app/contexts/UserContext';

export default function BarberModal() {
  const router = useRouter();
  const { servico } = useLocalSearchParams();

  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [modo, setModo] = useState<'date' | 'time'>('date');
  const [confirmado, setConfirmado] = useState(false);

  // Pega o usuário logado do contexto global
  const { state: usuarioLogado } = useContext(UserContext);

  const aoEscolher = (_event: any, valorSelecionado?: Date) => {
    if (valorSelecionado) setDataSelecionada(valorSelecionado);
    setMostrarPicker(false);
  };

  const abrirPicker = (tipo: 'date' | 'time') => {
    setModo(tipo);
    setMostrarPicker(true);
  };

  const confirmarAgendamento = async () => {
    setConfirmado(true);

    const numeroBarbeiro = '5521988447268'; // Coloque aqui o número do barbeiro (ex: 55 + DDD + número)
    const mensagem = `Olá! Meu nome é *${usuarioLogado.nome} ${usuarioLogado.sobrenome}* e gostaria de agendar um horário para *${servico || 'serviço'}* no dia *${dataSelecionada.toLocaleDateString()}* às *${dataSelecionada.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}*.`;

    const url = `https://wa.me/${numeroBarbeiro}?text=${encodeURIComponent(mensagem)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('Não foi possível abrir o WhatsApp.');
      }
    } catch (error) {
      console.error('Erro ao abrir o WhatsApp:', error);
    }

    setTimeout(() => {
      router.back();
    }, 1500);
  };

  return (
    <Modal animationType="slide" transparent visible>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Agendar {servico ? `(${servico})` : ''}</Text>

          <Text style={styles.label}>Data selecionada:</Text>
          <Text style={styles.valor}>{dataSelecionada.toLocaleDateString()}</Text>

          <Text style={styles.label}>Horário selecionado:</Text>
          <Text style={styles.valor}>
            {dataSelecionada.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>

          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botao} onPress={() => abrirPicker('date')}>
              <Text style={styles.textoBotao}>Escolher Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => abrirPicker('time')}>
              <Text style={styles.textoBotao}>Escolher Hora</Text>
            </TouchableOpacity>
          </View>

          {mostrarPicker && (
            <DateTimePicker
              value={dataSelecionada}
              mode={modo}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={aoEscolher}
            />
          )}

          <TouchableOpacity style={[styles.botao, styles.confirmar]} onPress={confirmarAgendamento}>
            <Text style={styles.textoBotao}>Confirmar e Enviar no WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelar}>Cancelar</Text>
          </TouchableOpacity>

          {confirmado && <Text style={styles.sucesso}>✅ Agendamento confirmado!</Text>}
        </View>
      </View>
    </Modal>
  );
}
