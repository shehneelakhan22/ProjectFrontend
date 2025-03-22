import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ChangePasswordScreen = ({ navigation, route }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [storedPassword, setStoredPassword] = useState('');

  useEffect(() => {
    if (route.params?.password && route.params?.email) {
      setStoredPassword(route.params.password);
      setUserEmail(route.params.email);
    }
  }, [route.params]);

  const handleNext = () => {
    if (!currentPassword) {
      setError('Enter your current password.'); // Error for empty input
    } else if (currentPassword === storedPassword) {
      setError(''); // Clear previous errors
      navigation.navigate('ChangePassword', { currentPassword });
    } else {
      setError('Incorrect password. Please try again.');
    }
  };
  

  return (
    // <LinearGradient
    //       colors={['#000000', '#010b30', '#000000']} 
    //       style={styles.backgroundGradient} // Apply gradient to full screen
    //     >

    <View style={styles.container}>
      <Text style={styles.heading}>Password</Text>
      <View style={styles.directionTextView}>
      <Text style={styles.directionText}>To set a new password, please enter your current password first.</Text>
      </View>

      <View style={styles.textInputContainer}>

    <View style={{justifyContent:'flex-start'}}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      </View>
      </View>

      <TouchableOpacity
        style={styles.myButton}
        onPress={handleNext}>
        <Text style={styles.NextButtonText}>Next</Text>
      </TouchableOpacity>

    </View>
    //  </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'black',
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
      color:'white',
      fontWeight: 500,
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
    height:60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:30
  },
  NextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  myButton: {
    marginTop: 30,
    backgroundColor: '#b29705',
    height: 40,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  input: {
    height: 40,
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 0,
    fontStyle: 'italic',
    paddingRight: 10,
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5, // Space between error message and input
  },
});

export default ChangePasswordScreen;
