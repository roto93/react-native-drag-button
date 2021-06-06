import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withTiming, runOnJS, withDelay } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import PropTypes from 'prop-types'

const PiButton = ({
    numberOfButtons,
    maxMaskSize,
    minMaskSize,
    minMaskBorderRadius,
    minActivateRadius,
    maxActivateRadius,
    delayMask,
    mainButtonFunction,
    mainButtonComponent,
    disableMainButton,
    pieRadius,
    buttonContainerStyle,
    buttonContentComponentArray,
    functionArray,
    showMask
}
) => {
    const renderArray = new Array(numberOfButtons).fill(0)
    const [hoveredIndex, setHoveredIndex] = useState(-3); //-3 for not press. -2 for select nothing. -1 for press main button. > 0 for press Pie button
    const aniValue = useSharedValue(minMaskSize)
    const aniValueBR = useSharedValue(minMaskBorderRadius)
    const aniValueMainOp = useSharedValue(1)
    const aniStyle = useAnimatedStyle(() => {
        return {
            width: aniValue.value,
            height: aniValue.value,
            borderRadius: aniValueBR.value,
        }
    })
    const aniStyleMainOp = useAnimatedStyle(() => {
        return { opacity: aniValueMainOp.value }
    })
    const delaySetHoveredIndex = (num, ms) => {
        setTimeout(() => {
            setHoveredIndex(num)
        }, ms);
    }

    const Handler = useAnimatedGestureHandler({
        onStart: (evt, ctx) => {
            ctx.state = 'mainButtonPressed'
            runOnJS(setHoveredIndex)(-2)
            // runOnJS(delaySetHoveredIndex)(-2, 150)
            aniValue.value = withDelay(delayMask, withTiming(maxMaskSize, { duration: 300 }))
            aniValueBR.value = withDelay(delayMask, withTiming(maxMaskSize / 2, { duration: 300 }))
            aniValueMainOp.value = 0.3
        },
        onActive: (evt, ctx) => {
            aniValueMainOp.value = withTiming(1)
            ctx.state = ''
            // if (aniValue.value !== minMaskSize) {
            let [X, Y] = [evt.x - maxMaskSize / 2, evt.y - maxMaskSize / 2]
            let theta = 360 * Math.atan(Y / X) / (2 * Math.PI) //in deg
            if (X > 0 & Y > 0) { }
            else if (X < 0 & Y > 0) theta = 180 + (theta)
            else if (X > 0 & Y < 0) { }
            else if (X < 0 & Y < 0) theta = 180 + (theta)
            let eachButtonAngle = 360 / numberOfButtons
            theta += 90
            // if minActiveRadius < r < maxActiveRadius
            if (Y ** 2 > minActivateRadius ** 2 - X ** 2
                & X ** 2 > minActivateRadius ** 2 - Y ** 2
                & Y ** 2 < maxActivateRadius ** 2 - X ** 2
                & X ** 2 < maxActivateRadius ** 2 - Y ** 2) {
                theta += eachButtonAngle / 2
                if (theta > 360) theta -= 360
                let i = Math.floor(theta * numberOfButtons / 360)
                runOnJS(setHoveredIndex)(i)
            }
            // if r < minActiveRadius
            else if (Y ** 2 < minActivateRadius ** 2 - X ** 2
                & X ** 2 < minActivateRadius ** 2 - Y ** 2) {
                runOnJS(setHoveredIndex)(-2)
            } else { runOnJS(setHoveredIndex)(-1) }
            // }
        },
        onFinish: (evt, ctx) => {
            aniValueMainOp.value = withTiming(1)
            let i = 0
            while (i <= numberOfButtons) {
                if (hoveredIndex == i) {
                    if (i < functionArray.length) runOnJS(functionArray[i])()
                    break
                }
                i++
            }

            if (disableMainButton & ctx.state === 'mainButtonPressed' & aniValue.value === minMaskSize) {
                // This will trigger if user release the touch before animation start 
                runOnJS(mainButtonFunction)()
            }
            console.log(hoveredIndex)
            runOnJS(setHoveredIndex)(-3)
            aniValue.value = withTiming(minMaskSize)
            aniValueBR.value = withTiming(minMaskBorderRadius)

        },
    })
    console.log('render')
    const Btn = function ({ totalCount, index, hoveredIndex, children }) {
        let r = pieRadius
        let pi = 3.14
        let rad = (2 * pi * index / totalCount) - 0.5 * pi
        let x = Math.round(Math.cos(rad) * r)
        let y = Math.round(Math.sin(rad) * r)
        return (
            <View style={[{ transform: [{ translateX: x }, { translateY: y }], position: 'absolute', backgroundColor: '#fff' }, buttonContainerStyle]}>
                <View style={{ opacity: hoveredIndex == index ? 1 : 0.4, }}>
                    {
                        <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                            {buttonContentComponentArray ? buttonContentComponentArray[index] : <View style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: '#b7b7a4' }}></View>}
                        </View>
                    }
                </View>
            </View>
        )
    }
    return (
        // 
        <View style={styles.baseContainer}>
            {/*  */}
            <Animated.View style={[aniStyle, styles.mask, { borderWidth: showMask ? 1 : 0 }]}>
                <PanGestureHandler onGestureEvent={Handler} >
                    <Animated.View style={{ width: maxMaskSize, height: maxMaskSize, justifyContent: 'center', alignItems: 'center', }}>
                        <Animated.View style={[aniStyleMainOp,
                            // { opacity: hoveredIndex == -2 ? 0.3 : 1 }
                        ]}>
                            {mainButtonComponent}
                        </Animated.View>
                        {

                            hoveredIndex !== -3 &&
                            renderArray.map((item, index) => <Btn key={index} totalCount={numberOfButtons} index={index} hoveredIndex={hoveredIndex} />)
                        }

                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </View>
    )
}

export default React.memo(PiButton)

const styles = StyleSheet.create({
    baseContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center', },
    mask: { borderWidth: 0, borderColor: 'red', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'absolute' },
})


PiButton.propTypes = {
    numberOfButtons: PropTypes.number.isRequired,
    minMaskSize: PropTypes.number,
    minMaskBorderRadius: PropTypes.number,
    maxMaskSize: PropTypes.number,
    minActivateRadius: PropTypes.number,
    maxActivateRadius: PropTypes.number,
    delayMask: PropTypes.number,
    mainButtonComponent: PropTypes.node,
    mainButtonFunction: PropTypes.func,
    disableMainButton: PropTypes.bool,
    buttonContainerStyle: PropTypes.object,
    buttonContentComponentArray: PropTypes.array,
    functionArray: PropTypes.array,
}

PiButton.defaultProps = {
    numberOfButtons: 2,
    minMaskSize: 50,
    minMaskBorderRadius: 25,
    maxMaskSize: 300,
    minActivateRadius: 50,
    maxActivateRadius: 150,
    delayMask: 300,
    mainButtonComponent:
        <View style={{ width: 50, height: 50, borderWidth: 1, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', opacity: 0.8 }} >
            <Text>Press</Text>
        </View>,
    mainButtonFunction: () => { },
    disableMainButton: true,
    pieRadius: 90,
    buttonContainerStyle: {},
    buttonContentComponentArray: null,
    functionArray: [() => { }, () => { }]
}