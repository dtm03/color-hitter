import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    button: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 100,
        backgroundColor: "lightgrey",
    },
    buttonText: {
        color: "white",
        fontSize: 45,
    },
    score: {
        color: "white",
        fontSize: 60,
        margin: 20,
    },
    highScore: {
        color: "white",
        fontSize: 30,
    },
});

export default styles;