import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Dimensions, SafeAreaView } from 'react-native';
import { BACKEND_API_URL } from './configUrl';
import { colors } from './constantcolors'
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [usernameEmailText, setUsernameEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [usernameEmailError, setUsernameEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setUsernameEmailError('');
    setPasswordError('');
    setError('')

    if (!usernameEmailText || !passwordText) {
      setError('Please provide both credentials');
      return;
    }
    if (!usernameEmailText && !passwordText) {
      setError('Please provide both credentials');
    }
    try {
      const response = await fetch(`${BACKEND_API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              email_or_username: usernameEmailText,
              password: passwordText, 
           }),
          });
      
      const data = await response.json();

      if (response.status === 400) {
        // Check the error message and show the appropriate error
        if (data.error === 'Email/Username not found') {
          setUsernameEmailError("User doesn't exists");
        } else if (data.error === 'Incorrect password') {
          setPasswordError('Incorrect password. Please try again.');
        } else {
          Alert.alert(data.error || 'An unknown error occurred');
        }
      } else if (response.status === 200) {
        navigation.navigate('Home');
        setUsernameEmailError('');  
        setPasswordError('');  
        setError('');
        setUsernameEmailText('');
        setPasswordText('');
      }
    } catch (error) {
      Alert.alert(
        'Login Error',
        'An unexpected error occured. Please try logging in again.',
        [
          { text: 'OK' }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Start')}>
        <Ionicons name="close" size={30} color={colors.accent} />
        </TouchableOpacity>
              <View style={styles.welcomebackView}>
                  <Text style={styles.welcomeText}>Welcome Back!</Text>
              </View>
      <View style={styles.subContainer}>
        {error ? (
          <Text style={styles.generalErrorText}>{error}</Text>
          ) : null}
          
          <View style={styles.textInputContainer}>
            {usernameEmailError ? (
              <Text style={styles.errorText}>{usernameEmailError}</Text>
              ) : null}
              <TextInput
               placeholder="Enter email or username"
               value={usernameEmailText}
               onChangeText={(text) => setUsernameEmailText(text)}
               onFocus={() => setFocusedField('usernameEmail')}
               onBlur={() => setFocusedField(null)}
               style={[
                styles.textInputStyle,
                focusedField === 'usernameEmail' && { borderColor: colors.primary },
                usernameEmailError && { borderColor: colors.error },
              ]}
              placeholderTextColor="gray"
              />
          </View>

      <View style={styles.textInputContainer}>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <TextInput
        placeholder="Enter password"
        value={passwordText}
        onChangeText={(text) => setPasswordText(text)}onFocus={() => setFocusedField('password')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.textInputStyle,
          focusedField === 'password' && { borderColor: colors.primary },
          passwordError && { borderColor: colors.error },
        ]}
        placeholderTextColor="gray"
        secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.myButton}
        onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.signupView}>
      <Text style={styles.askingStyling}>
        Don't have an account?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
           <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </Text>
      </View>

      </View>

    </SafeAreaView>
    );
};


const styles = StyleSheet.create({
  container: {
    paddingTop:10,
    flex: 1,
    backgroundColor:colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer:{
    flex: 3,
    backgroundColor:colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
    bottom: 0,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  logostyle: {
    marginTop:-100,
    marginBottom: -30,
    height: 250,
    width: 250,
    borderRadius: 100,
  },
  backButton: {
    position: 'absolute',
    top: 29,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'transparent',
  },  
  welcomebackView:{
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf:'center',
    paddingBottom: 10
  },
  welcomeText:{
    color: colors.accent,
    fontSize: 30,
    fontWeight:'400',
    fontStyle:'italic',
    letterSpacing: 2.4,
  },
  textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  myButton: {
    top: 60,
    backgroundColor:colors.primary,
    height: 50,
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  signInButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight:'500'
  },
  signupView:{
    alignItems: 'center',
    marginTop:68,
  },
  askingStyling: {
    color: colors.secondary,
    fontSize: 16, 
  },
  signUpText:{
    color: colors.primary, 
    fontWeight: 'bold',
    marginBottom:-4.5,
    fontSize: 16, 
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 5,
    alignSelf:'flex-start'
  },
  generalErrorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: -5,
    textAlign: 'center',
  },
  textInputStyle: {
    height: 50,
    width: 320,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondary, // Default border color
    paddingRight: 10,
    paddingLeft: 10,
    color: colors.secondary, // Text color when user is typing
  },
  
});

export default LoginScreen;