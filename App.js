import { useEffect } from 'react';
import { StyleSheet, LogBox, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";
import Start from './components/Start';
import Chat from './components/Chat';

LogBox.ignoreLogs([
  'AsyncStorage has been extracted from',
  '@firebase/auth: Auth (10.3.1)',
]);

const Stack = createNativeStackNavigator();

const App = () => {
  // implimentation of code to be able to read messages when connection is lost
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  const firebaseConfig = {
    apiKey: "AIzaSyBZkGFQU7RDkwfWeK7LS2yBEg6c7aThd1M",
    authDomain: "chatapp-da5ef.firebaseapp.com",
    projectId: "chatapp-da5ef",
    storageBucket: "chatapp-da5ef.appspot.com",
    messagingSenderId: "657180355856",
    appId: "1:657180355856:web:f0d688a208dabb06944995"
  };

  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app);
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}>
        </Stack.Screen>
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;