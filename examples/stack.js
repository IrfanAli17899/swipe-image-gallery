import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, View, Dimensions, Animated} from 'react-native';
import {
  FlingGestureHandler,
  Directions,
  State,
  gestureHandlerRootHOC,
} from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const IMAGE_WIDTH = SCREEN_WIDTH * 0.8;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.45;

const pictures = [
  'https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=1200x1200',
];

const Slider = () => {
  const scrollXIndex = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  const setActiveIndex = useCallback(
    (ev, type) => {
      if (type === 'left') {
        if (
          index !== pictures.length - 1 &&
          ev.nativeEvent.state === State.END
        ) {
          setIndex(index + 1);
          scrollXIndex.setValue(index + 1);
        }
      } else if (type === 'right') {
        if (index !== 0 && ev.nativeEvent.state === State.END) {
          setIndex(index - 1);
          scrollXIndex.setValue(index - 1);
        }
      }
    },
    [index, scrollXIndex],
  );

  useEffect(() => {
    Animated.timing(scrollX, {
      toValue: scrollXIndex,
      useNativeDriver: true,
      duration: 400,
    }).start();
  });
  return (
    <FlingGestureHandler
      key="left"
      direction={Directions.LEFT}
      onHandlerStateChange={ev => setActiveIndex(ev, 'left')}>
      <FlingGestureHandler
        key="right"
        direction={Directions.RIGHT}
        onHandlerStateChange={ev => setActiveIndex(ev, 'right')}>
        <View style={styles.container}>
          <View style={StyleSheet.absoluteFillObject}>
            {pictures.map((pic, i) => {
              const opacity = scrollX.interpolate({
                inputRange: [i - 1, i, i + 1],
                outputRange: [0, 1, 0],
              });
              return (
                <Animated.Image
                  key={`drop-${i}`}
                  source={{uri: pic}}
                  style={[StyleSheet.absoluteFillObject, {opacity}]}
                  blurRadius={50}
                />
              );
            })}
          </View>
          <Animated.FlatList
            data={pictures}
            horizontal
            pagingEnabled
            inverted
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => `image-${i}`}
            contentContainerStyle={styles.content_container_style}
            scrollEnabled={false}
            removeClippedSubviews={false}
            CellRendererComponent={({
              item,
              index: ind,
              children,
              style,
              ...props
            }) => {
              const newStyle = [style, {zIndex: pictures.length - ind}];
              return (
                <View style={newStyle} index={ind} {...props}>
                  {children}
                </View>
              );
            }}
            renderItem={({item, index: i}) => {
              const inputRange = [i - 1, i, i + 1];
              const translateX = scrollX.interpolate({
                inputRange,
                outputRange: [50, 0, -100],
              });
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1, 1.3],
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [1 - 1 / 3, 1, 0],
              });
              return (
                <Animated.View
                  style={[
                    styles.image_container,
                    {transform: [{translateX}, {scale}], opacity},
                  ]}>
                  <Image style={styles.image} source={{uri: item}} />
                </Animated.View>
              );
            }}
          />
        </View>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image_container: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -SCREEN_WIDTH / 2,
    bottom: SCREEN_WIDTH / 2,
    top: SCREEN_WIDTH / 2,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  content_container_style: {
    flex: 1,
    // backgroundColor: 'red',
    justifyContent: 'center',
    padding: 10 * 2,
  },
});

export default gestureHandlerRootHOC(Slider);
