import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import useUserStore from '../components/userStore';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;

const Auth: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d.*\d)[A-Za-z\d]{4,}$/;
  const [showPassword, setShowPassword] = useState(false);
  const setToken = useUserStore((state) => state.setToken);
  const url = useUserStore((state)=> state.apiUrl);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Campos Vacíos', 'Por favor, ingrese su correo y contraseña.');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Correo Electrónico Inválido', 'Por favor, ingrese un correo electrónico válido.');
      return;
    }
    if (!passwordRegex.test(password)) {
      Alert.alert('Contraseña Incorrecta', 'La contraseña debe tener al menos 4 caracteres, incluyendo al menos 2 números y una letra mayúscula.');
      return;
    }
    const userData = {
      email: email,
      password: password
    };
    axios.post(`${url}:3001/auth/login`, userData)
      .then((response) => {
        const data = response.data;
        if (data.error === "email incorrecta") {
          Alert.alert('Email Incorrecto', 'El correo ingresado es incorrecto.');
        } else if (data.error === "Contraseña incorrecta") {
          Alert.alert('Contraseña Incorrecta', 'La contraseña es incorrecta.');
        } else if (data && data.token) {
          setToken(data.token);
          navigation.replace("TabScreenStack");
        } else {
          throw new Error('No se pudo iniciar sesión. Por favor, inténtalo de nuevo.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  const handleForgotPassword = () => {
    navigation.navigate('RecoverPassword')
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jira</Text>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Tu email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Contraseña:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Tu contraseña"
          secureTextEntry={!showPassword}
        />
        <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={30}
            color="#333"
            style={styles.eyeIcon}
          />
        </TouchableWithoutFeedback>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordButtonText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    marginBottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10, // Ajusta la posición según sea necesario
    top: '40%', // Centra verticalmente el ícono
    transform: [{ translateY: -16 }], // Ajusta verticalmente el ícono
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
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
  loginButton: {
    width: '100%',
    backgroundColor: '#1877f2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    width: '100%',
    alignItems: 'center',
  },
  forgotPasswordButtonText: {
    color: '#1877f2',
    fontSize: 16,
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#34A853',
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

export default Auth;
