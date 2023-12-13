import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";
import MovingTitle from './MovingTitle';

const background = require('../A5-chatapp-assets/Background.png');

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const colors = ['#ffc09f', '#ffee93', '#fcf5c7', '#a0ced9', '#adf7b6'];
    const auth = getAuth();

    // Signing in the user to the chat room using firebase/auth

    const signInUser = () => {
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate("Chat", { userID: result.user.uid, name: name, color: backgroundColor });
                Alert.alert("Signed in Successfully!");
            })
            .catch((error) => {
                Alert.alert("Unable to sign in, try again later.");
            })
    }

    // Alows the user to choose a color and input their name for using the application. Passes the name and color choice as props to components. 

    return (
        <View style={styles.container}>
            <ImageBackground source={background} resizeMode="cover" style={styles.image}>
                <View style={styles.overlay}>
                    <View>
                        <MovingTitle style={styles.textTitle} />
                    </View>
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
                            <TouchableOpacity
                                accessible={true}
                                accessibilityLabel="choose your color"
                                accessibilityHint="Let’s you choose from five different colors for your screen color."
                                key={index}
                                style={[styles.colorChoices,
                                { backgroundColor: color }, background === color && styles.selected]} onPress={() => setBackgroundColor(color)}
                            />
                        ))}
                    </View>
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="Start chatting"
                        accessibilityHint="lets you enter the chat room to see others messages and send your own."
                        style={styles.startButton}
                        onPress={signInUser}>
                        <Text style={styles.startButtonText}>Get started</Text>
                    </TouchableOpacity>
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
        borderRadius: 10
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
    startButton: {
        backgroundColor: "#E3EEEE",
        height: 50,
        width: "88%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    },
    startButtonText: {
        color: "#000",
    }
});

export default Start;