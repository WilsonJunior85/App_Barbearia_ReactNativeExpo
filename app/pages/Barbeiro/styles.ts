import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#74C2D4' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 70 },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc' },
    infoHeader: { flex: 1, marginLeft: 12 },
    nome: { fontSize: 18, fontWeight: 'bold' },
    avaliacao: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    nota: { marginLeft: 6, fontSize: 14 },
    favorito: { padding: 8 },
    tituloLista: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 50 },
    servicoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginTop: 20
    },
    servicoNome: { fontSize: 14, fontWeight: '500' },
    servicoPreco: { fontSize: 12, color: '#555' },
    botaoAgendar: {
        backgroundColor: '#4A90E2',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    textoBotao: { color: '#fff', fontWeight: 'bold' },
    avaliacaoContainer: {
        backgroundColor: '#f0f4f8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    avaliacaoComentario: { marginTop: 4, fontSize: 12 },
    avaliacaoNota: { flexDirection: 'row' },
});