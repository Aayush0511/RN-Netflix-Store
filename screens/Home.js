import React, {useState, useEffect} from 'react';
import {StyleSheet, LogBox} from 'react-native';
import {
  Fab,
  Icon,
  Button,
  Checkbox,
  Heading,
  HStack,
  View,
  VStack,
  Spinner,
  Center,
  Image,
  FlatList,
} from 'native-base';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

const Home = ({navigation}) => {
  const isFocused = useIsFocused();
  const [listOfSeasons, setListOfSeasons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    LogBox.ignoreLogs(['Warning:', 'WARN']);
    getList();
  }, [isFocused]);

  const getList = async () => {
    setLoading(true);
    const storedValue = await AsyncStorage.getItem('@season_list');
    if (!storedValue) {
      setListOfSeasons([]);
    } else {
      const list = JSON.parse(storedValue);
      setListOfSeasons(list);
    }
    setLoading(false);
  };

  const deleteSeason = async id => {
    const newList = listOfSeasons.filter(show => show?.id != id);
    await AsyncStorage.setItem('@season_list', JSON.stringify(newList));
    getList();
  };

  const markComplete = async id => {
    const newArr = listOfSeasons.map(show => {
      if (show.id === id) {
        show.isWatched = !show.isWatched;
      }
      return show;
    });
    await AsyncStorage.setItem('@season_list', JSON.stringify(newArr));
    setListOfSeasons(newArr);
  };

  if (loading) {
    return (
      <Center style={styles.emptyContainer}>
        <Spinner color="#00B7C2" />
      </Center>
    );
  }

  return (
    <>
      {listOfSeasons.length == 0 ? (
        <View style={styles.emptyContainer}>
          <Heading style={styles.heading} size="md">
            Watchlist is empty! Please add a season
          </Heading>
        </View>
      ) : (
        <View style={styles.container}>
          <Heading style={styles.heading} size="md">
            List of seasons
          </Heading>
          <FlatList
            data={listOfSeasons}
            renderItem={({item}) => {
              return (
                <HStack
                  mr={2}
                  space={2}
                  key={item.id}
                  justifyContent="center"
                  alignItems="center"
                  style={styles.listItem}>
                  <Button
                    style={styles.actionButton}
                    colorScheme="danger"
                    onPress={() => {
                      deleteSeason(item.id);
                    }}>
                    <Icon
                      name="trash"
                      size={7}
                      as={Ionicons}
                      active
                      color="white"
                    />
                  </Button>
                  <Button
                    style={styles.actionButton}
                    colorScheme="blue"
                    onPress={() => {
                      navigation.navigate('Edit', {item});
                    }}>
                    <Icon
                      name="create"
                      size={7}
                      as={Ionicons}
                      active
                      color="white"
                    />
                  </Button>
                  <VStack flex={1} justifyContent="center" alignItems="center">
                    <Heading size="sm" style={styles.seasonName}>
                      {item.name}
                    </Heading>
                    <Heading size="xs" style={styles.seasonNumber}>
                      {item.totalNoSeason} seasons
                    </Heading>
                  </VStack>
                  <Checkbox
                    accessibilityLabel="This is a checkbox"
                    isChecked={item.isWatched}
                    onChange={() => markComplete(item.id)}
                  />
                </HStack>
              );
            }}></FlatList>
          <Center>
            <Image
              my={2}
              source={{
                uri: 'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
              }}
              alt="Netflix Logo"
              size="lg"
            />
          </Center>
        </View>
      )}
      <Fab
        renderInPortal={false}
        style={styles.fab}
        size={16}
        placement="bottom-right"
        icon={<Icon name="add" size={10} as={Ionicons} />}
        onPress={() => {
          navigation.navigate('Add');
        }}></Fab>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: '#1B262C',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1B262C',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  heading: {
    textAlign: 'center',
    color: '#00B7C2',
    marginVertical: 15,
    marginHorizontal: 5,
  },
  actionButton: {
    marginLeft: 5,
  },
  seasonName: {
    color: '#FDCB9E',
    textAlign: 'justify',
  },
  seasonNumber: {
    color: '#5067FF',
    textAlign: 'justify',
  },
  listItem: {
    marginLeft: 0,
    marginBottom: 20,
  },
  fab: {
    backgroundColor: '#5067FF',
  },
  showsList: {
    position: 'relative',
  },
});
