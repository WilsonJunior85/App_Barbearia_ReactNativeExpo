
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = 250;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    /** TOPO COM IMAGEM E ANIMAÇÃO **/
    topoContainer: {
        height: IMAGE_HEIGHT,
        width,
    },

    imagemTopo: {
        width,
        height: IMAGE_HEIGHT,
        position: 'absolute',
    },

    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },

    botaoVoltar: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 2,
    },

    header: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        alignItems: 'center',
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#ccc',
    },

    nome: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
    },

    avaliacao: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },

    estrela: {
        marginHorizontal: 2,
    },

    nota: {
        marginLeft: 6,
        fontSize: 16,
        color: '#fff',
    },

    /** CONTEÚDO GERAL **/
    conteudo: {
        padding: 20,
    },

    /** Títulos das seções **/
    tituloLista: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 30,
        color: '#333',
    },

    /** Lista de serviços **/
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

    /** Avaliações **/
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
