import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../../src/services/authService';
import { styles } from '../../../app/pages/cadastro/styles';
import BarberLogo from '../../../assets/barber.png';
import EmailIcon from '../../../assets/email.png';
import LockIcon from '../../../assets/lock.png';
import PersonIcon from '../../../assets/person.png';

export default function LoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  const handleCadastroClick = async () => {
    // Validação básica
    // Validação básica
    if (!usuario || !nome || !sobrenome || !email || !senha || !confirmaSenha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (senha !== confirmaSenha) {
      Alert.alert('Erro', 'As senhas não conferem!');
      return;
    }

    try {
      const result = await authService.handleCadastro(
        usuario,
        nome,
        sobrenome,
        email,
        senha,
        confirmaSenha
      );
      console.log('Resultado cadastro:', result);

      // Limpa os campos do formulário
      setUsuario('');
      setNome('');
      setSobrenome('');
      setEmail('');
      setSenha('');
      setConfirmaSenha('');

      // Ajuste conforme o retorno da sua API
      const token = result.token || result.data?.token;

      if (token) {
        await AsyncStorage.setItem('token', token);

        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        router.push('/pages/home/home'); // Ajuste a rota da tela Home
      } else {
        Alert.alert('Erro', result.mensagem || 'Não foi possível cadastrar.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro ao cadastrar usuário. Tente novamente.');
    }
  };

  const pageLogar = () => {
    // Navega para a tela de cadastro
    router.push('/pages/Login/login');
  };

  useEffect(() => {}, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Image
            source={BarberLogo} // fonte do PNG
            resizeMode="contain"
            style={styles.image}
          />

          <View style={styles.inputContainer}>
            <Image source={PersonIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu Usuário"
              value={usuario}
              onChangeText={setUsuario}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Image source={PersonIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu Nome"
              value={nome}
              onChangeText={setNome}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Image source={PersonIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu Sobrenome"
              value={sobrenome}
              onChangeText={setSobrenome}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Image source={EmailIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Image source={LockIcon} style={styles.icon} />

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry // true = oculta senha
            />
          </View>

          <View style={styles.inputContainer}>
            <Image source={LockIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              value={confirmaSenha}
              onChangeText={setConfirmaSenha}
              // keyboardType="email-address"
              // autoCapitalize="none"
              secureTextEntry // true = oculta senha
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCadastroClick}>
            <Text style={styles.textbutton}>CADASTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={pageLogar}>
            <Text style={styles.textCadastrar}>
              Já possui uma conta? <Text style={styles.textCadastrese}>Logar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
