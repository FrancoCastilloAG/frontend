import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleResetPassword = () => {
    if (!email) {
      // El campo de correo electrónico está vacío.
      alert('Por favor, ingrese su dirección de correo electrónico.');
      return;
    }
    if (!emailRegex.test(email)) {
      // El correo electrónico no cumple con el formato válido.
      alert('Por favor, ingrese una dirección de correo electrónico válida.');
      return;
    }
    // Agregar lógica para restablecer la contraseña aquí.
    console.log('Restableciendo la contraseña para:', email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer Contraseña</Text>
      <Text style={styles.description}>
        Por favor, ingrese su dirección de correo electrónico asociada a su cuenta para restablecer su contraseña.
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetButtonText}>Restablecer Contraseña</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  resetButton: {
    width: '100%',
    backgroundColor: '#1877f2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPassword;
