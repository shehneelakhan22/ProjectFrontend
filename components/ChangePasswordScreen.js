import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');

  const handleNext = () => {
    // Navigate to the EnterNewPasswordScreen with the current password
    navigation.navigate('ChangePassword', { currentPassword });
  };

  return (
    <LinearGradient
          colors={['#000000', '#2c032e', '#000000']} 
          style={styles.backgroundGradient} // Apply gradient to full screen
        >
    <View style={styles.container}>
      <Text style={styles.heading}>Change Password</Text>
      <View style={styles.textInputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      </View>

      <TouchableOpacity
        style={styles.myButton}
        onPress={handleNext}>
        <Text style={styles.NextButtonText}>Next</Text>
      </TouchableOpacity>

    </View>
     </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'#0B1631'
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  heading:{
      fontSize: 30,
      fontWeight: 'bold',
      color:'white',
      bottom:150
  },
  textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    bottom:70,
  },
  NextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  myButton: {
    bottom: 30,
    backgroundColor: '#8f1294',
    height: 40,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  input: {
    height: 40,
    width: 230,
    backgroundColor: '#fff',
    borderRadius: 8,
    fontStyle: 'italic',
    paddingRight: 10,
    paddingLeft: 10,
  },
});

export default ChangePasswordScreen;
