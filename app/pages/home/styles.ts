import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#74C2D4', paddingHorizontal: 20, paddingTop: 50 },
    titulo: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginTop: 20 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5FB7D7', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, marginBottom: 20 },
    input: { flex: 1, color: '#fff' },
    card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, height: 80 },
    avatar: { width: 60, height: 60, backgroundColor: '#ccc', borderRadius: 30 },
    info: { flex: 1, marginLeft: 15 },
    nome: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    avaliacao: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
    nota: { marginLeft: 5, fontWeight: 'bold', color: '#555' },
    botao: { backgroundColor: '#74C2D4', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'flex-start', marginLeft: 150, marginTop: -35 },
    textoBotao: { color: '#fff', fontWeight: 'bold' },

});