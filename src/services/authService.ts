import axios, { isAxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base da API
const API_URL = "http://192.168.1.78:5295/api";

// Tipos
export type LoginRequest = {
    email: string;
    senha: string;
};

export type LoginResponse = {
    token: string;
    data: {
        id: number;
        nome: string;
        sobrenome: string;
        email: string;
    };
};

export type Usuario = {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
};

export type CreateUsuario = {
    usuario: string;
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    confirmaSenha: string;
};

// Função segura para parsear JSON
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
            return await safeJsonParse(response);
        } catch (err) {
            console.log("Erro signIn:", err);
            return { status: false, mensagem: "Erro de conexão" };
        }
    },

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

    getUsuarios: async (): Promise<Usuario[]> => {
        try {
            const token = await AsyncStorage.getItem('@user_token');
            if (!token) throw new Error('Token não encontrado no AsyncStorage');

            const response = await axios.get(`${API_URL}/Usuario`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data.data; //  array de usuários
        } catch (err: any) {
            console.error('Erro ao buscar usuários:', err);
            throw err;
        }
    },

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

export default authService;
