import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        width: '85%',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#222',
    },
    label: {
        color: '#555',
        fontSize: 16,
        marginTop: 10,
    },
    valor: {
        fontSize: 17,
        fontWeight: '500',
        color: '#222',
    },
    botoes: {
        flexDirection: 'row',
        marginTop: 20,
    },
    botao: {
        backgroundColor: '#4EADBE',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    confirmar: {
        backgroundColor: '#4CAF50',
        marginTop: 15,
    },
    textoBotao: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelar: {
        color: '#e74c3c',
        marginTop: 15,
        fontWeight: 'bold',
    },
    sucesso: {
        color: '#2ecc71',
        marginTop: 10,
        fontWeight: '600',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
    },

    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
});
