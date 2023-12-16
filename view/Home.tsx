import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TabStackParamList } from "../App";
import useUserStore from '../components/userStore';

type Props = NativeStackScreenProps<TabStackParamList, "Home">;

const Home: React.FC<Props> = ({ navigation }) => {
  const token = useUserStore((state) => state.token);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default Home;
