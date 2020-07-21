import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {fetchPokemonsList} from '../apiService';
import {ListHeader} from '../components/ListHeader';
import {ListItem} from '../components/ListItem';
import {useDebounce} from '../hooks/useDebounce';
import useAsyncStorage from '../hooks/useAsyncStorage';

const PokeListKey = '@pokedex_List';

// function HomeScreen({navigation}) {
//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <Text>Home Screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   );
// }

export const HomeScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [source, setSource] = useAsyncStorage(PokeListKey);

  const [term, setTerm] = useState('');
  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      console.log('fetchList');
      const list = await AsyncStorage.getItem(PokeListKey);

      if (list == null) {
        console.log('fetchList - empty');
        const response = await fetchPokemonsList();
        setSource(response.results);
      }
      setData(source);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshPokemonsList = async () => {
    console.log('REFRESH');
    setRefreshing(true);
    const response = await fetchPokemonsList();
    console.log(response.results);
    await setSource(response.results);
    setData(source);
    setRefreshing(false);
  };

  const debouncedSearchTerm = useDebounce(term, 250);

  const filterPokemons = useCallback(
    term =>
      source.filter(item =>
        item.name.toLowerCase().includes(term.toLowerCase()),
      ),
    [source],
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('filterPokemons');
      const filteredPokemons = filterPokemons(debouncedSearchTerm);
      setData(filteredPokemons);
    } else {
      setData(source);
    }
  }, [debouncedSearchTerm, source, filterPokemons]);

  const barStyle = Platform.OS === 'ios' ? 'default' : 'light-content';

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor="black" />
      <SafeAreaView style={styles.appContainer}>
        {data == null ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            windowSize={5}
            onRefresh={refreshPokemonsList}
            refreshing={isRefreshing}
            ListHeaderComponent={
              <ListHeader value={term} onChangeText={setTerm} />
            }
            data={data}
            scrollEnabled={!isRefreshing}
            keyExtractor={(item, index) => item.name + index}
            renderItem={({item, index}) => {
              return (
                <ListItem
                  navigation={navigation}
                  item={item}
                  index={index}
                  isRefreshing={isRefreshing}
                />
              );
            }}
          />
        )}
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
  itemDisabled: {
    backgroundColor: 'gray',
  },
});
