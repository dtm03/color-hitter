import React, {useState, useEffect} from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {waitFor} from "@babel/core/lib/gensync-utils/async";

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

    useEffect(() => {
        startGame();
    }, []);

    const handleButtonPress = () => {
        const id = setInterval(() => {
            changeColor();
            console.log('Color changed');
        }, 200);
        setIntervalId(id);
    };

    const handleButtonRelease = () => {
        clearInterval(intervalId);
        setTimeout(async () => {
            await calculateScore();
            startGame();
        }, 1000);
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

    // Utility function to convert hex color to RGB array
    const hexToRgb = (hex) => {
        let bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    // Utility function to convert RGB array to hex color
    const rgbToHex = (rgb) => {
        return '#' + rgb.map(x => ('0' + x.toString(16)).slice(-2)).join('');
    };

    const changeColor = () => {
        // Assuming btnColor and bgColor are already defined and contain valid hex color strings
        const buttonRGB = hexToRgb(btnColor); // Convert btnColor to RGB
        const bgRGB = hexToRgb(bgColor);// Convert bgColor to RGB
        const newButtonRGB = [0, 0, 0];
        
        for (let i = 0; i < 3; i++) {
            newButtonRGB[i] = buttonRGB[i] - 10;
        }

        let newButtonColor = rgbToHex(newButtonRGB);
        setBtnColor(newButtonColor);

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