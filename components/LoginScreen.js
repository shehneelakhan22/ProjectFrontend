import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ImageBackground } from 'react-native';
import { BACKEND_API_URL } from './configUrl';

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
        Alert.alert("Success", response.data.message);
        navigation.navigate('Home');
      } else {
        Alert.alert("Error", response.data.error);
      }
    } catch (error) {
     
      Alert.alert("Error", "Network request failed: " + error.message);
    }
  };

  return (
    <ImageBackground source={require('../assets/login.jpg')} style={styles.backgroundImage}>
    <View style={styles.container}>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'trasnparent',
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
  textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  myButton: {
    top: 20,
    backgroundColor: 'green',
    height: 40,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  textInputStyle: {
    height: 40,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 0,
    fontStyle: 'italic',
    paddingRight: 10,
    paddingLeft: 10,
  },
});

export default LoginScreen;