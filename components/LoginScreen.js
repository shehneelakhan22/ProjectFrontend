import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { BACKEND_API_URL } from './configUrl';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [usernameEmailText, setUsernameEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  const handleSignIn = async () => {
    if (!usernameEmailText || !passwordText) {
      Alert.alert("Error", "Please provide both username/email and password");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_API_URL}/login`, { 
        email_or_username: usernameEmailText,
        password: passwordText,
      });

      if (response.status === 200) {
        // Alert.alert("Success", response.data.message);
        navigation.navigate('Home');
      } else {
        Alert.alert("Error", response.data.error);
      }
    } catch (error) {
     
      Alert.alert("Error", "Network request failed: " + error.message);
    }
  };

  return (
    // <LinearGradient
    //       colors={['#000000', '#010b30', '#000000']} 
    //       style={styles.backgroundGradient} 
    //     >
    <View style={styles.container}>
      <Image
          source={require('../assets/App_logo.png')}
          style={styles.logostyle}
              />
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Enter email or username"
          value={usernameEmailText}
          onChangeText={(text) => setUsernameEmailText(text)}
          style={styles.textInputStyle}
        />
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Enter password"
          value={passwordText}
          onChangeText={(text) => setPasswordText(text)}
          style={styles.textInputStyle}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.myButton}
        onPress={handleSignIn}
      >
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
    // </LinearGradient> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode:'cover',
    justifyContent: "center",
    alignSelf:'center',
    width: "100%",
    height: "100%",
  },
  logostyle: {
    marginTop:-100,
    marginBottom: -30,
    height: 225,
    width: 225,
    borderRadius: 100,
  },
  textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  myButton: {
    top: 30,
    backgroundColor:'#b29705',
    height: 40,
    width: 230,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  textInputStyle: {
    height: 45,
    width: 230,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0,
    fontStyle: 'italic',
    paddingRight: 10,
    paddingLeft: 10,
  },
});

export default LoginScreen;