import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import Navbar from '../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert } from 'react-native';

type RootStackParamList = {
  Tasks: undefined;
  Proyecto: { proyectoId: string };
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tasks'>;

interface AuthProps {
  navigation: AuthScreenNavigationProp;
}

const Main: React.FC<AuthProps> = ({ navigation }) => {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>('');
  const [nuevoProyectoVisible, setNuevoProyectoVisible] = useState(false);
  const [nuevoProyectoNombre, setNuevoProyectoNombre] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const obtenerTokenYProyectos = async () => {
      try {
        const userToken = await AsyncStorage.getItem('token');
        if (userToken) {
          setToken(userToken);

          const response = await fetch(`http://10.127.107.21:3002/proyectos/${userToken}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });

          if (response.ok) {
            const responseData = await response.json();
            setProyectos(responseData);
          } else {
            console.error('Error en la solicitud GET.');
          }
        } else {
          setToken('Token no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el token o proyectos:', error);
      }
    };

    obtenerTokenYProyectos();
  }, []);
  const cargarDatos = async () => {
    try {
      const userToken = await AsyncStorage.getItem('token');
      if (userToken) {
        setToken(userToken);

        const response = await fetch(`http://10.127.107.21:3002/proyectos/${userToken}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setProyectos(responseData);
        } else {
          console.error('Error en la solicitud GET.');
        }
      } else {
        setToken('Token no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener el token o proyectos:', error);
    } finally {
      setRefreshing(false); // Finalizar el proceso de actualización
    }
  };

  const handleProyecto = (proyectoId: string) => {
    navigation.navigate('Proyecto', { proyectoId });
  };

  const handleCrearProyecto = () => {
    setNuevoProyectoVisible(true);
  };

  const createProject = async () => {
    if (!nuevoProyectoNombre) {
      Alert.alert('Nombre de Proyecto Requerido', 'Por favor, ingrese un nombre de proyecto.');
      return;
    }
    if (nuevoProyectoNombre.length < 4 || nuevoProyectoNombre.length > 16) {
      Alert.alert('Nombre de Proyecto Inválido', 'El nombre del proyecto debe tener entre 4 y 16 caracteres.');
      return;
    }
    try {
      const projectData = {
        name: nuevoProyectoNombre,
        idOwner: token,
      };

      const response = await fetch('http://10.127.107.21:3002/proyectos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        // Procesa la respuesta de la solicitud POST
      } else {
        console.error('Error en la solicitud POST.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      setNuevoProyectoVisible(false);
      setNuevoProyectoNombre('');
    }
  };
  const handleRefresh = () => {
    setRefreshing(true); // Iniciar el proceso de actualización
    cargarDatos(); // Cargar los datos al presionar el botón de "Actualizar"
  };

  return (
    <View>
      <Navbar />
      <Button title="Crear Nuevo Proyecto" onPress={handleCrearProyecto} />
      <Button title="Actualizar" onPress={handleRefresh} disabled={refreshing} />
      <ScrollView>
        {proyectos.map((proyecto: any) => (//arreglar este any
          <TouchableOpacity
            key={proyecto.id}
            style={styles.proyectoButton}
            onPress={() => handleProyecto(proyecto.id)}
          >
            <Text style={styles.proyectoText}>{proyecto.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={nuevoProyectoVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Nombre del Nuevo Proyecto:</Text>
            <TextInput
              value={nuevoProyectoNombre}
              style={styles.input}
              onChangeText={(text) => setNuevoProyectoNombre(text)}
            />
            <Button title="Guardar" onPress={createProject} />
            <Button title="Cancelar" onPress={() => setNuevoProyectoVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  proyectoButton: {
    backgroundColor: 'blue',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  proyectoText: {
    fontSize: 18,
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscurecido
  },
});

export default Main;
