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
        if (response.status === 204) return {}; // No Content
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

            const json = await safeJsonParse(response);
            return json;
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
            const json = await safeJsonParse(response);
            return json;
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

            const response = await axios.get<Usuario[]>(`${API_URL}/Usuario`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                if (!err.response) console.error('Erro de rede GET:', err.message);
                else console.error('Erro na API GET:', err.response.data);
            } else {
                console.error('Erro desconhecido GET:', err);
            }
            throw err;
        }
    },

    // getUsuarios: async (): Promise<Usuario[]> => {
    //     try {
    //         const response = await axios.get<Usuario[]>(`${API_URL}/Usuario`);
    //         return response.data;
    //     } catch (err: any) {
    //         if (axios.isAxiosError(err)) {
    //             if (!err.response) console.error("Erro de rede GET:", err.message);
    //             else console.error("Erro na API GET:", err.response.data);
    //         } else {
    //             console.error("Erro desconhecido GET:", err);
    //         }
    //         throw err;
    //     }
    // },
};

export default authService;
