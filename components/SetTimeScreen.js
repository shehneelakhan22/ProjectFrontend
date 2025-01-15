import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { BACKEND_API_URL } from './configUrl';
import { LinearGradient } from 'expo-linear-gradient';

const TimeScreen = ({ navigation, route }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [error, setError] = useState('');
  const selectedValue = route.params?.selectedValue;

  const handleNext = async () => {
    if (selectedTime) {
      try {
        const response = await fetch(`${BACKEND_API_URL}/save_time`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectedTime, selectedValue }),
        });

        if (!response.ok) {
          throw new Error('Failed to save time interval');
        }

        navigation.navigate('Home', { fromTimeScreen: true, selectedTime });
      } catch (error) {
        console.error(error);
      }
    } else {
      setError('Please select a timeframe');
    }
  };
  

  return (
    <LinearGradient
          colors={['#000000', '#2c032e', '#000000']} 
          style={styles.backgroundGradient} // Apply gradient to full screen
        >
    <View style={styles.container}>
      <Text style={styles.title}>Select TimeFrame</Text>

      <RadioButton.Group
        onValueChange={newValue => {
          setSelectedTime(newValue);
          setError(''); // Clear error when an option is selected
        }}
        value={selectedTime}
      >
        <RadioButton.Item
          label="1 min"
          value="1m"
          labelStyle={styles.radioLabel}
          position="leading"
        />
        <RadioButton.Item
          label="5 mins"
          value="5m"
          labelStyle={styles.radioLabel}
          position="leading"
        />
        <RadioButton.Item
          label="15 mins"
          value="15m"
          labelStyle={styles.radioLabel}
          position="leading"
        />
      </RadioButton.Group>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#0B1631',
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  radioLabel: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  nextButton: {
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: '#8f1294',
    height: 50,
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default TimeScreen;
