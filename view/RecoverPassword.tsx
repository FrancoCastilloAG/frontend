import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import useUserStore from '../components/userStore';
import axios from 'axios';
import { commonStyles } from './Styles';

type Props = NativeStackScreenProps<RootStackParamList, "RecoverPassword">;

const RecoverPassword: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const url = useUserStore((state) => state.apiUrl);
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d.*\d)[A-Za-z\d]{4,}$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleSendCode = async () => {
    if (!emailRegex.test(email)) {
      Alert.alert('Correo Electrónico Inválido', 'Por favor, ingrese un correo electrónico válido.');
      return;
    }
    try {
      // Enviar solicitud HTTP a http://localhost:3001/auth/recover-password con el correo electrónico
      await axios.post(`${url}:3001/auth/recover-password`, { email });

      // Marcar que el código se ha enviado
      setIsCodeSent(true);
      Alert.alert('Código Enviado', 'Se ha enviado un código de verificación al correo electrónico proporcionado.');
    } catch (error) {
      console.error('Error al enviar el código:', error);
      Alert.alert('Error', 'Hubo un error al enviar el código de verificación. Por favor, inténtalo de nuevo.');
    }
  };

  const handleChangePassword = async () => {
    if (!passwordRegex.test(newPassword)) {
      Alert.alert('Contraseña Incorrecta', 'La contraseña debe tener al menos 4 caracteres, incluyendo al menos 2 números y una letra mayúscula.');
      return;
    }
    try {
      // Enviar solicitud HTTP a http://localhost:3001/auth/verify-and-change-password con el código y nueva contraseña
      await axios.post(`${url}:3001/auth/verify-and-change-password`, { code, newPassword });

      // Reiniciar los estados después de cambiar la contraseña
      setEmail('');
      setCode('');
      setNewPassword('');
      setIsCodeSent(false);

      Alert.alert('Contraseña Cambiada', 'La contraseña se ha cambiado correctamente.');
      navigation.navigate('Auth'); // Regresar a la pantalla de autenticación
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      Alert.alert('Error', 'Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
    }
  };
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Recuperar Contraseña</Text>
      <Text style={commonStyles.label}>Correo Electrónico:</Text>
      <TextInput
        style={commonStyles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Tu correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isCodeSent}
      />
      {!isCodeSent ? (
        <TouchableOpacity style={commonStyles.greenButton} onPress={handleSendCode}>
          <Text style={commonStyles.buttonText}>Enviar Código</Text>
        </TouchableOpacity>
      ) : (
        <View style={commonStyles.container}>
          <Text style={commonStyles.label}>Código de Verificación:</Text>
          <TextInput
            style={commonStyles.input}
            onChangeText={(text) => setCode(text)}
            value={code}
            placeholder="Código de verificación"
            keyboardType="numeric"
            secureTextEntry
          />
          <Text style={commonStyles.label}>Nueva Contraseña:</Text>
          <TextInput
            style={commonStyles.input}
            onChangeText={(text) => setNewPassword(text)}
            value={newPassword}
            placeholder="Tu nueva contraseña"
            secureTextEntry
          />

          <TouchableOpacity style={commonStyles.greenButton} onPress={handleChangePassword}>
            <Text style={commonStyles.buttonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={commonStyles.redButton} onPress={() => navigation.navigate('Auth')}>
        <Text style={commonStyles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

};

export default RecoverPassword;
