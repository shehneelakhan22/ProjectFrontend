import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_API_URL } from './configUrl';
import { colors } from './constantcolors'

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [error, setError] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setconfirmNewPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleSave = async () => {
    setError('');
    setNewPasswordError('');
    setCurrentPasswordError('');
    setconfirmNewPasswordError('')

    if (!currentPassword || !newPassword || !confirmPassword) {
        setError('Fill all the fields');
    } else if (newPassword === currentPassword) {
      setNewPasswordError('New password cannot be the same as the current password');
    } else if (newPassword !== confirmPassword) {
      setconfirmNewPasswordError('New password and confirm password do not match');
    } else {
      try {
        const response = await fetch(`${BACKEND_API_URL}/changepassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
              current_password: currentPassword,
              new_password: confirmPassword,
           }),
        });
        console.log('hehehS');

        const result = await response.json();

        if (response.ok) {
          setError('');
          setSuccessMessage('Password Changed Successfully');
          setTimeout(() => {
            setSuccessMessage('');
            navigation.navigate('Profile');
          }, 1000);
        } else {
          setCurrentPasswordError(result.error);  //'Current password is incorrect.' in backend
        }
      } catch (error) {
        setError('Network error. Please try again.');
      }
    }
};

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Profile')}>
                    <Ionicons name="close" size={30} color={colors.secondary} /> 
            </TouchableOpacity>
      {successMessage ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}
      <Text style={styles.heading}>Password</Text>

      <View style={styles.textInputContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Current Password Field */}
          <View style={styles.passwordContainer}>
          <Text style={styles.label}>Current Password</Text>
          {currentPasswordError ? <Text style={styles.errorTextstyle}>{currentPasswordError}</Text> : null}
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.textInputStyle,
                focusedInput === 'currentPassword' && { borderColor: '#b29705' },
              ]}
              placeholder="Enter Current Password"
              placeholderTextColor="gray"
              value={currentPassword}
              secureTextEntry={!showPassword.currentPassword}
              onFocus={() => setFocusedInput('currentPassword')}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(text) => {
                setCurrentPassword(text);
              }}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => toggleShowPassword('currentPassword')}>
              <Ionicons name={showPassword.currentPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password Field */}
        <View style={styles.passwordContainer}>
          <Text style={styles.label}>New Password</Text>
          {newPasswordError ? <Text style={styles.errorTextstyle}>{newPasswordError}</Text> : null}
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.textInputStyle,
                focusedInput === 'newPassword' && { borderColor: '#b29705' },
                newPasswordError && { borderColor: 'red' },
              ]}
              placeholder="Enter New Password"
              placeholderTextColor="gray"
              value={newPassword}
              secureTextEntry={!showPassword.newPassword}
              onFocus={() => setFocusedInput('newPassword')}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(text) => {
                setNewPassword(text);
              }}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => toggleShowPassword('newPassword')}>
              <Ionicons name={showPassword.newPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm New Password Field */}
        <View style={styles.passwordContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          {confirmNewPasswordError ? <Text style={styles.errorTextstyle}>{confirmNewPasswordError}</Text> : null}
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.textInputStyle,
                focusedInput === 'confirmPassword' && { borderColor: '#b29705' },
                confirmNewPasswordError && { borderColor: 'red' },
              ]}
              placeholder="Confirm Password"
              placeholderTextColor="gray"
              value={confirmPassword}
              secureTextEntry={!showPassword.confirmPassword}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(text) => {
                setConfirmPassword(text);
              }}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => toggleShowPassword('confirmPassword')}>
              <Ionicons name={showPassword.confirmPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
     

      </View>

      <TouchableOpacity style={styles.myButton} onPress={handleSave}>
        <Text style={styles.NextButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 34,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'transparent',
  },
  heading: {
    fontSize: 30,
    color: '#b29705',
    fontWeight: '400',
    marginBottom: 10,
  },
  NextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight:'500'
  },
  myButton: {
    marginTop: 30,
    backgroundColor: '#b29705',
    height: 50,
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:50,
  },
  textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  passwordContainer: {
    marginBottom: 15,
  },
  errorTextstyle: {
    color: 'red',
    fontSize: 13,
    marginBottom: 5,
    textAlign: 'left',
    width: 250,
    // marginLeft: -56,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputStyle: {
    height: 50,
    width: 320,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white', // Default border color
    paddingRight: 10,
    paddingLeft: 10,
    color: 'white', // Text color when user is typing
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  successBox: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  successText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChangePasswordScreen;

