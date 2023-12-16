import React, { useState, useEffect ,useCallback } from 'react';
import { View, Text, Button, TextInput, Modal, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import axios from 'axios';
import useUserStore from '../components/userStore'; 
import { Team } from './Types';
import { commonStyles } from './Styles';

type Props = NativeStackScreenProps<RootStackParamList, "Equipo">;

const Equipo: React.FC<Props> = ({ navigation }) => {
  const [teamName, setTeamName] = useState("");
  const [nuevoEquipoVisible, setNuevoEquipoVisible] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const url = useUserStore((state)=> state.apiUrl);
  
  const fetchTeams = useCallback(async () => {
    try {
      const response = await axios.get(`${url}:3002/teams`);
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }, [url]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleFocus = useCallback(() => {
    // Actualizar la lista de equipos cuando la pantalla se enfoca
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    // Agregar el listener para el evento focus
    const unsubscribeFocus = navigation.addListener('focus', handleFocus);

    // Limpiar el listener cuando el componente se desmonta
    return () => {
      unsubscribeFocus();
    };
  }, [navigation, handleFocus]);

  const handleCrearEquipo = () => {
    setNuevoEquipoVisible(true);
  };

  const createTeam = async () => {
    if (!teamName) {
      Alert.alert('Nombre de Equipo Requerido', 'Por favor, ingrese un nombre de equipo.');
      return;
    }
    if (teamName.length < 4 || teamName.length > 16) {
      Alert.alert('Nombre de Equipo Inválido', 'El nombre del equipo debe tener entre 4 y 16 caracteres.');
      return;
    }

    try {
      const teamData = {
        nombre: teamName,
      };

      const response = await axios.post(`${url}:3002/teams`, teamData);

      if (response.status >= 200 && response.status < 300) {
        const newTeam = response.data; // Obtener el nuevo equipo creado
        setTeams((prevEquipos) => [...prevEquipos, newTeam]); // Actualizar el estado con el nuevo equipo
        setTeamName(""); // Limpiar el campo de entrada
      } else {
        console.error('Error en la solicitud POST.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      setNuevoEquipoVisible(false);
      setTeamName('');
    }
  };
  const handleTeamPress = (team:Team) => {
    useUserStore.setState({ selectedTeam: team });
    navigation.navigate('EquipoDetalle');
};

  return (
<View style={commonStyles.container}>
  <Text style={commonStyles.title}>Equipos</Text>
  <View style={commonStyles.container}>
  <TouchableOpacity style={commonStyles.greenButton} onPress={handleCrearEquipo}>
    <Text style={commonStyles.buttonText}>Crear Nuevo Equipo</Text>
  </TouchableOpacity>
  </View>
  <Modal visible={nuevoEquipoVisible} transparent={true} animationType="slide">
    <View style={commonStyles.modalContainer}>
      <View style={commonStyles.modalContent}>
        <Text style={commonStyles.subtitle}>Nombre del Nuevo Equipo:</Text>
        <TextInput
          value={teamName}
          style={commonStyles.input}
          placeholder='Nombre del nuevo equipo'
          onChangeText={(text) => setTeamName(text)}
        />
        <TouchableOpacity style={commonStyles.greenButton} onPress={createTeam}>
          <Text style={commonStyles.buttonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.redButton}
          onPress={() => setNuevoEquipoVisible(false)}>
          <Text style={commonStyles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>

  <ScrollView style={commonStyles.scrollView}>
  {teams.length === 0 ? (
      <View style={commonStyles.container}>
        <Text style={commonStyles.text}>No hay equipos.</Text>
      </View>
    ) : (
    teams.map((equipo) => (
      <TouchableOpacity
        key={equipo.id}
        style={commonStyles.button}
        onPress={() => handleTeamPress(equipo)}>
        <Text style={commonStyles.buttonText}>{equipo.nombre}</Text>
      </TouchableOpacity>
    )))}
  </ScrollView>
</View>
);
};

export default Equipo;
