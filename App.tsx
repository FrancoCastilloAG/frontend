import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import Auth from './view/Auth'; // Tu componente de inicio de sesión
import Main from './view/Main'; // Tu componente de pantalla principal
import Register from './view/Register';
import ResetPass from './view/ResetPass';

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ResetPass" component={ResetPass} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
