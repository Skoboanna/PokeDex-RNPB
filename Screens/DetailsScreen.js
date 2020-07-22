import React from 'react';
import {View, Text, Button, Image, ActivityIndicator} from 'react-native';
import useAsyncStorage from '../hooks/useAsyncStorage';
import AnimatedBar from '../components/AnimatedBar';

export const DetailsScreen = ({route}) => {
  const {name} = route.params;
  const [detailsSource, setDetailsSource] = useAsyncStorage(
    `@pokeDex_details_${name}`,
  );

  if (!detailsSource) return <ActivityIndicator />;

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={{
          uri: detailsSource.sprites.front_default,
        }}
        style={styles.image}
      />
      <Text>{name}</Text>

      {detailsSource.stats.map((item, index) => (
        <View key={index}>
          <Text>
            {item.stat.name.toUpperCase()}: {item.base_stat}
          </Text>
          <AnimatedBar value={item.base_stat} />
        </View>
      ))}
    </View>
  );
};

const styles = {
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
};
