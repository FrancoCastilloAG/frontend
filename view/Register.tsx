import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import useUserStore from '../components/userStore';
import { commonStyles } from './Styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register: React.FC<Props> = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d.*\d)[A-Za-z\d]{4,}$/;
  const url = useUserStore((state) => state.apiUrl);


  const handleRegister = () => {
    if (!emailRegex.test(email)) {
      Alert.alert('Correo Electrónico Inválido', 'Por favor, ingrese un correo electrónico válido.');
      return;
    }
    if (!passwordRegex.test(password)) {
      Alert.alert('Contraseña Incorrecta', 'La contraseña debe tener al menos 4 caracteres, incluyendo al menos 2 números y una letra mayúscula.');
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

    fetch(`${url}:3001/auth/register`, {
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
          navigation.navigate('Auth');
        } else {
          console.error('La respuesta del servidor está vacía o no es válida.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  const handleCancel = () => {
    navigation.navigate('Auth'); // Navega de regreso a la pantalla de autenticación
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Registrarse</Text>
      <TextInput
        style={commonStyles.input}
        onChangeText={(text) => setNombre(text)}
        value={nombre}
        placeholder="Nombre"
        autoCapitalize="words"
      />
      <TextInput
        style={commonStyles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={commonStyles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholder="Contraseña"
        secureTextEntry={true}
      />
      <TouchableOpacity style={commonStyles.greenButton} onPress={handleRegister}>
        <Text style={commonStyles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.redButton} onPress={handleCancel}>
        <Text style={commonStyles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

};

export default Register;
