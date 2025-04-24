import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const StartScreen = ({ navigation }) => {
  return (
      <View style={styles.container}>
        <Image
        source={require('../assets/App_logo.png')}
        style={styles.logostyle}
        />
        <View style={styles.TextContainer}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.appName}>Crypto Analyzer</Text>
        <Text style={styles.subtitle}>Your gateway to crypto insights and automated trading</Text>
        </View>
        
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => { navigation.navigate('Login');}}>
          <Text style={styles.signUpButtonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.loginButtonText}>Sign Up</Text>
        </TouchableOpacity>

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'black'
  },
  logostyle: {
    marginBottom: -30,
    height:300,
    width:300,
    borderRadius: 100,
  },
  TextContainer:{
    display:'flex',
    marginLeft: 30,
    marginBottom: 50,
    marginTop:50,
    width:'85%'
  },
  title: {
    color: 'white', 
    fontSize: 28,
    marginTop: 20,
    letterSpacing: 2.4,
    fontWeight:'200'
  },
  appName: {
    marginTop: -7,
    color: 'white', 
    fontSize: 28,
    marginBottom:20,
    letterSpacing: 2.4,
    fontWeight: '200',
    color:'#b29705'
  },
  subtitle:{
    color: 'white',
    letterSpacing: 1.4,
    fontSize: 14,
    fontWeight: '200',
    marginTop: -7,
  },
  loginButton: {
    backgroundColor:'#b29705',
    height: 50,
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  signUpButton: {
    marginTop:20,
    backgroundColor:'transparent',
    height: 50,
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth:1,
    borderColor:'#b29705'
  },
  signUpButtonText: {
    color:'#fff',
    fontWeight:'500',
    fontSize: 16,
  },
  loginButtonText: {
    color:'#b29705',
    fontWeight:'500',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  textStyle: {
    fontSize: 16,
    color: 'white',
  },
  loginText: {
    fontSize: 16,
    color: '#b29705',
    textDecorationLine: 'underline',
  },
});

export default StartScreen;
