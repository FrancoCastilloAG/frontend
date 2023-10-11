import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar'; // Asegúrate de proporcionar la ruta correcta al componente Navbar

const Main = () => {
  return (
    <View style={styles.content}>
      <Navbar />
        <Text style={styles.text}>Aquí estarán los paneles</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Main;
