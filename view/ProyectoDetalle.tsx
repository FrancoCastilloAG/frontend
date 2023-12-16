import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert, TextInput } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import useUserStore from '../components/userStore';
import axios from 'axios';
import { commonStyles } from './Styles';
import { Team } from './Types';

type Props = NativeStackScreenProps<RootStackParamList, "ProyectoDetalle">;

const ProyectoDetalle: React.FC<Props> = ({ navigation }) => {
  const selectedProject = useUserStore((state) => state.selectedProject);
  const url = useUserStore((state) => state.apiUrl);
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const token = useUserStore((state) => state.token);
  const [isAddTeamModalVisible, setAddTeamModalVisible] = useState(false);
  const [isDeleteProjectModalVisible, setDeleteProjectModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    axios.get(`${url}:3002/teams`)
      .then(response => setAllTeams(response.data))
      .catch(error => console.error('Error fetching all teams:', error));
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${url}:3002/proyectos/${selectedProject?.id}/equipos`);
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    if (selectedProject) {
      fetchTeams();
    }
  }, [selectedProject]);

  const toggleAddTeamModal = () => {
    setAddTeamModalVisible(!isAddTeamModalVisible);
  };

  const toggleDeleteProjectModal = () => {
    setDeleteProjectModalVisible(!isDeleteProjectModalVisible);
  };

  const handleEliminarTeam = async (teamId: string) => {
    if (selectedProject) {
      try {
        await axios.delete(`${url}:3002/proyectos/${selectedProject.id}/equipos/${teamId}`);
        const response = await axios.get(`${url}:3002/proyectos/${selectedProject.id}/equipos`);
        setTeams(response.data);
      } catch (error) {
        console.error('Error deleting team from proyecto:', error);
      }
    }
  };

  const handleCancelar = () => {
    setAddTeamModalVisible(false);
    setDeleteProjectModalVisible(false);
  };

  const handleTeamSelection = async (team: Team) => {
    try {
      await axios.post(`${url}:3002/proyectos/${selectedProject?.id}/equipos`, { equipoId: team.id });
      const response = await axios.get(`${url}:3002/proyectos/${selectedProject?.id}/equipos`);
      setTeams(response.data);
      setAddTeamModalVisible(false);
    } catch (error) {
      console.error('Error adding team to the project:', error);
    }
  };

  const handleEliminarProyecto = async () => {
    try {
      const projectId = selectedProject?.id;

      const response = await axios.post(`${url}:3001/auth/verify-password`, {
        userId: token,
        enteredPassword: password,
      });

      const isPasswordValid = response.data;

      if (isPasswordValid) {
        await axios.delete(`${url}:3002/proyectos/delete`, {
          data: { id: projectId, token, contraseña: password },
        });

        Alert.alert('Proyecto eliminado', 'El proyecto se ha eliminado correctamente.', [
          { text: 'OK', onPress: () => navigation.navigate('Proyectos') },
        ]);
      } else {
        Alert.alert('Error', 'Contraseña incorrecta.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      Alert.alert('Error', 'Hubo un error al intentar eliminar el proyecto. Por favor, intenta nuevamente.');
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>{selectedProject?.name}</Text>
        <TouchableOpacity style={commonStyles.redButton} onPress={toggleDeleteProjectModal}>
          <Text style={commonStyles.buttonText}>Eliminar Proyecto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.button} onPress={toggleAddTeamModal}>
          <Text style={commonStyles.buttonText}>Agregar Equipo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.greenButton}
          onPress={() => navigation.navigate('Task')}
        >
          <Text style={commonStyles.buttonText}>Ver Tareas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.greenButton}
          onPress={() => navigation.navigate('Backlog')}
        >
          <Text style={commonStyles.buttonText}>Ver Backlog</Text>
        </TouchableOpacity>
      </View>
      <Text style={commonStyles.subtitle}>Listado de Equipos</Text>
      <ScrollView style={commonStyles.scrollView}>
        <View style={commonStyles.container}>
          {teams.map((team: Team) => (
            <View key={team.id} style={commonStyles.SideButtonContainer}>
              <Text style={commonStyles.text}>{team.nombre}</Text>
              <TouchableOpacity
                style={commonStyles.eliminationButton}
                onPress={() => handleEliminarTeam(team.id)}
              >
                <Text style={commonStyles.buttonText}>-</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddTeamModalVisible}
        onRequestClose={handleCancelar}
      >
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text>Selecciona un equipo:</Text>
            <ScrollView>
              {allTeams.map((team: Team) => (
                <TouchableOpacity style={commonStyles.button}
                  key={team.id}
                  onPress={() => handleTeamSelection(team)}
                >
                  <Text style={commonStyles.subtitle}>{team.nombre}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={commonStyles.redButton} onPress={handleCancelar}>
              <Text style={commonStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteProjectModalVisible}
        onRequestClose={handleCancelar}
      >
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text style={commonStyles.text}>Introduce tu contraseña para confirmar la eliminación del proyecto:</Text>
            <TextInput
            style={commonStyles.input}
              placeholder="Contraseña"
              secureTextEntry={true}
              value={password}
              onChangeText={(text: string) => setPassword(text)}
            />
            <Text style={commonStyles.text}>Seran eliminados todos los equipos y tareas del proyecto</Text>
            <TouchableOpacity
              style={commonStyles.redButton}
              onPress={handleEliminarProyecto}
            >
              <Text style={commonStyles.buttonText}>Confirmar Eliminación</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyles.button}
              onPress={handleCancelar}
            >
              <Text style={commonStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProyectoDetalle;
