import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ImageBackground } from 'react-native';
import { BACKEND_API_URL } from './configUrl';

const ProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigation = useNavigation();
  const [password, setPassword] = useState('')
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',});

    useEffect(() => {
      axios.get(`${BACKEND_API_URL}/get_user`)
        .then(response => {
          setUserInfo({
            username: response.data.username,
            email: response.data.email,
          });
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to logout');
      }
  
      // If the logout is successful, navigate to the Start screen
      setModalVisible(false);
      navigation.navigate('Start');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      // Call the delete account endpoint with the entered password
      const response = await fetch(`${BACKEND_API_URL}/delete_account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }), 
         });
  
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
  
      // If the account deletion is successful, navigate to the Start screen
      setDeleteModalVisible(false);
      navigation.navigate('Start');
    } catch (error) {
      console.error('Account deletion error:', error);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/login.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Account</Text>
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.profileElements}>
            <Text style={styles.InfoHeading}>Username</Text>
            <Text style={styles.InfoStyle}>{userInfo.username}</Text>
          </View>
          <View style={styles.profileElements}>
            <Text style={styles.InfoHeading}>Email</Text>
            <Text style={styles.InfoStyle}>{userInfo.email}</Text>
          </View>
          <View style={styles.profilePassword}>
            <TouchableOpacity onPress={() => navigation.navigate('Password')}>
              <Text style={styles.changePassword}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        <TouchableOpacity 
          style={styles.deleteButtonView} 
          onPress={() => setDeleteModalVisible(true)}
        >
          <Text style={styles.deleteButton}>Delete Account</Text>
        </TouchableOpacity>
  
        {/* Delete Account Modal */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Enter your current password</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButtonFinal]}
                  onPress={handleDeleteAccount}
                >
                  <Text style={styles.modalButtonText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
  
        <TouchableOpacity 
          style={styles.logOutButtonView} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.logOutButton}>Log Out</Text>
        </TouchableOpacity>
  
        {/* Logout Confirmation Modal */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Are you sure you want to logout?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.logoutButton]}
                  onPress={handleLogout}
                >
                  <Text style={styles.modalButtonText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    marginLeft: -8,
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'red'
  },
  profileContainer: {
    marginTop: 20,
    width: '100%',
    height: 250,
  },
  profileElements: {
    justifyContent: 'center',
    height: 70,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#858784',
    borderRadius: 10,
  },
  InfoHeading: {
    fontSize: 18,
    fontWeight: '500',
    color:'red'
  },
  textInputContainer: {
    marginBottom:30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 50,
    borderWidth:1,
    fontStyle: 'italic',
    paddingRight: 10,
    paddingLeft: 10,
  },
  InfoStyle: {
    paddingTop: 5,
    color: '#50524f',
    fontSize: 15,
  },
  profilePassword: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#858784',
    borderRadius: 10,
  },
  changePassword: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20,
  },
  deleteButtonView: {
    marginTop: 30,
    borderRadius: 20,
    backgroundColor: '#EC3232',
    height: 40,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    color: 'white',
    fontWeight:'600'
  },
  logOutButtonView: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'green',
    height: 40,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logOutButton: {
    color: 'white',
    fontWeight:'600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#858784',
    marginRight: 10,
    borderRadius:20
  },
  logoutButton: {
    // backgroundColor: '#EC3232',
    backgroundColor:'#266FDC',
    borderRadius:20
  },
  deleteButtonFinal:{
     backgroundColor: '#EC3232',
     borderRadius:20
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
