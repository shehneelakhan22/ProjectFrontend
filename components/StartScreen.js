import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StartScreen = ({ navigation }) => {
  return (
    // <LinearGradient
    //   colors={['#000000', '#010b30', '#000000']} 
    //   style={styles.backgroundGradient} // Apply gradient to full screen
    // >
      <View style={styles.container}>
        
        <Image
                source={require('../assets/App_logo.png')}
                style={styles.logostyle}
              />
        <TouchableOpacity
          style={styles.myButton}
          onPress={() => {
            navigation.navigate('SignUp');
          }}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text style={styles.textStyle}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    // </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'black'
  },
  // Added backgroundGradient style to cover full screen with gradient
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  logostyle: {
    marginTop:-100,
    marginBottom: -30,
    height: 225,
    width: 225,
    borderRadius: 100,
  },
  myButton: {
    // backgroundColor: '#8f1294',
    backgroundColor:'#b29705',
    height: 40,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  signUpButtonText: {
    color:'#fff',
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
