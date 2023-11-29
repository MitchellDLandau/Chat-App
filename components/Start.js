import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';

const background = require('../A5-chatapp-assets/Background.png');

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const colors = ['#FDDFDF', '#FCF7DE', 'DEFDE0', '#DEF3FD', '#F0DEFD'];

    return (
        <View style={styles.container}>
            <ImageBackground source={background} resizeMode="cover" style={styles.image}>
                <View style={styles.overlay}>
                    <Text>Hello Start!</Text>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Type your username here'
                    />
                    {/* Here is where the user can select the color they wish to use while using the application */}
                    <Text>Chose your color:</Text>
                    <View style={styles.colorLayout}>
                        {colors.map((color, index) => (
                            <TouchableOpacity key={index} style={[styles.colorChoices, { backgroundColor: color }, background === color && styles.selected]} onPress={() => setBackgroundColor(color)} />
                        ))}
                    </View>
                    <Button
                        title="Go to Chat"
                        onPress={() => navigation.navigate('Chat', { name: name, color: backgroundColor })}
                    />
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15,
        color: 'white',
    },
    colorLayout: {
        flexDirection: 'row',
    },
    colorChoices: {
        width: 40,
        height: 40,
        margin: 10,
        borderRadius: 20,
    },
});

export default Start;


const changeColor = () => {
    setColorPickerVisible(true);
}

const handleColorChange = (color) => {
    setBackgroundColor(color);
    setColorPickerVisible(false);
}

const closeColorPicker = () => {
    setColorPickerVisible(false);
}