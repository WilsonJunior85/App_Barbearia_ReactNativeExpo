import React from 'react';
import { StatusBar, View } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={{ flex: 1, margin: 24 }}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      {children}
    </View>
  );
};
