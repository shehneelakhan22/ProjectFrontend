import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // const handleSave = () => {
  //   if (!currentPassword && !newPassword && !confirmPassword) {
  //     setError('Fill all the fields');
  //   } else if (newPassword === currentPassword) {
  //     setError('New password cannot be the same as the current password');
  //   } else if (newPassword !== confirmPassword) {
  //     setError('New password and confirm password do not match');
  //   } else {
  //     setError('');
  //     setSuccessMessage('Password Changed Successfully');
  //     setTimeout(() => {
  //       setSuccessMessage('');
  //       navigation.navigate('Profile');
  //     }, 1000);
  //   }
  // };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        setError('Fill all the fields');
    } else if (newPassword === currentPassword) {
        setError('New password cannot be the same as the current password');
    } else if (newPassword !== confirmPassword) {
        setError('New password and confirm password do not match');
    } else {
        try {
            const response = await fetch(`${BACKEND_API_URL}/change_password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setError('');
                setSuccessMessage('Password Changed Successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                    navigation.navigate('Profile');
                }, 1000);
            } else {
                setError(result.error || 'Failed to change password');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        }
    }
};


  const getInputStyle = (value) => ({
    color: value ? 'white' : 'gray',
    fontStyle: value ? 'normal' : 'italic',
  });

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <View style={styles.container}>
      {successMessage ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}
      <Text style={styles.heading}>Password</Text>

      <View style={styles.textInputContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {[{ label: 'Current Password', placeholder: 'Enter Current Password', value: currentPassword, setValue: setCurrentPassword, field: 'currentPassword' }, 
          { label: 'New Password', placeholder: 'Enter New Password', value: newPassword, setValue: setNewPassword, field: 'newPassword' }, 
          { label: 'Confirm New Password', placeholder: 'Confirm Password', value: confirmPassword, setValue: setConfirmPassword, field: 'confirmPassword' }].map(({ label, placeholder, value, setValue, field }) => (
          <View key={label} style={styles.passwordContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, getInputStyle(value), { borderColor: focusedInput === label ? '#b29705' : 'gray' }]}
                placeholder={placeholder}
                placeholderTextColor="gray"
                value={value}
                onChangeText={setValue}
                secureTextEntry={!showPassword[field]}
                onFocus={() => setFocusedInput(label)}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => toggleShowPassword(field)}>
                <Ionicons name={showPassword[field] ? 'eye-off' : 'eye'} size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  heading: {
    fontSize: 26,
    color: '#b29705',
    fontWeight: 'bold',
    marginBottom: 10,
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
  textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  passwordContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 260,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingRight: 10,
    paddingLeft: 10,
    borderWidth: 2,
    color: 'white',
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

