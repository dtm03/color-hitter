import React, { useState, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import styles from './styles';
import { startNewGame, updateScoreAndHighscore, changeColor } from './functions';

export default function App() {
    const [bgColor, setBgColor] = useState('#000');
    const [btnColor, setBtnColor] = useState('#000');
    const [score, setScore] = useState(0);
    const [highscore, setHighscore] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [diff, setDiff] = useState(0);

    useEffect(() => {
        startNewGame(setBgColor, setBtnColor, setHighscore);
    }, []);

    const handleButtonPress = () => {
        const id = setInterval(() => {
            setBtnColor(prevColor => changeColor(prevColor, bgColor, setDiff));
        }, 5);
        setIntervalId(id);
    };

    const handleButtonRelease = () => {
        clearInterval(intervalId);
        setTimeout(async () => {
            await updateScoreAndHighscore(setScore, highscore, diff);
            startNewGame(setBgColor, setBtnColor, setHighscore);
        }, 1000);
    };

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.score}>Score: {score}</Text>
                <Text style={styles.highScore}>Highscore: {highscore}</Text>
            </View>
            <TouchableWithoutFeedback
                onPressIn={handleButtonPress}
                onPressOut={handleButtonRelease}
            >
                <View style={[styles.button, { backgroundColor: btnColor }]}>
                    <Text style={styles.buttonText}>Hit the color!</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}