import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native"
import { BookListScreen } from "./src/screens/BookListScreen"
import { BasicImagePickerScreen } from "./src/screens/BasicImagePickerScreen"
import { useEffect, useState } from 'react';
import { Database } from './src/db/Database';
import { ActivityIndicator, ActivityIndicatorComponent, StyleSheet, Text, View } from 'react-native';
import { BookFormScreen } from './src/screens/BookFormScreen';
import { LoadingOverlay } from './src/components/LoadingOverlay';

const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Database.initDb().then(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Book Form">
        <Drawer.Screen name="Book Form" component={BookFormScreen} />
        <Drawer.Screen name="Book List" component={BookListScreen} />
        <Drawer.Screen name="Basic" component={BasicImagePickerScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}