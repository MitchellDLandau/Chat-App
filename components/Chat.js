import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
    const { name } = route.params;
    const color = route.params.color;

    useEffect(() => {
        navigation.setOptions({
            title: name,
            backgroundColor: color
        });
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <Text>Hello Chat!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default Chat;