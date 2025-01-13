import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import CandleStickChartComponent from './CandleStickChartComponent';

const ChartFullScreen = ({ route, navigation }) => {
  const { coin } = route.params;

  useEffect(() => {
    Orientation.lockToLandscape();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.chartContainer}>
      <CandleStickChartComponent coin={coin} />
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 50,
    backgroundColor: '#63B8CE',
    height: 40,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  chartContainer:{
    height:'100%',
    width:'100%'
  }
});

export default ChartFullScreen;
