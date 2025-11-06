import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { UserContext } from '../../../app/contexts/UserContext';
import authService from '../../../src/services/authService';
import { styles } from '../../../app/pages/Login/styles';
import BarberLogo from '../../../assets/barber.png';
import EmailIcon from '../../../assets/email.png';
import LockIcon from '../../../assets/lock.png';

export default function LoginPage() {
  const router = useRouter();
  const { dispatch } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometriaDisponivel, setBiometriaDisponivel] = useState(false);

  // Verifica se há suporte à biometria no dispositivo
  useEffect(() => {
    (async () => {
      const compatibilidade = await LocalAuthentication.hasHardwareAsync();
      const tiposSuportados = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const biometriaSalva = await LocalAuthentication.isEnrolledAsync();

      if (compatibilidade && biometriaSalva && tiposSuportados.length > 0) {
        setBiometriaDisponivel(true);
      }

      // Se já existir token salvo, oferece login biométrico
      const token = await AsyncStorage.getItem('@user_token');
      if (token) {
        autenticarComDigital();
      }
    })();
  }, []);

  //  Função: Autenticação biométrica
  const autenticarComDigital = async () => {
    try {
      const resultado = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Use sua digital para entrar',
        fallbackLabel: 'Digite a senha manualmente',
      });

      if (resultado.success) {
        const usuarioSalvo = await AsyncStorage.getItem('@usuario');
        if (usuarioSalvo) {
          const dados = JSON.parse(usuarioSalvo);

          // Atualiza contexto global
          dispatch({
            type: 'setUser',
            payload: {
              nome: dados.nome,
              sobrenome: dados.sobrenome,
              email: dados.email,
              avatar: dados.avatar || 'https://i.pravatar.cc/100',
            },
          });

          router.push('/pages/home/home');
        }
      }
    } catch (error) {
      console.error('Erro ao autenticar com digital:', error);
    }
  };

  // Função tradicional de login
  const pageLogin = async () => {
    if (!email || !senha) return alert('Preencha todos os campos!');
    setLoading(true);
    try {
      const result = await authService.login(email, senha);
      console.log('Resposta da API:', result);

      if (result.status && result.data?.token) {
        await AsyncStorage.setItem('@user_token', result.data.token);
        await AsyncStorage.setItem('@usuario', JSON.stringify(result.data));

        dispatch({
          type: 'setUser',
          payload: {
            nome: result.data.nome,
            sobrenome: result.data.sobrenome,
            email: result.data.email,
            avatar: 'https://i.pravatar.cc/100',
          },
        });

        router.push('/pages/home/home');
      } else {
        Alert.alert('Erro', 'Usuário ou senha inválidos');
      }
    } catch (err: any) {
      console.error('Erro ao logar:', err.response || err.message);
      Alert.alert('Erro', 'Ocorreu um problema ao tentar logar');
    } finally {
      setLoading(false);
    }
  };

  const pageCadastrar = () => {
    router.push('/pages/cadastro/cadastro');
  };

  return (
    <View style={styles.container}>
      <Image source={BarberLogo} resizeMode="contain" style={styles.image} />

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
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={pageLogin}>
        <Text style={styles.textbutton}>LOGIN</Text>
      </TouchableOpacity>

      {/* Botão de biometria (opcional) */}
      {biometriaDisponivel && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#333', marginTop: 10 }]}
          onPress={autenticarComDigital}>
          <Text style={[styles.textbutton, { color: '#fff' }]}>Entrar com Digital</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={pageCadastrar}>
        <Text style={styles.textCadastrar}>
          Ainda não possui uma conta? <Text style={styles.textCadastrese}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
