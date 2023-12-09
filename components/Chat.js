import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Alert } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
    const { name } = route.params;
    const color = route.params.color;
    const userID = route.params.userID;
    const [messages, setMessages] = useState([]);

    // Sends the message to the db and updates the messages.
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    }

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }

    let unsubChat;

    useEffect(() => {
        // Set page name and color.
        navigation.setOptions({
            title: name,
            backgroundColor: color
        });
        // Displays chat when user is online
        if (isConnected === true) {
            if (unsubChat) unsubChat();
            unsubChat = null;
            // Take db of messages and display by time sent
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubChat = onSnapshot(q, (documentsSnapshot) => {
                let newMessages = [];
                documentsSnapshot.forEach(doc => {
                    newMessages.push({
                        _id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    })
                })
                cacheMessages(newMessages);
                setMessages(newMessages);
            })
            //When user is offline cached messages are still displayed
        } else loadCachedMessages();

        return () => {
            if (unsubChat) unsubChat();
        }
    }, [isConnected]);

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

    // This code is to set the colors of the chat bubbles.
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#000'
                },
                left: {
                    backgroundColor: '#FFF'
                }
            }}
        />
    }

    return (
        <View style={[styles.chatBox, { backgroundColor: color }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
            {/* {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='padding' /> : null} */}
            {/* Above was intended to fix spacing of keyboard on ios however it seems not needed */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatBox: {
        flex: 1
    }
});

export default Chat;