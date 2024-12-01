import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

const SwipeCard = () => {
  const [cards, setCards] = useState([
    { id: 1, text: 'Card 1' },
    { id: 2, text: 'Card 2' },
    { id: 3, text: 'Card 3' },
  ]);

  const swipe = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      swipe.setValue({ x: dx, y: dy });
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > SWIPE_THRESHOLD;

      if (isActionActive) {
        Animated.timing(swipe, {
          duration: 200,
          toValue: {
            x: direction * width,
            y: dy,
          },
          useNativeDriver: true,
        }).start(() => {
          swipe.setValue({ x: 0, y: 0 });
          setCards((prevCards) => prevCards.slice(1));
        });
      } else {
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 5,
        }).start();
      }
    },
  });

  const rotate = swipe.x.interpolate({
    inputRange: [-width * 1.5, 0, width * 1.5],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  const animatedCardStyle = {
    transform: [
      { translateX: swipe.x },
      { translateY: swipe.y },
      { rotate },
    ],
  };

  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        const isFirst = index === 0;
        const panHandlers = isFirst ? panResponder.panHandlers : {};
        const cardStyle = isFirst ? animatedCardStyle : {};

        return (
          <Animated.View
            key={card.id}
            style={[styles.card, cardStyle, { zIndex: cards.length - index, top: 10 * index }]}
            {...panHandlers}
          >
            <Text style={styles.cardText}>{card.text}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: width - 40,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SwipeCard;