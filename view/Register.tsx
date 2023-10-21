import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert } from 'react-native';

type RootStackParamList = {
  Auth: undefined;
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList,'Auth'>;

interface AuthProps {
  navigation: AuthScreenNavigationProp;
}

const Register: React.FC<AuthProps> = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleRegister = () => {
    if (!emailRegex.test(email)) {
      Alert.alert('Correo Electrónico Inválido', 'Por favor, ingrese un correo electrónico válido.');
      return;
    }
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Campos Vacíos', 'Por favor, complete todos los campos.');
      return;
    }
    const userData = {
      nombre: nombre,
      email: email,
      password: password,
    };

    fetch('http://10.127.107.21:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          console.log(data);
        } else {
          console.error('La respuesta del servidor está vacía o no es válida.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
      navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setNombre(text)}
        value={nombre}
        placeholder="Nombre"
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholder="Contraseña"
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
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
  registerButton: {
    width: '100%',
    backgroundColor: '#1877f2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Register;
