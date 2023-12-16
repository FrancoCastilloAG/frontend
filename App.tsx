import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./view/Home";
import Perfil from "./view/Perfil";
import Proyectos from "./view/Proyectos";
import ProyectoDetalle from "./view/ProyectoDetalle";
import Register from "./view/Register";
import Equipo from "./view/Equipo";
import EquipoDetalle from "./view/EquipoDetalle";
import Auth from "./view/Auth";
import { StatusBar } from "react-native";
import { Icon } from "@rneui/base";
import RecoverPassword from "./view/RecoverPassword";
import Task from "./view/Task";
import BacklogScreen from "./view/Backlog";

const tabBarOptions = {
  headerShown: false,
  tabBarLabelStyle: { fontSize: 12 },
  tabBarActiveTintColor: "#3498db", // Cambia el color del ícono activo aquí
  tabBarInactiveTintColor: "#bdc3c7",
};

export type RootStackParamList = {
  Auth: undefined;
  TabScreenStack: undefined;
  Proyectos: undefined;
  ProyectoDetalle: undefined;
  EquipoDetalle:undefined;
  Register: undefined;
  Equipo: undefined;
  Home:undefined;
  RecoverPassword:undefined;
  Task:undefined;
  Backlog:undefined;
};

export type TabStackParamList = {
  Home: undefined;
  Proyectos: undefined;
  Perfil: undefined;
  Auth: undefined;
  Equipo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabStackParamList>();

const getTabScreenOptions = (iconName: string, tabBarLabel: string) => {
  return {
    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
      <Icon name={iconName} color={color} size={size} />
    ),
    tabBarLabel,
    ...tabBarOptions,
  };
};

const TabScreenStack = () => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={getTabScreenOptions("home", "Home")}
      />
      <Tab.Screen
        name="Equipo"
        component={Equipo}
        options={getTabScreenOptions("groups", "Equipo")}
      />
      <Tab.Screen
        name="Proyectos"
        component={Proyectos}
        options={getTabScreenOptions("work", "Proyectos")}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={getTabScreenOptions("face", "Perfil")}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="default" />
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ProyectoDetalle" component={ProyectoDetalle} options={{  title: "Detalles del Proyecto",headerShown: true,headerBackVisible: true }}/>
        <Stack.Screen name="EquipoDetalle" component={EquipoDetalle} options={{  title: "Detalles del Equipo",headerShown: true,headerBackVisible: true }}/>
        <Stack.Screen name="TabScreenStack" component={TabScreenStack} />
        <Stack.Screen name="Task" component={Task} options={{  title: "Task",headerShown: true,headerBackVisible: true }}/>
        <Stack.Screen name="Backlog" component={BacklogScreen} options={{  title: "Backlog",headerShown: true,headerBackVisible: true }}/>
        <Stack.Screen name="RecoverPassword" component={RecoverPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;