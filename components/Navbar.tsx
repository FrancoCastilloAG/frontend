import React from 'react';
import { View, Text, TextInput,TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importa el icono de usuario desde @expo/vector-icons

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <Ionicons name="ios-person" size={30} color="white" style={styles.profileIcon} />
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar..."
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1877f2', // Color de fondo similar al de Facebook
    padding: 10,
    paddingHorizontal: 16,
    marginTop: 40
  },
  profileIcon: {
    fontSize: 30,
  },
  searchBar: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: 'white',
  },
  searchButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Navbar;
