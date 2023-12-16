import { Text, View, Button, TextInput, Modal, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from 'react';
import useUserStore from '../components/userStore';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TabStackParamList } from "../App";
import { commonStyles } from "./Styles";
import { User } from './Types';

type Props = NativeStackScreenProps<TabStackParamList, "Perfil">;

const Perfil: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState("");
  const [newName, setNewName] = useState(user ? user.nombre : "");
  const [modalVisible, setModalVisible] = useState(false);
  const [localNombre, setLocalNombre] = useState(""); // Variable local para nombre
  const [localEmail, setLocalEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d.*\d)[A-Za-z\d]{4,}$/;
  const token = useUserStore((state) => state.token);
  const clearToken = useUserStore((state) => state.clearToken);
  const clearTeam = useUserStore((state) => state.clearTeam);
  const clearProject = useUserStore((state) => state.clearProject);
  const url = useUserStore((state) => state.apiUrl);

  useEffect(() => {
    const fetchData = async () => {
      if (token !== null) {
        setUserToken(token);
        // Verifica si los datos ya se han cargado
        if (!localNombre || !localEmail) {
          try {
            const response = await fetch(`${url}:3001/users/profile/${token}`);
            if (response.ok) {
              const userData = await response.json();
              // Almacena los datos en variables locales
              setLocalNombre(userData.nombre);
              setLocalEmail(userData.email);
              // Actualiza el estado user
              setUser(userData);
            } else {
              console.error('Error en la respuesta de la solicitud.');
            }
          } catch (error) {
            console.error('Error al obtener los datos del usuario', error);
          }
        }
      } else {
        console.error('El token es nulo');
      }
    };

    fetchData();
  }, []);

  const handleEditName = () => {
    setModalVisible(true);
  };

  const saveNewName = async () => {
    try {
      const response = await fetch(`${url}:3001/users/${userToken}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: newName }), // El cuerpo es un JSON con la propiedad "nombre"
      });

      if (response.ok) {
        // La solicitud se realizó con éxito (código de respuesta 200)
        const data = await response.json();
        setLocalNombre(newName);
        setModalVisible(false);
        Alert.alert("Éxito", "Nombre actualizado correctamente");
      } else {
        // Hubo un error en la solicitud
        console.error('Error al actualizar el nombre:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", 'Las contraseñas nuevas no coinciden.');
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      Alert.alert("Error", "La nueva contraseña no cumple con los requisitos.");
      return;
    }
    try {
      const passwordData = {
        userId: userToken,
        currentPassword: currentPassword, // Reemplaza con tu variable que almacena la contraseña actual
        newPassword: newPassword,         // Reemplaza con tu variable que almacena la nueva contraseña
      };
      console.log("antes de meterlo al fetch (body) " + JSON.stringify(passwordData))
      const response = await fetch(`${url}:3001/auth/change-password`, {
        method: 'POST', // Cambia de PUT a POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData), // Enviar la contraseña actual y la nueva
      });

      if (response.ok) {
        // La solicitud se realizó con éxito (código de respuesta 200)
        setChangePasswordModalVisible(false);
        // Muestra una alerta
        Alert.alert("Éxito", "Contraseña actualizada correctamente");
        // Puedes restablecer los estados de las contraseñas aquí si es necesario
      } else {
        // Hubo un error en la solicitud
        console.error('Error al cambiar la contraseña:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  const handleLogout = () => {
    clearTeam();
    clearProject();
    clearToken();
    navigation.navigate("Auth")
  };


  return (
    <View style={commonStyles.container}>
      {user ? (
        <View style={commonStyles.container}>
          <Text style={commonStyles.title}>Nombre de usuario</Text>
          <Text style={commonStyles.subtitle}>{localNombre}</Text>
          <Text style={commonStyles.title}>Email</Text>
          <Text style={commonStyles.subtitle}>{localEmail}</Text>
        </View>
      ) : (
        <Text>No se pudo cargar el perfil del usuario.</Text>
      )}
      <TouchableOpacity style={commonStyles.button} onPress={handleEditName}>
        <Text style={commonStyles.buttonText}>Editar Nombre</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={commonStyles.button}
        onPress={() => setChangePasswordModalVisible(true)}
      >
        <Text style={commonStyles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.redButton} onPress={handleLogout}>
          <Text style={commonStyles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text style={commonStyles.subtitle}>Nuevo Nombre:</Text>
            <TextInput
              value={newName}
              placeholder="Nuevo nombre"
              style={commonStyles.input}
              onChangeText={(text) => setNewName(text)}
            />
            <TouchableOpacity style={commonStyles.greenButton} onPress={saveNewName}>
              <Text style={commonStyles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyles.redButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={commonStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={changePasswordModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text>Contraseña Actual:</Text>
            <TextInput
              value={currentPassword}
              placeholder="Tu contraseña"
              style={commonStyles.input}
              onChangeText={(text) => setCurrentPassword(text)}
              secureTextEntry={true}
            />
            <Text>Nueva Contraseña:</Text>
            <TextInput
              value={newPassword}
              style={commonStyles.input}
              placeholder="Nueva contraseña"
              onChangeText={(text) => setNewPassword(text)}
              secureTextEntry={true}
            />
            <Text>Confirmar Nueva Contraseña:</Text>
            <TextInput
              value={confirmNewPassword}
              style={commonStyles.input}
              placeholder="Nueva contraseña"
              onChangeText={(text) => setConfirmNewPassword(text)}
              secureTextEntry={true}
            />
            <TouchableOpacity
              style={commonStyles.greenButton}
              onPress={handleChangePassword}
            >
              <Text style={commonStyles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyles.redButton}
              onPress={() => setChangePasswordModalVisible(false)}
            >
              <Text style={commonStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Perfil;