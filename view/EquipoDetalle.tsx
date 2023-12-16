import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import axios from 'axios';
import useUserStore from '../components/userStore';
import { CheckBox, colors } from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector'
import { User, TeamMember, Team } from './Types';
import { commonStyles } from './Styles';
import { Icon } from "@rneui/base";

type Props = NativeStackScreenProps<RootStackParamList, "EquipoDetalle">;

const EquipoDetalle: React.FC<Props> = ({ navigation }) => {
  const [usuarios, setUsuarios] = useState([]);
  const selectedTeam = useUserStore((state) => state.selectedTeam);
  const url = useUserStore((state) => state.apiUrl);
  const [isModalVisible, setModalVisible] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newRole, setNewRole] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isPickerModalVisible, setPickerModalVisible] = useState(false);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`${url}:3002/teams/${selectedTeam?.id}/members`);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [selectedTeam]);

  useEffect(() => {
    axios.get(`${url}:3001/users`)
      .then(response => setAllUsers(response.data))
      .catch(error => console.error('Error fetching all users:', error));
  }, []);

  const handleUserSelection = (email: string) => {
    if (editingUserId === email) {
      setEditingUserId(null);
      setNewRole('');
    } else {
      const updatedSelectedUsers = selectedUsers.includes(email)
        ? selectedUsers.filter(userEmail => userEmail !== email)
        : [...selectedUsers, email];
      setSelectedUsers(updatedSelectedUsers);
    }
  };

  const handleGuardar = async () => {
    try {
      await axios.post(`${url}:3002/teams/${selectedTeam?.id}/members`, { memberEmails: selectedUsers });
      fetchTeamMembers();
      toggleModal();
    } catch (error) {
      console.error('Error adding users to the team:', error);
    }
  };

  const handleCancelar = () => {
    setSelectedUsers([]);
    toggleModal();
  };

  const eliminarUsuarioAlEquipo = async (id: string) => {
    try {
      await axios.delete(`${url}:3002/teams/${selectedTeam?.id}/members/${id}`);
      fetchTeamMembers();
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const togglePickerModal = () => {
    setPickerModalVisible(!isPickerModalVisible);
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      if (selectedTeam && selectedTeam.id) {
        await axios.patch(`${url}:3002/teams/${selectedTeam.id}/members/${userId}/change-role`, { newRole });
        fetchTeamMembers();
        setPickerModalVisible(!isPickerModalVisible);
      } else {
        console.error('No se ha seleccionado ningún equipo o el equipo no tiene un ID válido.');
      }
    } catch (error) {
      console.error('Error changing role of users in the team:', error);
    }
  };
  const handleEliminarEquipo = async () => {
    try {
      if (selectedTeam && selectedTeam.id) {
        await axios.delete(`${url}:3002/teams/${selectedTeam.id}`);
        navigation.navigate("Equipo")
      } else {
        console.error('No se ha seleccionado ningún equipo o el equipo no tiene un ID válido.');
      }
    } catch (error) {
      console.error('Error changing role of users in the team:', error);
    }
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>{selectedTeam?.nombre}</Text>
      <View style={commonStyles.container2}>
        <TouchableOpacity style={commonStyles.button} onPress={toggleModal}>
          <Text style={commonStyles.buttonText}>Agregar Miembros</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.redButton} onPress={handleEliminarEquipo}>
          <Text style={commonStyles.buttonText}>Eliminar Equipo</Text>
        </TouchableOpacity>
      <Text style={commonStyles.subtitle}>Participantes del equipo</Text>
        <ScrollView style={commonStyles.scrollView}>
          {usuarios.length === 0 ? (
            <View>
              <Text style={commonStyles.text}>No hay usuarios en el equipo.</Text>
            </View>
          ) : (
            usuarios.map((usuario: TeamMember) => (
              <View key={usuario.userId}>
                <View style={commonStyles.container2}>
                  <Text style={commonStyles.text}>{usuario.nombre}</Text>
                  <Text style={commonStyles.text}>{usuario.email}</Text>
                  <Text style={commonStyles.text}>{usuario.role}</Text>
                  <TouchableOpacity
                    style={commonStyles.redButton}
                    onPress={() => eliminarUsuarioAlEquipo(usuario.userId)}
                  >
                    <Icon name="delete" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={commonStyles.greenButton}
                    onPress={() => {
                      setEditingUserId(usuario.userId);
                      togglePickerModal();
                    }}
                  >
                    <Text style={commonStyles.buttonText}>Cambiar Rol</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPickerModalVisible}
        onRequestClose={togglePickerModal}
      >
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text>Selecciona un rol:</Text>
            <ModalSelector
              data={[
                { label: 'Designer', key: 0,value:'Designer' },
                { label: 'UX/UI', key: 1 ,value:'UX/UI'},
                { label: 'Programmer', key: 2 ,value:'Programmer'},
              ]}
              initValue={newRole || 'Seleccionar rol'}
              onChange={(option) => setNewRole(option.label)}
            />
            <TouchableOpacity
              style={commonStyles.greenButton}
              onPress={() => handleChangeRole(editingUserId!, newRole)}
            >
              <Text style={commonStyles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.redButton} onPress={togglePickerModal}>
              <Text style={commonStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancelar}
      >
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalContent}>
            <Text>Selecciona usuarios para agregar al equipo:</Text>
            {allUsers.map((user: User) => (
              <View key={user.email} >
                <CheckBox
                  title={`${user.nombre} (${user.email})`}
                  checked={selectedUsers.includes(user.email)}
                  onPress={() => handleUserSelection(user.email)}
                />
              </View>
            ))}
            <TouchableOpacity style={commonStyles.greenButton} onPress={handleGuardar}>
              <Text style={commonStyles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.redButton} onPress={handleCancelar}>
              <Text style={commonStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EquipoDetalle;
