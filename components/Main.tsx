import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from './Navbar'; // Asegúrate de proporcionar la ruta correcta al componente Navbar

const MainView = () => {
  return (
    <View>
      <Navbar />
      <View style={styles.content}>
        <Text style={styles.text}>Aquí estarán los paneles</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MainView;
