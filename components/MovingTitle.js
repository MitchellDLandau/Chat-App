import React, { useEffect, useRef } from 'react';
import { Text, Animated, Dimensions, StyleSheet } from 'react-native';

const MovingTitle = () => {
    const leftValue = useRef(new Animated.Value(-400)).current;

    useEffect(() => {
        Animated.timing(leftValue, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
        }).start();
    }, []);

    const screenHeight = Dimensions.get('window').height;
    const moveUpDistance = screenHeight / 5;

    return (
        <Animated.View style={{ position: 'flex', left: leftValue, top: -moveUpDistance }}>
            <Text style={styles.text}>Let's Chat About it!</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontWeight: 'bold',
        fontSize: 20,
    },
});

export default MovingTitle;