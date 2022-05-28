import React from 'react';
import { View, Text } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Add from './screens/Add';
import Edit from './screens/Edit';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{
          headerStyle: {
            backgroundColor: "#0F4C75"
          },
          title: "LCO Netflix App",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#00B7C2",
          }
        }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Add" component={Add} />
          <Stack.Screen name="Edit" component={Edit} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;