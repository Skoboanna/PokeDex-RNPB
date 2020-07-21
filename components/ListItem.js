import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {fetchPokemonImage} from '../apiService';

export const ListItem = ({item, index, isRefreshing, navigation}) => {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    // const controller = new AbortController();
    // const signal = controller.signal;
    (async () => {
      // const response = await fetchPokemonImage(item.url, signal);
      const response = await fetchPokemonImage(item.url);
      setPokemon(response);
    })();
    // return () => controller.abort();
  }, []);

  const renderDetails = () => {
    if (!pokemon) {
      return <ActivityIndicator size="small" />;
    }

    return (
      <>
        <Image
          style={styles.image}
          source={{uri: pokemon.sprites.front_default}}
        />
        <Text style={styles.text}>{item.name}</Text>
        <Text>{pokemon.id}</Text>
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
