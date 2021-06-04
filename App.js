import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withTiming, runOnJS, withDelay } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import PiButton from './src/components/PiButton';

export default function App() {
  const functionArray = [
    () => { alert(1) },
    () => { alert(2) },
    () => { alert(3) },
    () => { alert(4) },
    () => { alert(5) },
    () => { alert(6) },
    () => { alert(7) },
    () => { alert(8) },
    () => { alert(9) },
    () => { alert(10) },
  ]

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', height: 300, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', }}>
        <Text>Something else</Text>
      </View>
      <View style={{ zIndex: 100 }}>
        {/* When all buttons show up, some button may be blocked by other views. If it's a problem for you, try using zIndex or Portals. */}
        <PiButton
          numberOfButtons={10}
          minMaskSize={300}
          minMaskBorderRadius={20}
          maxMaskSize={300}
          minActivateRadius={50}
          maxActivateRadius={150}
          delayMask={300}
          mainButtonComponent={<View style={{ width: 30, height: 30, backgroundColor: 'lightblue' }}></View>}
          mainButtonFunction={() => { console.log('press') }}
          enableMainButtonfunction
          buttonContainerStyle={{ width: 50, height: 50, borderWidth: 1, borderRadius: 25 }}
          buttonContentComponentArray={[<Text>1</Text>, <Text>2</Text>]}
          functionArray={functionArray}
        />
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

