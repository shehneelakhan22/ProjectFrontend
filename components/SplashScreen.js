import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { colors } from './constantcolors'


const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/App_logo.png')}
        style={styles.logostyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent,
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
