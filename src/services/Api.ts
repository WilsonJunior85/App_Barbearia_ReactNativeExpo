
import Axios from "axios";


// Para React Native, usamos o IP da máquina
// No Android Emulator, 10.0.2.2 aponta para a máquina host
// const BASE_URL =
//     Platform.OS === "android" ? "http://10.0.2.2:5295/api" : "http://192.168.1.78:5295/api";

export const httpClient = Axios.create({
    baseURL: 'http://192.168.1.78:5295/api',
    timeout: 10000, // 10s de timeout
    withCredentials: false,
});


// Exemplo de chamada autenticada com token Firebase
export async function getDadosProtegidos(token: string) {
    const response = await httpClient.get("/dados", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export default httpClient;






