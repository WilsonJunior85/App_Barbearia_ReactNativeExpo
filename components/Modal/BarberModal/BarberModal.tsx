import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, Linking, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { UserContext } from '../../../app/contexts/UserContext';

interface BarberModalProps {
  servico?: string;
  barbeiroNome?: string;
  barbeiroAvatar?: string; // URL da imagem
  onClose: () => void;
}

export default function BarberModal({
  servico,
  barbeiroNome,
  barbeiroAvatar,
  onClose,
}: BarberModalProps) {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [modo, setModo] = useState<'date' | 'time'>('date');
  const [confirmado, setConfirmado] = useState(false);

  const { state: usuarioLogado } = useContext(UserContext);

  // Atualiza a data/hora escolhida
  const aoEscolher = (_event: any, valorSelecionado?: Date) => {
    if (valorSelecionado) setDataSelecionada(valorSelecionado);
    setMostrarPicker(false);
  };

  // Mostra o seletor de data ou hora
  const abrirPicker = (tipo: 'date' | 'time') => {
    setModo(tipo);
    setMostrarPicker(true);
  };

  // Confirma agendamento e abre WhatsApp
  const confirmarAgendamento = async () => {
    setConfirmado(true);

    const numeroBarbeiro = '5521988447268';
    const mensagem = `Olá! Meu nome é ${usuarioLogado.nome} ${usuarioLogado.sobrenome} e gostaria de agendar um horário com ${barbeiroNome || 'o barbeiro'} para ${servico || 'serviço'} no dia ${dataSelecionada.toLocaleDateString()} às ${dataSelecionada.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;

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
      onClose();
    }, 1500);
  };

  return (
    <Modal animationType="slide" transparent visible>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Seta de voltar */}
          <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 15, left: 15 }}>
            <Ionicons name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>

          {/* Cabeçalho: Avatar + Nome do barbeiro */}
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Image
              source={
                barbeiroAvatar ? { uri: barbeiroAvatar } : require('../../../assets/barber.png')
              }
              style={styles.avatar}
            />
            <Text style={styles.nome}>{barbeiroNome || 'Barbeiro'}</Text>
          </View>

          {/* Título */}
          <Text style={[styles.titulo, { marginTop: 20 }]}>
            Agendar {servico ? `(${servico})` : ''}
          </Text>

          {/* Data e hora selecionadas */}
          <Text style={styles.label}>Data selecionada:</Text>
          <Text style={styles.valor}>{dataSelecionada.toLocaleDateString()}</Text>

          <Text style={styles.label}>Horário selecionado:</Text>
          <Text style={styles.valor}>
            {dataSelecionada.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          {/* Botões de escolha de data/hora */}
          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botao} onPress={() => abrirPicker('date')}>
              <Text style={styles.textoBotao}>Escolher Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => abrirPicker('time')}>
              <Text style={styles.textoBotao}>Escolher Hora</Text>
            </TouchableOpacity>
          </View>

          {/* Picker nativo */}
          {mostrarPicker && (
            <DateTimePicker
              value={dataSelecionada}
              mode={modo}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={aoEscolher}
            />
          )}

          {/* Botão principal */}
          <TouchableOpacity style={[styles.botao, styles.confirmar]} onPress={confirmarAgendamento}>
            <Text style={styles.textoBotao}>Confirmar e Enviar no WhatsApp</Text>
          </TouchableOpacity>

          {/* Mensagem de sucesso */}
          {confirmado && <Text style={styles.sucesso}>Agendamento confirmado!</Text>}
        </View>
      </View>
    </Modal>
  );
}
