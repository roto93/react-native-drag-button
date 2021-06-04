import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withTiming, runOnJS, withDelay } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'

const PiButton = () => {
    const numberOfButtons = 10
    const maxMaskSize = 300
    const minMaskSize = 50
    const minMaskBorderRadius = 20
    const [minActivateRadius, maxActivateRadius] = [70, 150]
    const mainButtonComponent = null
    const delayMask = 300
    const enableMainButtonfunction = true
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

    const renderArray = new Array(numberOfButtons).fill(0)
    const [hoveredIndex, setHoveredIndex] = useState(0); // 0 for 'select nothing'
    const aniValue = useSharedValue(minMaskSize)
    const aniValueBR = useSharedValue(minMaskBorderRadius)
    const aniStyle = useAnimatedStyle(() => {
        return {
            width: aniValue.value,
            height: aniValue.value,
            borderRadius: aniValueBR.value
        }
    })


    const Handler = useAnimatedGestureHandler({
        onStart: () => {
            aniValue.value = withDelay(delayMask, withTiming(maxMaskSize))
            aniValueBR.value = withDelay(delayMask, withTiming(maxMaskSize / 2))
        },
        onActive: (evt) => {
            let [X, Y] = [evt.x - maxMaskSize / 2, evt.y - maxMaskSize / 2]
            let theta = 360 * Math.atan(Y / X) / (2 * Math.PI) //in deg
            if (X > 0 & Y > 0) { }
            else if (X < 0 & Y > 0) theta = 180 + (theta)
            else if (X > 0 & Y < 0) { }
            else if (X < 0 & Y < 0) theta = 180 + (theta)
            theta += 90
            if (Y ** 2 > minActivateRadius ** 2 - X ** 2
                & X ** 2 > minActivateRadius ** 2 - Y ** 2
                & Y ** 2 < maxActivateRadius ** 2 - X ** 2
                & X ** 2 < maxActivateRadius ** 2 - Y ** 2) {
                theta -= 180 / numberOfButtons
                if (theta < 0) theta += 360
                let i = Math.ceil(theta * numberOfButtons / 360)
                runOnJS(setHoveredIndex)(i)
            }
            else { runOnJS(setHoveredIndex)(0) }
        },
        onFinish: (evt) => {
            let i = 0 //functionArray indices start from 0
            while (i <= numberOfButtons) {
                if (hoveredIndex == i + 1) {
                    console.log('call' + i)
                    runOnJS(functionArray[i])()
                    break
                }
                i++
            }

            if (aniValue.value == minMaskSize) {
                console.log('press') // This will trigger if user release the touch before animation start 
            }
            runOnJS(setHoveredIndex)(0)
            aniValue.value = withTiming(minMaskSize)
            aniValueBR.value = withTiming(minMaskBorderRadius)
        },

    })

    const Btn = function ({ totalCount, index, hoveredIndex, children }) {
        let r = 90
        let pi = 3.14
        let rad = (2 * pi * index / totalCount) - 0.5 * pi
        let x = Math.round(Math.cos(rad) * r)
        let y = Math.round(Math.sin(rad) * r)
        return (
            <View style={{ opacity: hoveredIndex == index ? 0.2 : 1, transform: [{ translateX: x }, { translateY: y }], position: 'absolute', width: minMaskSize, height: minMaskSize, justifyContent: 'center', alignItems: 'center', borderRadius: 25, backgroundColor: 'skyblue' }}>
                {children}
                <Text>{index}</Text>
            </View>
        )
    }

    return (
        // 
        <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', }}>
            {/*  */}
            <Animated.View style={[aniStyle, { borderWidth: 1, borderColor: 'red', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'absolute' }]}>
                <PanGestureHandler onGestureEvent={Handler} >
                    <Animated.View style={{ width: maxMaskSize, height: maxMaskSize, justifyContent: 'center', alignItems: 'center', }}>
                        {
                            mainButtonComponent
                            || <TouchableOpacity style={{ width: minMaskSize, height: minMaskSize, borderWidth: 1, borderRadius: minMaskBorderRadius, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', opacity: 0.8 }} >
                                <Text>Button</Text>
                            </TouchableOpacity>
                        }
                        {renderArray.map((item, key) => <Btn key={key} totalCount={numberOfButtons} index={key + 1} hoveredIndex={hoveredIndex} />)}
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </View>
    )
}

export default PiButton

const styles = StyleSheet.create({})
