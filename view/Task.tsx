import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import useUserStore from '../components/userStore';
import axios from 'axios';
import { commonStyles } from './Styles';
import { Task, User } from './Types';

type Props = NativeStackScreenProps<RootStackParamList, "Task">;

const TaskScreen: React.FC<Props> = ({ navigation }) => {
  const selectedProject = useUserStore((state) => state.selectedProject);
  const token = useUserStore((state) => state.token);
  const url = useUserStore((state) => state.apiUrl);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [selectedEncargado, setSelectedEncargado] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedEstado, setSelectedEstado] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${url}:3002/task/${selectedProject?.id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedProject]);

  useEffect(() => {
    axios.get(`${url}:3001/users`)
      .then(response => setAllUsers(response.data))
      .catch(error => console.error('Error fetching all users:', error));
  }, []);

  const handleCreateTask = async () => {
    try {
      if (taskName.length < 4 || taskName.length > 10) {
        Alert.alert('Error', 'El nombre de la tarea debe tener entre 4 y 10 caracteres.');
        return;
      }

      await axios.post(`${url}:3002/task`, {
        nombre: taskName,
        idUser: token,
        encargado: selectedEncargado,
        idProyecto: selectedProject?.id,
        desc: '', // Puedes establecer un valor predeterminado o ajustarlo según tus necesidades
      });

      fetchTasks();

      setSelectedEncargado('');
      setTaskName('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskName(task.nombre || '');
    setSelectedEncargado(task.encargado || '');
    setModalVisible(true);
  };

  const handleUpdateTask = async () => {
    try {
      if (!selectedTask) {
        console.error('No se ha seleccionado ninguna tarea para actualizar');
        return;
      }
  
      if (taskName.length < 4 || taskName.length > 10) {
        Alert.alert('Error', 'El nombre de la tarea debe tener entre 4 y 10 caracteres.');
        return;
      }
  
      await axios.patch(`${url}:3002/task/${selectedTask.id}`, {
        nombre: taskName,
        desc: selectedTask.desc,
        encargado: selectedEncargado,
        estado: selectedEstado, // Usa el estado local seleccionado en lugar de selectedTask.estado
      });
  
      fetchTasks();
  
      setSelectedTask(null);
      setSelectedEncargado('');
      setTaskName('');
      setSelectedEstado(''); // Limpia el estado local después de la actualización
      setModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${url}:3002/task/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };


  return (
    <View style={commonStyles.container2}>
      <Text style={commonStyles.title}>Tareas del Proyecto</Text>
      <View>
        <TouchableOpacity
          style={commonStyles.greenButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={commonStyles.buttonText}>Crear Tarea</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.greenButton}
          onPress={() => navigation.navigate('Backlog')}
        >
          <Text style={commonStyles.buttonText}>Ver Backlog</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {tasks.map((item: Task) => (
          <View key={item.id} >
            <Text style={commonStyles.subtitle}>Nombre Tarea</Text>
            <Text style={commonStyles.text}>{item.nombre}</Text>
            <Text style={commonStyles.subtitle}>Encargado</Text>
            <Text style={commonStyles.text}>{item.encargado}</Text>
            <Text style={commonStyles.subtitle}>Fecha</Text>
            <Text style={commonStyles.text}>{item.fecha}</Text>
            <Text style={commonStyles.subtitle}>Estado</Text>
            <Text style={commonStyles.text}>{item.estado}</Text>
            <Text style={commonStyles.subtitle}>Descripcion</Text>
            <Text style={commonStyles.text}>{item.desc}</Text>
            <TouchableOpacity
              style={commonStyles.button}
              onPress={() => handleEditTask(item)}
            >
              <Text style={commonStyles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyles.redButton}
              onPress={() => handleDeleteTask(item.id)}
            >
              <Text style={commonStyles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text>{selectedTask ? 'Editar tarea:' : 'Crear nueva tarea:'}</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Nombre de la tarea (4-10 caracteres)"
              value={taskName}
              onChangeText={(text) => setTaskName(text)}
            />
            <Text>Descripción:</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Descripción de la tarea"
              value={selectedTask?.desc || ''}
              onChangeText={(text) => {
                if (selectedTask) {
                  setSelectedTask((prevTask) => ({
                    ...prevTask,
                    id: prevTask?.id || '',
                    desc: text,
                    nombre: prevTask?.nombre || '',
                    encargado: prevTask?.encargado || '',
                    fecha: prevTask?.fecha || '', // Asegúrate de establecer un valor predeterminado
                    estado: prevTask?.estado || '',
                  }));
                }
              }}
            />
            <Text>Asignar a:</Text>
            <ModalSelector
              data={allUsers.map((user: User) => ({
                key: user.id,
                label: user.nombre,
                value: user.nombre,
              }))}
              initValue={selectedEncargado || 'Seleccionar Encargado'}
              onChange={(option) => setSelectedEncargado(option.label)}
            />
            <Text>Estado de la tarea:</Text>
            <ModalSelector
              data={[
                { key: '1', label: 'Propuesto', value: 'propuesto' },
                { key: '2', label: 'En Proceso', value: 'en proceso' },
                { key: '3', label: 'Terminado', value: 'terminado' },
              ]}
              initValue={selectedEstado || 'Seleccionar Estado'}
              onChange={(option) => setSelectedEstado(option.value)}
            />
            <TouchableOpacity
              style={commonStyles.greenButton}
              onPress={selectedTask ? handleUpdateTask : handleCreateTask}
            >
              <Text style={commonStyles.buttonText}>
                {selectedTask ? 'Guardar Cambios' : 'Crear Tarea'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyles.redButton}
              onPress={() => {
                setSelectedTask(null);
                setSelectedEncargado('');
                setTaskName('');
                setSelectedEstado('');
                setModalVisible(false);
              }}
            >
              <Text style={commonStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskScreen;
