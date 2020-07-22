import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage'; //
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'; //
import {fetchPokemonImage} from '../apiService';

import {fetchPokemonDetails} from '../apiService'; //
import {useAsyncStorage} from '../hooks/useAsyncStorage'; //

const AbortController = window.AbortController;

export const ListItem = ({item, index, isRefreshing, navigation}) => {
  const [pokemon, setPokemon] = useState(null);

  const [details, setDetails] = useState([]); //
  const [isLoading, setIsLoading] = useState(true); //
  const [detailsSource, setDetailsSource] = useAsyncStorage(
    `@pokeDex_details_${item.name}`,
  ); //

  useEffect(() => {
    (async () => {
      const controller = new AbortController(); //
      const signal = controller.signal; //
      setIsLoading(true); //
      const pokemonDetails = await AsyncStorage.getItem(
        `@pokeDex_details_${item.name}`,
      ); //

      if (pokemonDetails == null) {
        const response = await fetchPokemonDetails(item.url, signal);
        setDetailsSource(response);
      }
      setDetails(detailsSource);
      setIsLoading(false);

      return () => controller.abort();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailsSource]);

  const isActive = !isLoading && details != null;

  const renderDetails = () => {
    if (!isActive) {
      return <ActivityIndicator size="small" />;
    }

    return (
      <>
        <Image
          style={styles.image}
          source={{uri: details.sprites.front_default}}
        />
        <Text style={styles.text}>{item.name}</Text>
        <Text>{item.id}</Text>
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Details', {
          name: item.name,
        })
      }
      key={index}
      style={[
        styles.itemContainer,
        isRefreshing && styles.disableItemContainer,
      ]}>
      {renderDetails()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: '100',
  },
  itemContainer: {
    padding: 8,
  },
  disableItemContainer: {
    backgroundColor: '#eee',
  },
  image: {
    width: 50,
    height: 50,
  },
});
