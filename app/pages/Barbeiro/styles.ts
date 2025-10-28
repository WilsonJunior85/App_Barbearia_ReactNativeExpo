import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // TOPO AZUL ARREDONDADO
    Topo: {
        backgroundColor: '#4EADBE',
        height: 290,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        paddingTop: 50,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,

    },

    // Linha da seta no canto superior
    Setas: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    // Avatar e informações do barbeiro
    header: {
        alignItems: 'center',
        marginTop: 10,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#ccc',
    },

    infoHeader: {
        alignItems: 'center',
        marginTop: 10,
    },

    nome: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 6,
    },

    avaliacao: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },

    nota: {
        marginLeft: 6,
        fontSize: 14,
        color: '#fff',
    },

    // Títulos de seções
    tituloLista: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 30,
        color: '#333',
    },

    // Serviços
    servicoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginTop: 10,
    },

    servicoNome: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },

    servicoPreco: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },

    botaoAgendar: {
        backgroundColor: '#4EADBE',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },

    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
    },

    // Avaliações
    avaliacaoContainer: {
        backgroundColor: '#f0f4f8',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },

    avaliacaoComentario: {
        marginTop: 4,
        fontSize: 13,
        color: '#333',
    },

    avaliacaoNota: {
        flexDirection: 'row',
    },
});
