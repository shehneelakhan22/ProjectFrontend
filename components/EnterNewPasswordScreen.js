import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

const EnterNewPasswordScreen = ({ route, navigation }) => {
  const { currentPassword } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (newPassword === confirmPassword) {
      console.log('Password changed successfully');
      navigation.navigate("Profile");
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New Password</Text>
      <View style={styles.directionTextView}>
            <Text style={styles.directionText}>Please enter a new password.</Text>
            </View>
      <View style={styles.textInputContainer}>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      </View>
      <View style={styles.textInputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'black',
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
    fontSize: 26,
    fontWeight: 500,
    color:'white',
},
directionTextView:{
  width:280,
  marginTop:10
},
directionText:{
  color:'#fff',
  fontSize: 12,
  textAlign:'center'
},
textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:20
  },
  input: {
    height: 40,
    width: 300,
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
    marginTop: 20,
    backgroundColor: '#b29705',
    height: 40,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default EnterNewPasswordScreen;
