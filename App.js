import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withTiming, runOnJS, withDelay } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import PiButton from './src/components/PiButton';

export default function App() {

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', height: 300, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', }}>
        <Text>Something else</Text>
      </View>
      <View style={{ zIndex: 100 }}>
        {/* When all buttons show up, some button may be blocked by other views. If it's a problem for you, try using zIndex or Portals. */}
        <PiButton />
      </View>
      <View style={{ width: '100%', height: 250, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', }}>
        <Text>Something else</Text>
      </View>
      <StatusBar style="auto" />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

