import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import MapView from 'react-native-maps';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
    const { name } = route.params;
    const color = route.params.color;
    const userID = route.params.userID;
    const [messages, setMessages] = useState([]);

    // Sends the message to the db and updates the messages.
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    }

    // Caches the messages so they can be retrieved if the connection is lost.
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    //Loads the cached messages when called. 
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
        // Displays chat when user is online.
        if (isConnected === true) {
            if (unsubChat) unsubChat();
            unsubChat = null;
            // Take db of messages and display by time sent.
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
            //When user is offline cached messages are still displayed.
        } else loadCachedMessages();

        return () => {
            if (unsubChat) unsubChat();
        }
    }, [isConnected]);

    // Renders the toolbar so that users can pick to send images, take images, and send location data. 
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

    // Renders the custom actions of images and location for the user.
    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} userID={userID} {...props} />;
    };

    //Sends a message bubble containing the location data the user wishes to send. 

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
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

    //Using GiftedChat renders message bubbles as well as other components for sending more information.

    return (
        <View style={[styles.chatBox, { backgroundColor: color }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderActions={renderCustomActions}
                renderInputToolbar={renderInputToolbar}
                renderCustomView={renderCustomView}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
            {/* {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='padding' /> : null} */}
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