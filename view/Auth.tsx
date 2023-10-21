import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Register: undefined;
  ResetPass: undefined;
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList,'Auth'>;

interface AuthProps {
  navigation: AuthScreenNavigationProp;
}

const Auth: React.FC<AuthProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Campos Vacíos', 'Por favor, ingrese su correo y contraseña.');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Correo Electrónico Inválido', 'Por favor, ingrese un correo electrónico válido.');
      return;
    }
    setLoading(true);
    const userData = {
      email: email,
      password: password
    };
    fetch('http://10.127.107.21:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.token) {
          // Guarda el token en AsyncStorage
          AsyncStorage.setItem('token', data.token)
            .then(() => {
              // Navega a la pantalla principal una vez que el token esté guardado
              navigation.navigate('Main');
            })
            .catch(error => {
              console.error('Error al guardar el token:', error);
            });
        } else {
          console.error('La respuesta del servidor está vacía o no es válida.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false); // Deshabilitar el indicador de carga después de la solicitud
      });
  };

  const handleForgotPassword = () => {
    navigation.navigate('ResetPass');
    console.log("Enviar correo de recuperación de contraseña");
  };
  const handleRegister = () => {
    navigation.navigate('Register');
    console.log("Registrar una nueva cuenta");
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jira Software</Text>
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
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholder="Tu contraseña"
        secureTextEntry={true}
      />
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