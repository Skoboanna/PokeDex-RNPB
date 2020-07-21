import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {fetchPokemonsList} from './apiService';
import {useDebounce} from './hooks/useDebounce';

import {ListHeader} from './components/ListHeader';

const PokeListKey = '@pokedex_List';

const App = () => {
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const storeData = async term => {
    try {
      const jsonValue = JSON.stringify(term);
      await AsyncStorage.setItem(PokeListKey, jsonValue);
    } catch (e) {
      console.error('saving error', e);
    }
  };

  const getData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('reading error', e);
    }
  };

  useEffect(() => {
    (async () => {
      const storedPokeList = await getData(PokeListKey);

      if (storedPokeList == null) {
        const response = await fetchPokemonsList();
        await storeData(response.results);
        setData(response.results);
      } else {
        setData(storedPokeList);
      }
    })();
  }, []);

  const filterPokemonsList = term => {
    console.log(term);
    const filteredList = data.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase()),
    );
    console.log(filteredList);
  };

  const barStyle = Platform.OS === 'ios' ? 'default' : 'light-content';

  const debouncedSearchTerm = useDebounce(term, 500);

  // useEffect(() => {
  //   (async() => {
  //     const storedPokeList = await getData(PokeListKey);
  //     if(debouncedSearchTerm){
  //       const filteredList = filterPokemonsList(storedPokeList, debouncedSearchTerm);
  //       setData(filteredList);
  //     }else {
  //       setData(storedPokeList);
  //     }
  //   })();
  // }, [debouncedSearchTerm]);

  // setData(list);

  // const refreshPokelist = () => {
  // setRefreshing(false);
  // const response = await fetchPokemonsList();
  // await storeData(response.results);
  // setData(response.results);
  // setData();

  // };

    // return (
    //   <>
    //     <StatusBar barStyle={barStyle} backgroundColor="black" />
    //     <SafeAreaView style={styles.appContainer}>
    //       <FlatList
    //         ListHeaderComponent={
    //           <ListHeader onChangeText={filterPokemonsList} />
    //         }
    //         data={data}
    //         keyExtractor={(item, index) => item.name + index}
    //         renderItem={({item, index, separator}) => {
    //           return (
    //             <TouchableOpacity
    //               onPress={() => Alert.alert(item.name, item.url)}
    //               key={index}
    //               style={styles.itemContainer}>
    //               <Text style={styles.text}>{item.name}</Text>
    //             </TouchableOpacity>
    //           );
    //         }}
    //       />
    //     </SafeAreaView>
    //   </>
    // );
  

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor="black" />
      <SafeAreaView style={styles.appContainer}>
        <FlatList
          ListHeaderComponent={<ListHeader />}
          data={data}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({item, index, separator}) => {
            return (
              <TouchableOpacity
                onPress={() => Alert.alert(item.name, item.url)}
                key={index}
                style={styles.itemContainer}>
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: '100',
  },
  itemContainer: {
    padding: 8,
  },
});

export default App;
