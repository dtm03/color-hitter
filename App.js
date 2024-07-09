import React, {useState, useEffect} from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function App() {
    const [bgColor, setBgColor] = useState('#000');
    const [btnColor, setBtnColor] = useState('#000');
    const [score, setScore] = useState(0);
    const [highscore, setHighscore] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const handleButtonPress = () => {
        const id = setInterval(() => {
            changeColor(true);
        }, 200);
        setIntervalId(id);
    };

    const handleButtonRelease = () => {
        clearInterval(intervalId);
        changeColor(false);
        setTimeout(async () => {
            await calculateScore();
            startGame();
        }, 500);
    };

    const generateRandomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    const startGame = async () => {
        const storedHighscore = await AsyncStorage.getItem('highscore');
        const currentHighscore = parseInt(storedHighscore, 10) || 0;
        setHighscore(currentHighscore);
        setBgColor(generateRandomColor());
        setBtnColor(generateRandomColor());
    };

    const changeColor = (shouldChange) => {
        if (shouldChange) {
            setBtnColor(generateRandomColor());
        }
    };

    const calculateScore = () => {
        setScore((prevScore) => {
            const newScore = prevScore + 1;
            if (newScore > highscore) {
                AsyncStorage.setItem('highscore', newScore.toString());
            }
            return newScore;
        });
    };

    useEffect(() => {
        startGame();
    }, []);

    return (
        <View style={[styles.container, {backgroundColor: bgColor}]}>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.score}>Score: {score}</Text>
                <Text style={styles.highScore}>Highscore: {highscore}</Text>
            </View>
            <TouchableWithoutFeedback
                onPressIn={handleButtonPress}
                onPressOut={handleButtonRelease}
            >
                <View style={[styles.button, {backgroundColor: btnColor}]}>
                    <Text style={styles.buttonText}>Hit the color!</Text>
                </View>
            </TouchableWithoutFeedback>
            <StatusBar style="auto"/>
        </View>
    );
}