import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Fab, Icon, Button, Checkbox, Heading, HStack, View, ScrollView, VStack, Spinner } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [listOfSeasons, setListOfSeasons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getList();
  }, [isFocused]);

  const getList = async () => {
    setLoading(true);
    const storedValue = await AsyncStorage.getItem('@season_list');
    if(!storedValue) {
      setListOfSeasons([]);
    } else {
      const list = JSON.parse(storedValue);
      setListOfSeasons(list);
    }
    setLoading(false);
  };

  const deleteSeason = async (id) => {
    const newList = listOfSeasons.filter((show) => show?.id === id);
    await AsyncStorage.setItem('@season_list', JSON.stringify(newList));
    setListOfSeasons(newList);
  };

  const markComplete = async (id) => {
    const newArr = listOfSeasons.map((show) => {
      if(show.id === id) {
        show.isWatched = !show.isWatched;
      }
      return show;
    });
    await AsyncStorage.setItem('@season_list', JSON.stringify(newArr));
    setListOfSeasons(newList);
  };

  if(loading) {
    return(
      <View style={styles.container}>
        <Spinner color="#00B7C2" />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {listOfSeasons.length == 0 ? (
        <View style={styles.emptyContainer}>
          <Heading style={styles.heading} size="md">Watchlist is empty! Please add a season</Heading>
        </View>
      ) : (
        <View>
          <Heading style={styles.heading} size="md">List of seasons</Heading>
          {listOfSeasons.map((item) => (
            <HStack mr={2} space={2} key={item.id} justifyContent="center" alignItems="center" style={styles.listItem}>
              <Button style={styles.actionButton} colorScheme="danger">
                <Icon name="trash" size={7} as={Ionicons} active color="white" />
              </Button>
              <Button style={styles.actionButton} colorScheme="blue">
                <Icon name="create" size={7} as={Ionicons} active color="white" />
              </Button>
              <VStack flex={1} justifyContent="center" alignItems="center">
                <Heading size="sm" style={styles.seasonName}>{item.name}</Heading>
                <Heading size="xs">{item.totalNoSeason} seasons</Heading>
              </VStack>
              <Checkbox defaultIsChecked accessibilityLabel="This is a checkbox" />
            </HStack>
          ))}
        </View>
      )}
      <Fab renderInPortal={false} style={styles.fab} size={16} placement="bottom-right" icon={<Icon name="add" size={10} as={Ionicons} />} onPress={() => { navigation.navigate("Add") }}></Fab>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
  },
  heading: {
    textAlign: 'center',
    color: '#00b7c2',
    marginVertical: 15,
    marginHorizontal: 5,
  },
  actionButton: {
    marginLeft: 5,
  },
  seasonName: {
    color: '#fdcb9e',
    textAlign: 'justify',
  },
  listItem: {
    marginLeft: 0,
    marginBottom: 20,
  },
  fab: {
    backgroundColor: "#5067FF",
  }
});