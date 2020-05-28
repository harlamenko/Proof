import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export function BackBtn(props) {
  const { navigation } = props;

  return (
    <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} {...props}>
      <Feather name="arrow-left" size={28} />
    </TouchableOpacity>
  );
}
