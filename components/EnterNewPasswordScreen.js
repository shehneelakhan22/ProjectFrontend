import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const EnterNewPasswordScreen = ({ route, navigation }) => {
  const { currentPassword } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (newPassword === confirmPassword) {
      // Handle password change logic here
      console.log('Password changed successfully');
      // Optionally navigate back or to another screen
      navigation.navigate("Profile");
    } else {
      console.log('Passwords do not match');
    }
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
        placeholder="Enter New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      </View>
      <View style={styles.textInputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      </View>
      
      <TouchableOpacity
        style={styles.myButton}
        onPress={handleSave}>
        <Text style={styles.NextButtonText}>Confirm</Text>
      </TouchableOpacity>
      
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'#0B1631',
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
  heading:{
    fontSize: 30,
    fontWeight: 'bold',
    color:'white',
    bottom:10
},
textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:30
  },
  input: {
    height: 40,
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 8,
    fontStyle: 'italic',
    paddingRight: 10,
    paddingLeft: 10,
  },
  NextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  myButton: {
    top: 30,
    backgroundColor: '#8f1294',
    height: 40,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default EnterNewPasswordScreen;
