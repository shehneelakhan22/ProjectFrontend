import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');

  const handleNext = () => {
    // Navigate to the EnterNewPasswordScreen with the current password
    navigation.navigate('ChangePassword', { currentPassword });
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#0B1631'
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
    bottom: 50,
    backgroundColor: '#266FDC',
    height: 40,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  input: {
    height: 40,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 15,
    fontStyle: 'italic',
    paddingRight: 10,
    paddingLeft: 10,
  },
});

export default ChangePasswordScreen;
