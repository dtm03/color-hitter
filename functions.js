import AsyncStorage from '@react-native-async-storage/async-storage';

export const startNewGame = async (setBgColor, setBtnColor, setHighscore) => {
    const storedHighscore = await AsyncStorage.getItem('highscore');
    const currentHighscore = parseInt(storedHighscore, 10) || 0;
    setHighscore(currentHighscore);
    setBgColor('#' + Math.floor(Math.random() * 16777215).toString(16));
    setBtnColor('#' + Math.floor(Math.random() * 16777215).toString(16));
};

export const updateScoreAndHighscore = (setScore, highscore, diff) => {
    setScore((prevScore) => {
        const newScore = parseInt(prevScore + (1 / diff) * 500);
        if (newScore > highscore) {
            AsyncStorage.setItem('highscore', newScore.toString());
        }
        return newScore;
    });
};

function hexToRgb(hex) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse the hex string to integers
    let bigint = parseInt(hex, 16);

    // Extract RGB values
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    // Return an object with the RGB values
    return [ r, g, b ];
}

function rgbToHex(r, g, b) {
    // Convert each value to a two-digit hex string
    let hexR = r.toString(16).padStart(2, '0');
    let hexG = g.toString(16).padStart(2, '0');
    let hexB = b.toString(16).padStart(2, '0');

    // Combine them into one hex string
    return `#${hexR}${hexG}${hexB}`;
}

export const changeColor = (btnColor, bgColor, setDiff) => {
    let buttonRGB = hexToRgb(btnColor);
    let bgRGB = hexToRgb(bgColor);
    let diff = 0;
    for (let i = 0; i < 3; i++) {
        buttonRGB[i] < bgRGB[i] ? buttonRGB[i]++ : buttonRGB[i]--;
        diff += Math.abs(buttonRGB[i] - bgRGB[i]);
    }
    if (diff < 15) {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    let newButtonColor = rgbToHex(buttonRGB[0], buttonRGB[1], buttonRGB[2]);
    setDiff(diff);
    return newButtonColor;
};