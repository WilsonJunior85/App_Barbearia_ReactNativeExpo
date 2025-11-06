import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { UserContext } from '../../../contexts/UserContext';
import BottomMenu from '../../../../components/BottomMenu';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export default function Profile() {
  const { state: user, dispatch } = useContext(UserContext);
  const router = useRouter();

  const [nome, setNome] = useState(user.nome || '');
  const [telefone, setTelefone] = useState(user.telefone || '');
  const [sexo, setSexo] = useState(user.sexo || '');
  const [avatar, setAvatar] = useState(user.avatar || '');

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      dispatch({ type: 'setAvatar', payload: { avatar: uri } });
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para usar a câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      dispatch({ type: 'setAvatar', payload: { avatar: uri } });
    }
  };

  const handleSave = async () => {
    dispatch({ type: 'setUser', payload: { nome, telefone, sexo, avatar } });
    await AsyncStorage.setItem('user', JSON.stringify({ ...user, nome, telefone, sexo, avatar }));
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleLogout = async () => {
    dispatch({ type: 'logout' });
    await AsyncStorage.clear();
    router.replace('/pages/Login/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {/* Cabeçalho com avatar + botão de editar */}
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={handleChoosePhoto} onLongPress={handleTakePhoto}>
              <Image
                source={avatar ? { uri: avatar } : require('../../../../assets/account.png')}
                style={styles.avatar}
              />
            </TouchableOpacity>
            {/* Ícone de câmera */}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleChoosePhoto}
              onLongPress={handleTakePhoto}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={{ marginLeft: 15 }}>
            <Text style={styles.userName}>{nome || 'Seu nome'}</Text>
            <Text style={styles.labelSmall}>Toque ou segure para atualizar a foto</Text>
          </View>
        </View>

        {/* Campos */}
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
          placeholder="Digite seu telefone"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Sexo</Text>
        <TextInput
          style={styles.input}
          value={sexo}
          onChangeText={setSexo}
          placeholder="Masculino / Feminino"
          placeholderTextColor="#999"
        />

        {/* Botões */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      <BottomMenu />
    </View>
  );
}
