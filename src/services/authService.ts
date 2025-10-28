import axios, { isAxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base da API
const API_URL = "http://192.168.1.78:5295/api";

// Estrutura esperada para o login (requisição)
export type LoginRequest = {
    email: string;
    senha: string;
};

// Estrutura da resposta ao fazer login
export type LoginResponse = {
    token: string; // Token JWT retornado pela API
    data: {
        id: number;
        nome: string;
        sobrenome: string;
        email: string;
    };
};

// Estrutura padrão de um usuário
export type Usuario = {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
};

// Estrutura para criar novo usuário (cadastro)
export type CreateUsuario = {
    usuario: string;
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    confirmaSenha: string;
};


// Função auxiliar — parse seguro de JSON
// Garante que, mesmo que o backend não retorne JSON válido
// (ou retorne vazio), o app não quebre ao tentar parsear.
async function safeJsonParse(response: Response) {
    try {
        if (!response) return {};
        if (response.status === 204) return {};
        const text = await response.text();
        if (!text) return {};
        return JSON.parse(text);
    } catch (err) {
        console.warn("Erro ao parsear JSON:", err);
        return {};
    }
}

// Serviço de autenticação
const authService = {

    // LOGIN DO USUÁRIO
    // Envia email e senha para a rota /Login/Login do backend.
    // Retorna o token + dados do usuário (se sucesso).
    login: async (email: string, senha: string) => {
        try {
            const response = await fetch(`${API_URL}/Login/Login`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });
            // Retorna a resposta convertida em JSON seguro
            return await safeJsonParse(response);
        } catch (err) {
            console.log("Erro signIn:", err);
            return { status: false, mensagem: "Erro de conexão" };
        }
    },

    // VERIFICAÇÃO DE TOKEN
    // Envia o token para a API verificar se ainda é válido.
    // Pode ser usada ao abrir o app, pra manter o login ativo.
    checkToken: async (token: string) => {
        try {
            const response = await fetch(`${API_URL}/Usuario`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });
            return await safeJsonParse(response);
        } catch (err) {
            console.log("Erro checkToken:", err);
            return { status: false, mensagem: "Erro de conexão" };
        }
    },

    // CADASTRO DE NOVO USUÁRIO
    // Envia os dados de registro para /Login/Register.
    // Usa axios (mais prático para requisições JSON).
    handleCadastro: async (usuario: string, nome: string, sobrenome: string, email: string, senha: string, confirmaSenha: string) => {
        try {
            const response = await axios.post(`${API_URL}/Login/Register`, {
                Usuario: usuario,
                Nome: nome,
                Sobrenome: sobrenome,
                Email: email,
                Senha: senha,
                ConfirmaSenha: confirmaSenha,
            }, { headers: { "Content-Type": "application/json" } });

            return response.data;
        } catch (err: any) {
            if (isAxiosError(err)) {
                console.error(err.response?.data || err.message);
            } else {
                console.error(err);
            }
            return { status: false, mensagem: "Erro de conexão" };
        }
    },

    // BUSCAR TODOS OS USUÁRIOS
    // Usa o token salvo no AsyncStorage para autenticação.
    // Faz GET em /Usuario e retorna a lista de usuários.
    getUsuarios: async (): Promise<Usuario[]> => {
        try {
            // Recupera o token JWT salvo localmente
            const token = await AsyncStorage.getItem('@user_token');
            if (!token) throw new Error('Token não encontrado no AsyncStorage');
            // Faz a requisição autenticada
            const response = await axios.get(`${API_URL}/Usuario`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            // Retorna o array de usuários vindo da API
            return response.data.data;
        } catch (err: any) {
            console.error('Erro ao buscar usuários:', err);
            throw err;
        }
    },

    // BUSCAR USUÁRIO PELO ID
    // Usa o token salvo no AsyncStorage.
    // Faz GET em /Usuario/{id} e retorna os dados do usuário.
    getUsuarioById: async (id: number): Promise<Usuario> => {
        try {
            const token = await AsyncStorage.getItem('@user_token');
            if (!token) throw new Error('Token não encontrado no AsyncStorage');

            const response = await axios.get(`${API_URL}/Usuario/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data.data; // usuário individual
        } catch (err: any) {
            console.error(`Erro ao buscar usuário ${id}:`, err);
            throw err;
        }
    },
};
// Exporta o objeto para uso nos componentes
export default authService;
