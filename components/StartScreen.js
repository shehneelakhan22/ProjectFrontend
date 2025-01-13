import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';

const StartScreen = ({ navigation }) => {
  return (
    <ImageBackground source={require('../assets/bg5.jpg')} style={styles.backgroundImage}>
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.myButton}
        onPress={() => {
          navigation.navigate('SignUp')
        }}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text style={styles.textStyle}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.textStyle, styles.loginText]}>Login</Text>
        </TouchableOpacity>
      </View>
      
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  myButton: {
    backgroundColor:'#266FDC',
    height:40,
    width:150,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:50,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  textStyle: {
    fontSize: 16,
    color:'white',
  },
  loginText: {
    color: '#5F9CF6',
    textDecorationLine: 'underline',
  },
});

export default StartScreen;

