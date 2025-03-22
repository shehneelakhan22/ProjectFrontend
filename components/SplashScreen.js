import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const SplashScreen = () => {
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
    </View>
    //  </LinearGradient>
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
    height: 370,
    width: 370,
  },
});

export default SplashScreen;
