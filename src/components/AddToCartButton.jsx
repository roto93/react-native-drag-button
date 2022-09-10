import React, { memo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withTiming, runOnJS, withDelay } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import PropTypes from 'prop-types'

const PiButton = ({
    disabled,
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
    // console.log('PiButton', Date.now())
    const renderArray = new Array(numberOfButtons).fill(0)
    const [hoveredIndex, setHoveredIndex] = useState(-3);
    // -3 for not press. 
    // -2 for hover on nothing. 
    // -1 for hovering main button. 
    // > 0 for hovering Pie button

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


    const Handler = useAnimatedGestureHandler({
        onStart: (evt, ctx) => {
            if (disabled) return
            ctx.state = 'mainButtonPressed'
            runOnJS(setHoveredIndex)(-2)
            // runOnJS(delaySetHoveredIndex)(-2, 150)
            aniValue.value = withDelay(delayMask, withTiming(maxMaskSize, { duration: 300 }))
            aniValueBR.value = withDelay(delayMask, withTiming(maxMaskSize / 2, { duration: 300 }))
            aniValueMainOp.value = disableMainButton ? 1 : 0.3
            // console.log(evt.translationX)
            ctx.timeStart = Date.now()
        },
        onActive: (evt, ctx) => {
            if (disabled) return
            const panDuration = Date.now() - ctx.timeStart
            if (panDuration < 200) return
            aniValueMainOp.value = withTiming(1)
            ctx.state = 'startPanning'
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
            if (disabled) return
            aniValueMainOp.value = withTiming(1)
            let i = 0
            if (hoveredIndex >= 0 & hoveredIndex < functionArray.length) runOnJS(functionArray[hoveredIndex])()
            if (
                ctx.state === 'mainButtonPressed' &
                aniValue.value === minMaskSize & // 如果 mask 還沒變大
                (Math.abs(evt.translationX) < 30 & Math.abs(evt.translationY) < 30)
            ) {
                // This will trigger if user release the touch before animation start 
                // console.log(evt)
                runOnJS(mainButtonFunction)()
            }
            runOnJS(setHoveredIndex)(-3)
            aniValue.value = withTiming(minMaskSize)
            aniValueBR.value = withTiming(minMaskBorderRadius)
            ctx.state = ''
        }
    })

    return (
        // 
        <View style={styles.baseContainer}>
            <Animated.View style={[aniStyle, styles.mask, { borderWidth: showMask ? 1 : 0 }]}>
                <PanGestureHandler onGestureEvent={Handler}
                    minDist={30}
                // activeOffsetX={30} activeOffsetY={30}
                >
                    <Animated.View style={{ width: maxMaskSize, height: maxMaskSize, justifyContent: 'center', alignItems: 'center' }}>
                        <Animated.View style={[aniStyleMainOp,]}>
                            {mainButtonComponent}
                        </Animated.View>
                        {hoveredIndex !== -3
                            && renderArray.map((item, index) => (
                                <Btn
                                    key={index}
                                    totalCount={numberOfButtons}
                                    index={index}
                                    hoveredIndex={hoveredIndex}
                                    {...{ pieRadius, buttonContentComponentArray, buttonContainerStyle }}
                                />
                            ))}
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        </View>
    )
}

export default memo(PiButton)

const styles = StyleSheet.create({
    baseContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mask: {
        borderWidth: 0,
        borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'absolute'
    },
    defaultMainButton: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        opacity: 0.8
    }
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
    delayMask: 200,
    mainButtonComponent:
        <View style={styles.defaultMainButton} >
            <Text>Press</Text>
        </View>,
    mainButtonFunction: () => { },
    disableMainButton: true,
    pieRadius: 90,
    buttonContainerStyle: {},
    buttonContentComponentArray: null,
    functionArray: [() => { }, () => { }]
}

const Btn = memo(({ totalCount, index, hoveredIndex, pieRadius, buttonContentComponentArray, buttonContainerStyle }) => {
    let r = pieRadius
    let pi = 3.14
    let rad = (2 * pi * index / totalCount) - 0.5 * pi
    let x = Math.round(Math.cos(rad) * r)
    let y = Math.round(Math.sin(rad) * r)
    return (
        <View style={{ transform: [{ translateX: x }, { translateY: y }], position: 'absolute', backgroundColor: '#fff', borderRadius: 100 }}>
            <View style={{ opacity: hoveredIndex == index ? 1 : 0.4 }}>
                <View style={[{ justifyContent: 'center', alignItems: 'center' }, buttonContainerStyle]}>
                    {buttonContentComponentArray
                        ? buttonContentComponentArray[index]
                        : <View style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: '#b7b7a4' }}></View>}
                </View>
            </View>
        </View>
    )
}, (prev, next) => {
    // 只要更新「現在碰的按鈕」和「上一個碰的按鈕」就好，其他的不要更新
    return next.index !== next.hoveredIndex && prev.index !== prev.hoveredIndex
})