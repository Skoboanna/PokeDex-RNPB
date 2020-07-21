import React, {useRef, useEffect} from 'react';
import {Animated, View} from 'react-native';

const AnimatedBar = ({value, index}) => {
  const width = useRef(new Animated.Value(0)).current;

  const animate = () => {
    Animated.timing(width, {
      toValue: value,
      delay: index * 150,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animate();
  }, [value]);

  return <Animated.View style={[styles.bar, {width}]} />;
};

const styles = {
  bar: {
    backgroundColor: '#516AAC',
    height: 8,
  },
};

export default AnimatedBar;
