import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Tasks: undefined;
  Main: undefined;
  Register: undefined;
  ResetPass: undefined;
  Proyecto: { proyectoId: string };
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Proyecto'>;

interface AuthProps {
  navigation: AuthScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'Proyecto'>;
}

const Proyecto: React.FC<AuthProps> = ({ navigation, route }) => {
  const { proyectoId } = route.params;
  const [deleteResult, setDeleteResult] = useState<string | null>(null);
  const [taskName, setTaskName] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [idUser, setIdUser] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);

  const handleDeleteProyecto = async () => {
    try {
      const response = await fetch(`http://10.127.107.21:3002/proyectos/${proyectoId}`, {
        method: 'DELETE',
      });

      if (response.status === 200) {
        setDeleteResult('Proyecto eliminado con éxito');
        // Redirige a la ventana Main después de eliminar el proyecto
        navigation.navigate('Main');
      } else {
        setDeleteResult('Error al eliminar el proyecto');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setDeleteResult('Error de red');
    }
  };
  const getUserFromStorage = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('token');
      if (storedUserId) {
        setIdUser(storedUserId);
      }
    } catch (error) {
      console.error('Error al obtener el usuario desde AsyncStorage:', error);
    }
  };
  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://10.127.107.21:3002/task/${proyectoId}`);
      if (response.status === 200) {
        const data = await response.json();
        // Extract task names from the response and store them in the state
        const taskNames = data.map((task:any) => task.nombre);
        setTasks(taskNames);
      } else {
        setDeleteResult('Error al obtener tareas');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setDeleteResult('Error de red');
    }
  };

  useEffect(() => {
    getUserFromStorage();
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      const response = await fetch(`http://10.127.107.21:3002/task/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: taskName,
          fecha: taskDate,
          idUser, // Usamos el idUser obtenido de AsyncStorage
          idProyecto: proyectoId,
        }),
      });

      if (response.status === 200) {
        setDeleteResult('Tarea creada con éxito');
        // Puedes redirigir a donde desees después de crear la tarea
      } else {
        setDeleteResult('Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setDeleteResult('Error de red');
    }
  };

  return (
    <View>
      <View>
        <TextInput
          placeholder="Nombre de la tarea"
          value={taskName}
          onChangeText={(text) => setTaskName(text)}
        />
        <TextInput
          placeholder="Fecha de creación"
          value={taskDate}
          onChangeText={(text) => setTaskDate(text)}
        />
        <Button title="Crear Tarea" onPress={handleCreateTask} />
        {deleteResult && <Text>{deleteResult}</Text>}
      </View>
      <Button title="Eliminar Proyecto" onPress={handleDeleteProyecto} />
      {deleteResult && <Text>{deleteResult}</Text>}
      <View>
        <Text>Tareas:</Text>
        {tasks.map((task, index) => (
          <Text key={index}>{task}</Text>
        ))}
      </View>
    </View>
  );
};

export default Proyecto;
