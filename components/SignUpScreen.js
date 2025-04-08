import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { BACKEND_API_URL } from './configUrl';
import { LinearGradient } from 'expo-linear-gradient';

const SignUpScreen = ({ navigation }) => {
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [rePasswordText, setRePasswordText] = useState('');
  const [usernameText, setUsernameText] = useState('');

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailPattern.test(email);
  };

  const validateUsername = (username) => {
    const usernamePattern = /^[a-z0-9._]+$/;
    return usernamePattern.test(username);
  };

  const handleSignUp = () => {
    if (!emailText || !passwordText || !rePasswordText || !usernameText) {
      Alert.alert("Error", "Provide all credentials");
    } else if (!validateEmail(emailText)) {
      Alert.alert("Error", "Invalid email format, must be in the format xyz@gmail.com");
    } else if (passwordText.length < 8) {
      Alert.alert("Error", "Password should be at least 8 characters long");
    } else if (passwordText !== rePasswordText) {
      Alert.alert("Error", "Passwords do not match");
    } else if (!validateUsername(usernameText)) {
      Alert.alert("Error", "Username can only contain lowercase letters, numbers, underscores, and dots");
    } else {
      // Send signup data to backend
      const userData = {
        username: usernameText,
        email: emailText,
        password: passwordText
      };

      fetch(`${BACKEND_API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          Alert.alert('Error', data.error);
        } else {
          Alert.alert('Success', 'Account created successfully');
          navigation.navigate('Home'); // Navigate to home screen on success
        }
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to create account');
        console.error('Error:', error);
      });
    }
  };

  return (
    // <LinearGradient
    //       // Define the gradient colors (top to bottom)
    //       colors={['#000000', '#010b30', '#000000']} 
    //       style={styles.backgroundGradient} // Apply gradient to full screen
    //     >
    <View style={styles.container}>
      <Image
                source={require('../assets/App_logo.png')}
                style={styles.logostyle}
                    />
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Enter email"
          value={emailText}
          onChangeText={(text) => setEmailText(text)}
          style={styles.textInputStyle}
        />
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Set password"
          value={passwordText}
          onChangeText={(text) => setPasswordText(text)}
          style={styles.textInputStyle}
          secureTextEntry
        />
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Re-Enter password"
          value={rePasswordText}
          onChangeText={(text) => setRePasswordText(text)}
          style={styles.textInputStyle}
          secureTextEntry
        />
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Set Username"
          value={usernameText}
          onChangeText={(text) => setUsernameText(text)}
          style={styles.textInputStyle}
        />
      </View>

      <TouchableOpacity
        style={styles.myButton}
        onPress={handleSignUp}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
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
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  logostyle: {
    marginTop:-100,
    marginBottom: -50,
    height: 225,
    width: 225,
    borderRadius: 100,
  },
  textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  myButton: {
    top: 30,
    backgroundColor: '#b29705',
    height: 40,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  textInputStyle: {
    height: 45,
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0,
    fontStyle: 'italic',
    paddingRight: 10,
    paddingLeft: 10,
  },
});

export default SignUpScreen;
