import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withTiming, runOnJS, withDelay } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import PropTypes from 'prop-types'

const Error = () => (
    <View style={styles.errorBox}>
        <Text style={styles.errorText}>Error</Text>
    </View>
)

const PiButton = ({
    numberOfButtons,
    maxMaskSize,
    minMaskSize,
    minMaskBorderRadius,
    minActivateRadius,
    maxActivateRadius,
    mainButtonComponent,
    delayMask,
    enableMainButtonfunction,
    mainButtonFunction,
    buttonContainerStyle,
    buttonContentComponentArray,
    functionArray }
) => {
    if (functionArray && typeof functionArray !== 'object') { console.warn('The prop "mainButtonFunction" must be a function'); return <Error /> }
    if (mainButtonFunction && typeof mainButtonFunction !== 'function') { console.warn('The prop "mainButtonFunction" must be a function'); return <Error /> }
    if (buttonContentComponentArray !== undefined) {
        if (typeof buttonContentComponentArray !== 'object') { console.warn('The prop "buttonContentComponentArray" must be an array.'); return <Error /> }
        for (let element of buttonContentComponentArray) {
            if (!React.isValidElement(element)) {
                console.warn('Each element in prop "ButtonContentComponentArray" should be a valid react element.')
                return <Error />
            }
        }
    }
    const warningCheck = () => {
        if (!React.isValidElement(mainButtonComponent)) console.warn('The prop "mainButtonComponent" must be a valid react element.')
        if (functionArray.length !== numberOfButtons) console.warn('The length of prop "functionArray" does not match "numberOfButtons" ')
        if (buttonContentComponentArray?.length !== numberOfButtons) console.log('Warning: The length of prop "buttonContentComponentArray" does not match "numberOfButtons" ')
    }
    useEffect(() => {
        warningCheck()
    }, [])
    const renderArray = new Array(numberOfButtons).fill(0)
    const [hoveredIndex, setHoveredIndex] = useState(-1); // -1 for 'select nothing'. 0 for mainButton
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
            runOnJS(setHoveredIndex)(0)
            console.log('start')
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
            else { runOnJS(setHoveredIndex)(-1) }
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

            if (enableMainButtonfunction & hoveredIndex == 0 & aniValue.value === minMaskSize) {
                // This will trigger if user release the touch before animation start 
                runOnJS(mainButtonFunction)()
            }
            runOnJS(setHoveredIndex)(-1)
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
            <View style={{ opacity: hoveredIndex == index ? 0.2 : 1, transform: [{ translateX: x }, { translateY: y }], position: 'absolute', }}>
                {
                    <View style={[{ justifyContent: 'center', alignItems: 'center' }, buttonContainerStyle]}>
                        {buttonContentComponentArray && buttonContentComponentArray[index - 1]}
                    </View>
                }
            </View>
        )
    }
    return (
        // 
        <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', }}>
            {/*  */}
            <Animated.View style={[aniStyle, { borderWidth: 0, borderColor: 'red', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'absolute' }]}>
                <PanGestureHandler onGestureEvent={Handler} >
                    <Animated.View style={{ width: maxMaskSize, height: maxMaskSize, justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{ opacity: hoveredIndex === 0 ? 0.3 : 1 }}>
                            {
                                mainButtonComponent
                                || <View style={{ width: 50, height: 50, borderWidth: 1, borderRadius: minMaskBorderRadius, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', opacity: 0.8 }} >
                                    <Text>Press</Text>
                                </View>
                            }
                        </View>
                        {renderArray.map((item, key) => <Btn key={key} totalCount={numberOfButtons} index={key + 1} hoveredIndex={hoveredIndex} />)}
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </View>
    )
}

export default PiButton

const styles = StyleSheet.create({})


PiButton.propTypes = {
    numberOfButtons: PropTypes.number,
    minMaskSize: PropTypes.number,
    minMaskBorderRadius: PropTypes.number,
    maxMaskSize: PropTypes.number,
    minActivateRadius: PropTypes.number,
    maxActivateRadius: PropTypes.number,
    delayMask: PropTypes.number,
    mainButtonComponent: PropTypes.node,
    mainButtonFunction: PropTypes.func,
    enableMainButtonfunction: PropTypes.bool,
    buttonContainerStyle: PropTypes.object,
    buttonContentComponentArray: PropTypes.array,
    functionArray: PropTypes.array,
}