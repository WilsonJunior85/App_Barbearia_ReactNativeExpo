import { StyleSheet } from "react-native";



export const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "#63c2d1" },
    image: { width: '100%', height: 200, marginTop: 100 },
    inputArea: {
        width: '100%',
        height: 60,
        backgroundColor: "#83d6e6",
        flexDirection: 'row',
        borderRadius: 30,
        paddingLeft: 15,
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 40

    },
    icon: {
        position: 'absolute', // faz o ícone ficar dentro do input
        left: 10,             // distância da borda esquerda
        top: '50%',            // centraliza verticalmente
        transform: [{ translateY: -10 }], // ajuste fino vertical
        width: 25,
        height: 20,
        zIndex: 1,
        marginLeft: 30
    },
    input: {
        height: 70,
        paddingLeft: 60,       // espaço para o ícone
        borderRadius: 30,
        backgroundColor: '#83d6e6',
        marginBottom: 40,
        marginTop: 40,
        alignItems: 'center',
        width: 350,
        alignSelf: 'center'


    },
    inputContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: -50,
    },
    button: {
        backgroundColor: '#268596',
        padding: 10,
        borderRadius: 15,
        width: 350,
        height: 60,
        marginLeft: 4,
        marginTop: 40,
        alignSelf: 'center', // centraliza o botão na tela
        justifyContent: 'center', // centraliza verticalmente
        alignItems: 'center',     // centraliza horizontalmente
    },
    textbutton: {
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center', // centraliza o botão na tela
        justifyContent: 'center', // centraliza verticalmente
        alignItems: 'center',     // centraliza horizontalmente

    },
    textCadastrar: {
        color: '#268596',
        fontSize: 15,
        alignSelf: 'center', // centraliza o botão na tela
        justifyContent: 'center', // centraliza verticalmente
        alignItems: 'center',     // centraliza horizontalmente
        marginTop: 20
    },
    textCadastrese: {
        color: '#268596',
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'center', // centraliza o botão na tela
        justifyContent: 'center', // centraliza verticalmente
        alignItems: 'center',     // centraliza horizontalmente
        marginTop: 20
    }







})