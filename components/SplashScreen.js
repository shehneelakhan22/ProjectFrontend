import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash.png')}
        style={styles.logostyle}
      />
      <Text style={styles.textStyle}>Binance Trading Bot</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
    bottom: 180,
  },
  logostyle: {
    marginBottom: 100,
    height: 292,
    width: 292,
    borderRadius: 100,
  },
});

export default SplashScreen;
