import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
    const { name } = route.params;
    const color = route.params.color;
    const userID = route.params.userID;
    const [messages, setMessages] = useState([]);

    // Sends the message to the db and updates the messages.
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    }

    useEffect(() => {
        // Set page name and color.
        navigation.setOptions({
            title: name,
            backgroundColor: color
        });
        // Take db of messages and display by time sent
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubChat = onSnapshot(q, (documentsSnapshot) => {
            let newMessages = [];

            documentsSnapshot.forEach(doc => {
                newMessages.push({
                    _id: doc._id, //changed the second one
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis())
                })
            })
            setMessages(newMessages)
        })
        return () => {
            if (unsubChat) unsubChat();
        }
    }, []);

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