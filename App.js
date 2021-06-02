import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState(false);

  const aniValue = useSharedValue(50)
  const aniStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(aniValue.value, { duration: 300 }),
      height: withTiming(aniValue.value, { duration: 300 }),
      borderRadius: withTiming((150 / (300 - 50)) * aniValue.value - 30, { duration: 300 })
    }
  })
  const size = aniValue.value

  const Handler = useAnimatedGestureHandler({
    onStart: () => { aniValue.value = 300 },
    onActive: (evt) => {
      let [X, Y] = [evt.x - size / 2, evt.y - size / 2]
      let theta = 360 * Math.atan(Y / X) / (2 * Math.PI) //in deg
      if (Y < 0) theta = 180 + (theta)
      const checkAngle = (totalCase, caseId) => {
        //calculated in deg
        let center = 360 * caseId / totalCase - 90
        let upperLimit = center + 180 / totalCase
        let lowerLimit = center - 180 / totalCase
        if (theta < 30 & theta > 0) {
          console.log(caseId)
          return true
        } else { return false }

      }
      if (Y ** 2 > 70 ** 2 - X ** 2 & X ** 2 > 70 ** 2 - Y ** 2) {
        if (checkAngle(10, 1)) runOnJS(setHoveredIndex)(true)
        else { runOnJS(setHoveredIndex)(false) }
      }
      else { runOnJS(setHoveredIndex)(false) }
      aniValue.value = 300
    },
    onFinish: (evt) => {
      runOnJS(setHoveredIndex)(false)
      aniValue.value = 50
    }
  })

  const Btn = function ({ totalCount, index, hoveredIndex }) {
    let r = 90
    let pi = 3.14
    let rad = (2 * pi * index / totalCount) - 0.5 * pi
    let x = Math.round(Math.cos(rad) * r)
    let y = Math.round(Math.sin(rad) * r)
    return (
      <View style={{ opacity: hoveredIndex ? 0.2 : 1, position: 'absolute', width: 50, height: 50, borderRadius: 25, borderWidth: 1, transform: [{ translateX: x }, { translateY: y }] }}>

      </View>
    )
  }

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={Handler}  >
        <Animated.View style={[aniStyle, { width: 50, height: 50, borderWidth: 0, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]}>
          <View style={{ width: 50, height: 50, borderWidth: 1 }} />
          <Btn totalCount={10} index={1} hoveredIndex={hoveredIndex} />
          <Btn totalCount={10} index={2} hoveredIndex={hoveredIndex} />
          <Btn totalCount={10} index={3} hoveredIndex={hoveredIndex} />
          <Btn totalCount={10} index={4} hoveredIndex={hoveredIndex} />
          <Btn totalCount={10} index={5} hoveredIndex={hoveredIndex} />
          <Btn totalCount={10} index={6} hoveredIndex={hoveredIndex} />
          <Btn totalCount={10} index={7} hoveredIndex={hoveredIndex} />
          <Btn totalCount={10} index={8} hoveredIndex={hoveredIndex} />
          <Btn totalCount={10} index={9} hoveredIndex={hoveredIndex} />
          <Btn totalCount={10} index={10} hoveredIndex={hoveredIndex} />




        </Animated.View>
      </PanGestureHandler>
      <StatusBar style="auto" />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

