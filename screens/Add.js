import React, {useState} from 'react';
import {Text, StyleSheet, ScrollView} from 'react-native';
import {
  FormControl,
  Input,
  Button,
  Heading,
  View,
} from 'native-base';
import shortid from 'shortid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

export const isNumRegEx = /^[0-9]+$/;

const Add = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [totalNoSeason, setTotalNoSeason] = useState('');

  const addToList = async () => {
    try {
      if (!name || !totalNoSeason) {
        return Snackbar.show({
          text: "Please add both fields",
          backgroundColor: '#F00',
          textColor: '#FFF',
        });
      } else if (!isNumRegEx.test(totalNoSeason)) {
        return Snackbar.show({
          text: "Number of seasons should a numeric value",
          backgroundColor: '#F00',
          textColor: '#FFF',
        });
      }

      const seasonToAdd = {
        id: shortid.generate(),
        name: name,
        totalNoSeason: totalNoSeason,
        isWatched: false,
      };

      const storedValue = await AsyncStorage.getItem('@season_list');
      const prevList = await JSON.parse(storedValue);

      if (!prevList) {
        const newList = [seasonToAdd];
        await AsyncStorage.setItem('@season_list', JSON.stringify(newList));
      } else {
        prevList.push(seasonToAdd);
        await AsyncStorage.setItem('@season_list', JSON.stringify(prevList));
      }

      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Heading style={styles.heading} size="lg">
          Add To Watchlist
        </Heading>
        <FormControl>
          <Input
            mb={5}
            mx={5}
            borderColor="amber.100"
            style={{color: '#EEE'}}
            borderRadius={50}
            borderWidth={2}
            variant="underlined"
            p={2}
            placeholder="Name of the show"
            value={name}
            onChangeText={text => setName(text)}
          />
          <Input
            mb={5}
            mx={5}
            borderColor="amber.100"
            style={{color: '#EEE'}}
            borderRadius={50}
            borderWidth={2}
            variant="underlined"
            p={2}
            placeholder="Total number of seasons"
            value={totalNoSeason}
            onChangeText={text => setTotalNoSeason(text)}
          />
          <Button borderRadius={50} mx={5} onPress={() => addToList()}>
            <Text style={{color: '#EEE'}}>
              Add
            </Text>
          </Button>
        </FormControl>
      </ScrollView>
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'flex-start',
  },
  heading: {
    textAlign: 'center',
    color: '#00b7c2',
    marginHorizontal: 5,
    marginTop: 50,
    marginBottom: 20,
  },
  formItem: {
    marginBottom: 20,
  },
});
