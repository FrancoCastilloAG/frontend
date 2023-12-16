import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { commonStyles } from './Styles';
import { Task } from './Types';
import useUserStore from '../components/userStore';


const BacklogScreen = () => {
    const selectedProject = useUserStore((state) => state.selectedProject);
    const url = useUserStore((state) => state.apiUrl);
    const [tasks, setTasks] = useState<Task[]>([]);

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
    }, []);

    const renderTasksByStatus = (status: string, color: string) => (
        <View key={status} style={[{ backgroundColor: color }]}>
            <Text style={commonStyles.subtitle}>{status}</Text>
            {tasks
                .filter((task) => task.estado.toLowerCase() === status.toLowerCase())
                .map((task) => (
                    <View key={task.id} style={commonStyles.container2}>
                        {/* Aquí renderizas la información de cada tarea */}
                        <Text style={commonStyles.text}>Nombre: {task.nombre}</Text>
                        <Text style={commonStyles.text}>Encargado: {task.encargado}</Text>
                        {/* ... Otros campos de la tarea */}
                    </View>
                ))}
        </View>
    );

    return (
        <ScrollView>
            {renderTasksByStatus('Propuesto', 'red')}
            {renderTasksByStatus('En Proceso', 'yellow')}
            {renderTasksByStatus('Terminado', 'green')}
        </ScrollView>
    );
};

export default BacklogScreen;
