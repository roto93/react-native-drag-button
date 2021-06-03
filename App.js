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
    onActive: (evt, ctx) => {
      let [X, Y] = [evt.x - 300 / 2, evt.y - 300 / 2]
      let theta = 360 * Math.atan(Y / X) / (2 * Math.PI) //in deg
      if (X > 0 & Y > 0) { }
      else if (X < 0 & Y > 0) theta = 180 + (theta)
      else if (X > 0 & Y < 0) { }
      else if (X < 0 & Y < 0) theta = 180 + (theta)
      theta += 90
      const checkAngle = (totalCase, caseId) => {
        //calculated in deg
        let center = 360 * caseId / totalCase
        let upperLimit = (center + 180 / totalCase)
        let lowerLimit = (center - 180 / totalCase)
        console.log(center + '   ' + lowerLimit + '   ' + upperLimit + '   ' + theta)
        if (theta < upperLimit & theta > lowerLimit) {
          console.log(caseId)
          return true
        } else if (totalCase === caseId & theta > 0 & theta < 180 / totalCase) {
          return true
        } else { return false }
      }

      if (Y ** 2 > 70 ** 2 - X ** 2 & X ** 2 > 70 ** 2 - Y ** 2) {
        if (checkAngle(10, 1)) runOnJS(setHoveredIndex)(1)
        else if (checkAngle(10, 2)) runOnJS(setHoveredIndex)(2)
        else if (checkAngle(10, 3)) runOnJS(setHoveredIndex)(3)
        else if (checkAngle(10, 4)) runOnJS(setHoveredIndex)(4)
        else if (checkAngle(10, 5)) runOnJS(setHoveredIndex)(5)
        else if (checkAngle(10, 6)) runOnJS(setHoveredIndex)(6)
        else if (checkAngle(10, 7)) runOnJS(setHoveredIndex)(7)
        else if (checkAngle(10, 8)) runOnJS(setHoveredIndex)(8)
        else if (checkAngle(10, 9)) runOnJS(setHoveredIndex)(9)
        else if (checkAngle(10, 10)) runOnJS(setHoveredIndex)(10)
        else { runOnJS(setHoveredIndex)(0) }
      }
      else { runOnJS(setHoveredIndex)(0) }
      aniValue.value = 300
    },
    onFinish: (evt) => {
      switch (hoveredIndex) {
        case 1: runOnJS(alert)('1'); break
        case 2: runOnJS(alert)('2'); break
        case 3: runOnJS(alert)('3'); break
        case 4: runOnJS(alert)('4'); break
        case 5: runOnJS(alert)('5'); break
        case 6: runOnJS(alert)('6'); break
        case 7: runOnJS(alert)('7'); break
        case 8: runOnJS(alert)('8'); break
        case 9: runOnJS(alert)('9'); break
        case 10: runOnJS(alert)('10'); break
        default: runOnJS(alert)('0')
      }

      runOnJS(setHoveredIndex)(0)
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
      <View style={{ opacity: hoveredIndex == index ? 0.2 : 1, position: 'absolute', width: 50, height: 50, borderRadius: 25, borderWidth: 1, transform: [{ translateX: x }, { translateY: y }] }}>

      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Animated.View style={[aniStyle, { borderWidth: 0, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]}>
        <PanGestureHandler onGestureEvent={Handler} >
          <Animated.View style={{ width: 300, height: 300, justifyContent: 'center', alignItems: 'center', }}>
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
      </Animated.View>
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

