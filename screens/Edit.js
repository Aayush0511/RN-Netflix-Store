import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, FormControl, Heading, Input, View } from "native-base";
import { Text, StyleSheet, ScrollView } from "react-native";
import Snackbar from 'react-native-snackbar';
import { isNumRegEx } from "./Add";

const Edit = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [totalNoSeason, setTotalNoSeason] = useState('');
  const [id, setId] = useState(null);

  useEffect(() => {
    const { item } = route.params;
    const { id, name, totalNoSeason } = item;
    setId(id);
    setName(name);
    setTotalNoSeason(totalNoSeason);
  }, []);

  const update = async () => {
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

      const updatedShowDetails = {
        id: id,
        name: name,
        totalNoSeason: totalNoSeason
      };

      let showsArr = JSON.parse(await AsyncStorage.getItem('@season_list'));
      const showToUpdate = showsArr.filter((show) => show?.id === id)[0];
      const final_object = { ...showToUpdate, ...updatedShowDetails };
      showsArr = showsArr.map((show) => {
        if(show?.id === id) {
          return final_object;
        }
        return show;
      });
      await AsyncStorage.setItem('@season_list', JSON.stringify(showsArr));

      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Heading style={styles.heading} size="lg">
          Edit Season
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
          <Button borderRadius={50} mx={5} onPress={() => update()}>
            <Text style={{color: '#EEE'}}>
              Edit
            </Text>
          </Button>
        </FormControl>
      </ScrollView>
    </View>
  );
};

export default Edit;

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