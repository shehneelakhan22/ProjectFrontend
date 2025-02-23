import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const SplashScreen = () => {
  return (
    <LinearGradient
      // Define the gradient colors (top to bottom)
      colors={['#000000', '#010b30', '#000000']} 
      style={styles.backgroundGradient} // Apply gradient to full screen
    >
    <View style={styles.container}>
      <Image
        source={require('../assets/Logo.png')}
        style={styles.logostyle}
      />
      {/* <Text style={styles.textStyle}>Binance Trading Bot</Text> */}
    </View>
     </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#2c032e',
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
  textStyle: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
    bottom: 180,
  },
  logostyle: {
    height: 370,
    width: 370,
  },
});

export default SplashScreen;
