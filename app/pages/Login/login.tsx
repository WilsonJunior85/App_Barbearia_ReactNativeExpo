import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { UserContext } from '../../../app/contexts/UserContext';
import authService from '../../../src/services/authService';
import { styles } from '../../../app/pages/Login/styles';
import BarberLogo from '../../../assets/barber.png';
// import BarberLogo from '../../../assets/BarbeariaPrincipal.png';
import EmailIcon from '../../../assets/email.png';
import LockIcon from '../../../assets/lock.png';

export default function LoginPage() {
  // CONFIGURAÇÕES E CONTEXTO
  const router = useRouter();
  const { dispatch } = useContext(UserContext);

  // ESTADOS LOCAIS
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  // FUNÇÃO: Realizar Login
  // - Valida campos
  // - Chama API de autenticação
  // - Salva token e dados do usuário
  // - Atualiza contexto global
  // - Redireciona para tela Home
  const pageLogin = async () => {
    if (!email || !senha) return alert('Preencha todos os campos!');
    setLoading(true);
    try {
      // Chamada à API de autenticação
      const result = await authService.login(email, senha);
      console.log('Resposta da API:', result);
      // Se sucesso → salva dados e token localmente
      if (result.status && result.data?.token) {
        await AsyncStorage.setItem('@user_token', result.data.token);
        await AsyncStorage.setItem('@usuario', JSON.stringify(result.data));

        // Atualiza contexto global (UserContext)
        dispatch({
          type: 'setUser',
          payload: {
            nome: result.data.nome,
            sobrenome: result.data.sobrenome,
            email: result.data.email,
            avatar: 'https://i.pravatar.cc/100', // avatar genérico
          },
        });
        // Redireciona para a Home
        router.push('/pages/home/home');
        // Alert.alert(`Sempre bom ter você de volta , ${result.data.nome}`);
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

  // FUNÇÃO: Ir para tela de cadastro
  const pageCadastrar = () => {
    // Navega para a tela de cadastro
    router.push('/pages/cadastro/cadastro');
  };

  // RENDERIZAÇÃO DO COMPONENTE
  return (
    <View style={styles.container}>
      <Image
        source={BarberLogo} // fonte do PNG
        resizeMode="contain"
        style={styles.image}
      />

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

      <TouchableOpacity style={styles.button} onPress={pageLogin}>
        <Text style={styles.textbutton}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pageCadastrar}>
        <Text style={styles.textCadastrar}>
          Ainda não possui uma conta? <Text style={styles.textCadastrese}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
