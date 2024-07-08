import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get Highscore right and implement correct color change and logic

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
        console.log('Button pressed');
        const id = setInterval(() => {
            changeColor(true);
        }, 200); // Change color every 200 milliseconds
        setIntervalId(id);
    };

    const handleButtonRelease = () => {
        console.log('Button released');
        clearInterval(intervalId);
        changeColor(false);
        setTimeout(() => {
            setScore(calculateScore());
            startGame();
        }, 1000);
    };

    const generateRandomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    const startGame = async () => {
        if (score > highscore) {
            await AsyncStorage.setItem('highscore', score.toString());
        }
        const storedHighscore = await AsyncStorage.getItem('highscore');
        setHighscore(parseInt(storedHighscore, 10) || 0);
        setBgColor(generateRandomColor());
        setBtnColor(generateRandomColor());
        changeColor(false);
    };

    const changeColor = (shouldChange) => {
        if (shouldChange) {
            setBtnColor(generateRandomColor());
        }
    };

    const calculateScore = () => {
        return score + 1;
    };

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
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