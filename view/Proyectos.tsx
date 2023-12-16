import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, Button, TextInput, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import useUserStore from '../components/userStore';
import { Alert } from 'react-native';
import { Proyecto } from './Types';
import { commonStyles } from './Styles';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, "Proyectos">;

const Proyectos: React.FC<Props> = ({ navigation }) => {
    const [proyectoName, setProyectoName] = useState("");
    const [nuevoProyectoVisible, setNuevoProyectoVisible] = useState(false);
    const userToken = useUserStore((state) => state.token);
    const [projects, setProjects] = useState<Proyecto[]>([]); // State to store the projects
    const url = useUserStore((state) => state.apiUrl);

    const fetchProjects = useCallback(async () => {
        try {
          if (userToken) {
            const response = await axios.get(`${url}:3002/proyectos/${userToken}`);
            if (response) {
              setProjects(response.data);
            } else {
              console.error('Error fetching projects:', response);
            }
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }, [userToken, url]);
    
      useEffect(() => {
        fetchProjects();
      }, [fetchProjects]);
    
      const handleFocus = useCallback(() => {
        // Update the list of projects when the screen is focused
        fetchProjects();
      }, [fetchProjects]);
    
      useEffect(() => {
        // Agregar el listener para el evento focus
        const unsubscribeFocus = navigation.addListener('focus', handleFocus);
    
        // Limpiar el listener cuando el componente se desmonta
        return () => {
          unsubscribeFocus();
        };
      }, [navigation, handleFocus]);

    const handleCrearProyecto = () => {
        setNuevoProyectoVisible(true);
    }
    const createProject = async () => {
        if (!proyectoName) {
            Alert.alert('Nombre de Proyecto Requerido', 'Por favor, ingrese un nombre de proyecto.');
            return;
        }
        if (proyectoName.length < 4 || proyectoName.length > 16) {
            Alert.alert('Nombre de Proyecto Inválido', 'El nombre del proyecto debe tener entre 4 y 16 caracteres.');
            return;
        }

        try {
            const projectData = {
                name: proyectoName,
                idOwner: userToken,
            };

            const response = await fetch(`${url}:3002/proyectos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                const newProject = await response.json(); // Obtener el nuevo proyecto creado
                setProjects((prevProyectos) => [...prevProyectos, newProject]); // Actualizar el estado con el nuevo proyecto
                setProyectoName(""); // Limpiar el campo de entrada
                console.log("Proyecto creado con éxito");
            } else {
                console.error('Error en la solicitud POST.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setNuevoProyectoVisible(false);
            setProyectoName('');
        }
    };
    const handleProjectPress = (proyecto: Proyecto) => {
        useUserStore.setState({ selectedProject: proyecto });
        navigation.navigate('ProyectoDetalle');
    };

    return (
        <View style={commonStyles.container}>
            <Text style={commonStyles.title}>Proyectos del Usuario</Text>
            <View style={commonStyles.container}>
            <TouchableOpacity style={commonStyles.greenButton} onPress={handleCrearProyecto}>
                <Text style={commonStyles.buttonText}>Crear Nuevo Proyecto</Text>
            </TouchableOpacity>
            </View>
            <Modal visible={nuevoProyectoVisible} transparent={true} animationType="slide">
                <View style={commonStyles.modalContainer}>
                    <View style={commonStyles.modalContent}>
                        <Text>Nombre del Nuevo Proyecto:</Text>
                        <TextInput
                            value={proyectoName}
                            placeholder='Nombre para el proyecto'
                            style={commonStyles.input}
                            onChangeText={(text) => setProyectoName(text)}
                        />
                        <TouchableOpacity style={commonStyles.greenButton} onPress={createProject}>
                            <Text style={commonStyles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={commonStyles.redButton}
                            onPress={() => setNuevoProyectoVisible(false)}
                        >
                            <Text style={commonStyles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <ScrollView style={commonStyles.scrollView}>
                {projects.map((project) => (
                    <TouchableOpacity
                        key={project.id}
                        style={commonStyles.button}
                        onPress={() => handleProjectPress(project)}
                    >
                        <Text style={commonStyles.buttonText}>{project.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

export default Proyectos;