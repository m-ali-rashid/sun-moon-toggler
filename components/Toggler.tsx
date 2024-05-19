import {
  StyleSheet,
  View,
  SafeAreaView,
  Animated,
  Pressable,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Neomorph, Shadow} from 'react-native-neomorph-shadows';
import clouds from '../assets/clouds.png';
import stars from '../assets/stars.png';

const colors = {
  blue: '#4487BA',
  yellow: '#F3C929',
  cloud: '#B7D2E8',
  black: '#1C2031',
  grey: '#CACED4',
  darkGrey: '#9FA6BA',
  white: '#FDFDFD',
  glare: 'rgba(255, 255, 255, 0.1)',
};

const dimensions = {
  width: 350,
  aspectRatio: 2.5,
  padding: 15,
};
const IS_IOS = Platform.OS === 'ios';

const Toggler = () => {
  const [diameter, setDiameter] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const sunRef = useRef(new Animated.Value(0)).current;
  const moonRef = useRef(new Animated.Value(dimensions.width / 3)).current;
  const moonRotateRef = useRef(new Animated.Value(0)).current;
  const dayNightRef = useRef(
    new Animated.Value(-(dimensions.width / dimensions.aspectRatio + 5)),
  ).current;
  const backgroundColorRef = useRef(new Animated.Value(0)).current;

  const d = diameter - dimensions.padding * 2;
  const styles = getStyles(d);

  const dynamicStyles = {
    backgroundColor: backgroundColorRef.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(68, 135, 186)', 'rgb(0,0,0)'],
    }),
    dayNight: {
      transform: [{translateY: dayNightRef}],
      backgroundColor: backgroundColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgb(68, 135, 186)', 'rgb(0,0,0)'],
      }),
    },
    sun: {
      transform: [{translateX: sunRef}],
      width: d,
      height: d,
    },
    moon: {
      transform: [
        {translateX: moonRef},
        {
          rotate: moonRotateRef.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '40deg'],
          }),
        },
      ],
    },
  };

  const toggleButton = () => {
    setIsOn(!isOn);
    Animated.parallel([
      Animated.timing(sunRef, {
        toValue: isOn ? 0 : dimensions.width - diameter,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(moonRef, {
        toValue: isOn ? dimensions.width / 3 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(moonRotateRef, {
        toValue: isOn ? 0 : 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColorRef, {
        toValue: isOn ? 0 : 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(dayNightRef, {
        toValue: isOn ? -(dimensions.width / dimensions.aspectRatio + 5) : 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setDiameter(height);
  };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.statusBar} />
      <View style={styles.screenContainer}>
        <Pressable
          style={[styles.toggleContainer]}
          onPress={toggleButton}
          onLayout={onLayout}>
          <Animated.View style={[styles.dayNight, dynamicStyles.dayNight]}>
            <Animated.Image
              source={stars}
              style={{
                width: dimensions.width + 10,
                height: dimensions.width / 2.5 + 10,
              }}
            />
            <Animated.Image
              source={clouds}
              resizeMode={'cover'}
              style={{
                width: dimensions.width + 10,
                height: dimensions.width / 2.5 + 10,
              }}
            />
          </Animated.View>
          <Shadow inner swapShadows style={[styles.toggleContainer]}>
            <Animated.View style={[styles.sunContainer]}>
              <Animated.View style={[styles.sunGlare, dynamicStyles.sun]}>
                <View
                  style={[{width: d + 320, height: d + 320}, styles.sunGlare]}>
                  <View
                    style={[
                      {width: d + 200, height: d + 200},
                      styles.sunGlare,
                    ]}>
                    <View
                      style={[
                        {width: d + 90, height: d + 90},
                        styles.sunGlare,
                      ]}>
                      <Neomorph
                        inner
                        style={[{backgroundColor: colors.yellow}, styles.sun]}>
                        <Animated.View
                          style={[dynamicStyles.moon, styles.moon]}>
                          <Neomorph inner style={[styles.sun]}>
                            <View style={styles.moonCrater1} />
                            <View style={styles.moonCrater2} />
                            <View style={styles.moonCrater3} />
                          </Neomorph>
                        </Animated.View>
                      </Neomorph>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </Animated.View>
          </Shadow>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Toggler;

const getStyles = (diameter: number) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    statusBar: {
      height: IS_IOS ? 0 : 50,
    },
    screenContainer: {
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sunContainer: {
      justifyContent: 'center',
      padding: dimensions.padding,
    },
    toggleContainer: {
      width: dimensions.width + 3,
      height: dimensions.width / dimensions.aspectRatio + 3,
      borderRadius: dimensions.width / dimensions.aspectRatio / 2,
      overflow: 'hidden',
      shadowColor: colors.black,
      shadowRadius: 7,
      shadowOffset: {
        width: 5,
        height: 10,
      },
      shadowOpacity: 1,
    },
    dayNight: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    sun: {
      borderRadius: 9999,
      overflow: 'hidden',
      shadowColor: colors.black,
      shadowRadius: 7,
      shadowOffset: {
        width: -5,
        height: -10,
      },
      shadowOpacity: 0.5,
      width: diameter,
      height: diameter,
    },
    sunGlare: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 9999,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    moon: {
      width: diameter,
      height: diameter,
      backgroundColor: colors.grey,
      borderRadius: 9999,
    },
    moonCrater1: {
      backgroundColor: colors.darkGrey,
      width: '21%',
      height: '21%',
      position: 'absolute',
      top: 15,
      left: 50,
      borderRadius: 9999,
    },
    moonCrater2: {
      backgroundColor: colors.darkGrey,
      width: '40%',
      height: '40%',
      position: 'absolute',
      top: 40,
      left: 15,
      borderRadius: 9999,
    },
    moonCrater3: {
      backgroundColor: colors.darkGrey,
      width: '23%',
      height: '23%',
      position: 'absolute',
      top: 60,
      left: 70,
      borderRadius: 9999,
    },
  });
