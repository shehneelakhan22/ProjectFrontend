import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { BACKEND_API_URL } from './configUrl';

const SignUpScreen = ({ navigation }) => {
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [rePasswordText, setRePasswordText] = useState('');
  const [usernameText, setUsernameText] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePasswordError, setRePasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');



  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailPattern.test(email);
  };

  const validateUsername = (username) => {
    const usernamePattern = /^[a-z0-9._]+$/;
    return usernamePattern.test(username);
  };

  const handleSignUp = async () => {
    setError('');
    setEmailError(''); 
    setPasswordError(''); 
    setRePasswordError(''); 
    setUsernameError('');

    if (!emailText || !passwordText || !rePasswordText || !usernameText) {
      setError("Provide all credentials");
    } else if (!validateEmail(emailText)) {
      setEmailError("Email must be in format xyz@gmail.com");
    } else if (passwordText.length < 8) {
      setPasswordError("Minimum 8 characters");
    } else if (passwordText !== rePasswordText) {
      setRePasswordError("Passwords do not match");
    } else if (!validateUsername(usernameText)) {
      setUsernameError("Only lowercase letters, numbers, _ and . allowed");
    } else {

      try {
      const response = await fetch(`${BACKEND_API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
            body: JSON.stringify({
              username: usernameText,
              email: emailText,
              password: passwordText 
           }),
      })
      const data = await response.json();
        if (data.error) {
          if (data.error.toLowerCase().includes("email")) {
            setEmailError(data.error);
          } else if (data.error.toLowerCase().includes("username")) {
            setUsernameError(data.error);
          } else {
            Alert.alert("Error", data.error);
          }
        } else {
          navigation.navigate('Home');
          setError('');
          setEmailError(''); 
          setPasswordError(''); 
          setRePasswordError('');
          setUsernameError('');
          setEmailText('');
          setPasswordText('');
          setRePasswordText('');
          setUsernameText('');
        }
      }
      catch(error) {
        Alert.alert(
          'Sign Up Error',
          'Failed to create account.',
          [
            { text: 'OK' }
          ]
        )
      };
    }

  };

  return (
    <View style={styles.container}>
      <View style={styles.registerView}>
        <Text style={styles.registerText}>Register!</Text>
      </View>
      <View style={styles.subContainer}>
      {/* <Image
      source={require('../assets/App_logo.png')}
      style={styles.logostyle}/> */}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.textInputContainer}>
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          placeholder="Enter email"
          value={emailText}
          onChangeText={(text) => setEmailText(text)}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          style={[
          styles.textInputStyle,
          focusedField === 'email' && { borderColor: '#b29705' },
          emailError && { borderColor: 'red' }, 
        ]}
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.textInputContainer}>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <TextInput
          placeholder="Set password"
          value={passwordText}
          onChangeText={(text) => setPasswordText(text)}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          style={[
          styles.textInputStyle,
          focusedField === 'password' && { borderColor: '#b29705' },
          passwordError && { borderColor: 'red' },
          ]}
          placeholderTextColor="gray"
          secureTextEntry
        />
      </View>

      <View style={styles.textInputContainer}>
        {rePasswordError ? <Text style={styles.errorText}>{rePasswordError}</Text> : null}
        <TextInput
          placeholder="Re-Enter password"
          value={rePasswordText}
          onChangeText={(text) => setRePasswordText(text)}
          onFocus={() => setFocusedField('rePassword')}
          onBlur={() => setFocusedField(null)}
          style={[
          styles.textInputStyle,
          focusedField === 'rePassword' && { borderColor: '#b29705' },
          rePasswordError && { borderColor: 'red' },
          ]}
          placeholderTextColor="gray"
          secureTextEntry
        />
      </View>

      <View style={styles.textInputContainer}>
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        <TextInput
          placeholder="Set Username"
          value={usernameText}
          onChangeText={(text) => setUsernameText(text)}
          onFocus={() => setFocusedField('username')}
          onBlur={() => setFocusedField(null)}
          style={[
          styles.textInputStyle,
          focusedField === 'username' && { borderColor: '#b29705' },
          usernameError && { borderColor: 'red' },
          ]}
          placeholderTextColor="gray"
        />
      </View>

      <TouchableOpacity
        style={styles.myButton}
        onPress={handleSignUp}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.loginView}>
            <Text style={styles.askingStyling}>
              Already have an account?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                 <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </Text>
            </View>

    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#b29705',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerView:{
    marginLeft:-150,
    flex: 1,
    justifyContent: 'flex-end',
  },
  registerText:{
    color:'black',
    fontSize: 40,
    fontWeight:'800',
    fontStyle:'italic',
    letterSpacing: 2.4,
  },
  subContainer:{
    flex: 3,
    backgroundColor:'black',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
    paddingTop: 60,
    bottom: 0,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
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
    marginTop: 15,
  },
  myButton: {
    top: 45,
    backgroundColor: '#b29705',
    height: 50,
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginView:{
    alignItems: 'center',
    marginTop:53,
  },
  askingStyling: {
    color:'white',
    fontSize: 16, 
  },
  loginText:{
    color: '#b29705', 
    fontWeight: 'bold',
    marginBottom:-4.5,
    fontSize: 16, 
  },
  textInputStyle: {
    height: 50,
    width: 320,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white', // Default border color
    paddingRight: 10,
    paddingLeft: 10,
    color: 'white', // Text color when user is typing
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 5,
    textAlign: 'left',
    width: 250,
    marginLeft: -56,
  },
});

export default SignUpScreen;
