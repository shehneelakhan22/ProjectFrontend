import React from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { colors } from './constantcolors'

const StartScreen = ({ navigation }) => {

  return (
      <SafeAreaView style={styles.container}>

        <View style={styles.subContainer}>

        <Image
        source={require('../assets/App_logo.png')}
        style={styles.logostyle}
        />

        <View style={styles.TextContainer}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.appName}>Crypto Analyzer</Text>
        <Text style={styles.subtitle}>Your gateway to crypto insights and automated trading</Text>
        </View>

        <View style={{ alignItems:'center'}}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => { navigation.navigate('Login');}}>
          <Text style={styles.loginButtonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        </View>

        </View>

      </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.accent
  },
  subContainer:{
    height: screenHeight * 0.9,
    justifyContent:'center'
  },
  logostyle: {
    height:250, 
    width:300,
    alignSelf:'center'
  },
  TextContainer:{
    display:'flex',
    marginBottom: '13%',
    marginTop:screenHeight * 0.13,
    width: screenWidth * 0.8,
  },
  title: {
    color: colors.secondary, 
    fontSize: 28,
    marginTop: 20,
    letterSpacing: 2.4,
    fontWeight:'200'
  },
  appName: {
    marginTop: -7, 
    fontSize: 28,
    marginBottom:20,
    letterSpacing: 2.4,
    fontWeight: '200',
    color:colors.primary
  },
  subtitle:{
    color: colors.secondary,
    letterSpacing: 1.4,
    fontSize: 14,
    fontWeight: '200',
    marginTop: -7,
  },
  loginButton: {
    backgroundColor:colors.primary,
    // height: 50,
    // height:'5.5%',
    height: screenHeight * 0.06,
    width: screenWidth * 0.8,
    // width: 320,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  signUpButton: {
    marginTop:20,
    backgroundColor:'transparent',
    // height: 50,
    // height:'5.5%',
    // width: 320,
    // width:'80%',
    height: screenHeight * 0.06,
    width: screenWidth * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth:1,
    borderColor:colors.primary
  },
  loginButtonText: {
    color: colors.secondary,
    fontWeight:'500',
    fontSize: 16,
  },
  signUpButtonText: {
    color: colors.primary,
    fontWeight:'500',
    fontSize: 16,
  },
});

export default StartScreen;
