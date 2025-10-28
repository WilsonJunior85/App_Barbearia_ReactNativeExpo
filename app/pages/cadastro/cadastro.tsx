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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../../src/services/authService';
import { styles } from '../../../app/pages/cadastro/styles';
import BarberLogo from '../../../assets/barber.png';
import EmailIcon from '../../../assets/email.png';
import LockIcon from '../../../assets/lock.png';
import PersonIcon from '../../../assets/person.png';

export default function CadastroPage() {
  // Hook de navegação do Expo Router (para trocar de tela)
  const router = useRouter();
  // Estados que armazenam o valor digitado pelo usuário nos inputs
  const [usuario, setUsuario] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [loading, setLoading] = useState(false);

  //  Função principal chamada ao clicar no botão "Cadastrar".
  //  1. Valida os campos do formulário.
  //  2. Chama o serviço da API (authService.handleCadastro).
  //  3. Salva o token retornado e redireciona para a tela "Home".
  const handleCadastroClick = async () => {
    // Validação simples: impede campos vazios
    if (!usuario || !nome || !sobrenome || !email || !senha || !confirmaSenha) {
      return Alert.alert('Erro', 'Preencha todos os campos!');
    }
    // Verifica se a senha e a confirmação são iguais
    if (senha !== confirmaSenha) {
      return Alert.alert('Erro', 'As senhas não conferem!');
    }
    // Ativa o "loading" para evitar duplo clique
    setLoading(true);
    try {
      // Chama o serviço que envia os dados para o backend
      const result = await authService.handleCadastro(
        usuario,
        nome,
        sobrenome,
        email,
        senha,
        confirmaSenha
      );

      console.log('Resultado cadastro:', result);
      // A API pode retornar o token direto ou dentro de result.data
      const token = result?.data?.token || result?.token;
      if (token) {
        await AsyncStorage.setItem('@user_token', token);
        await AsyncStorage.setItem('@usuario', JSON.stringify(result.data));
        // Mostra mensagem de sucesso e redireciona o usuário para Home
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        router.push('/pages/home/home');
      } else {
        Alert.alert('Erro', result?.mensagem || 'Não foi possível cadastrar.');
      }

      // Limpa os campos após o cadastro
      setUsuario('');
      setNome('');
      setSobrenome('');
      setEmail('');
      setSenha('');
      setConfirmaSenha('');
    } catch (err: any) {
      // Captura e exibe erros vindos do servidor ou da requisição
      console.error('Erro no cadastro:', err.response || err.message);
      Alert.alert('Erro', 'Ocorreu um problema ao cadastrar. Tente novamente.');
    } finally {
      // Desativa o loading mesmo em caso de erro
      setLoading(false);
    }
  };

  // Função simples que redireciona o usuário para a tela de login.
  // Usada no botão "Já possui uma conta? Logar".
  const pageLogar = () => {
    router.push('/pages/Login/login');
  };

  useEffect(() => {}, []);

  //  JSX: Interface da tela
  //  Usa ScrollView para rolagem e KeyboardAvoidingView para evitar que o teclado cubra os campos.
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Image source={BarberLogo} resizeMode="contain" style={styles.image} />

          {/* Usuário */}
          <View style={styles.inputContainer}>
            <Image source={PersonIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu Usuário"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
            />
          </View>

          {/* Nome */}
          <View style={styles.inputContainer}>
            <Image source={PersonIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu Nome"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

          {/* Sobrenome */}
          <View style={styles.inputContainer}>
            <Image source={PersonIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu Sobrenome"
              value={sobrenome}
              onChangeText={setSobrenome}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
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

          {/* Senha */}
          <View style={styles.inputContainer}>
            <Image source={LockIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          {/* Confirmação de senha */}
          <View style={styles.inputContainer}>
            <Image source={LockIcon} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              value={confirmaSenha}
              onChangeText={setConfirmaSenha}
              secureTextEntry
            />
          </View>

          {/* Botão cadastrar */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleCadastroClick}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textbutton}>CADASTRAR</Text>
            )}
          </TouchableOpacity>

          {/* Link para login */}
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
