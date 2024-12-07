import { User } from '@/types/User';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';

// Obtener el ancho y alto de la pantalla
const { width, height } = Dimensions.get('window');

// Definir el tipo para las cartas
export interface Card {
  user: User
}

interface SwipeProps {
  onRightSwipe: (card: Card) => void;
  onLeftSwipe: (card: Card) => void;
  cardsData: Card[];
}

export default function SwipeCard({ onRightSwipe, onLeftSwipe, cardsData }: SwipeProps){

  const [cards, setCards] = useState<Card[]>(cardsData);

  const animatedCards = cards.map(() => ({
    pan: new Animated.ValueXY(),
    rotate: new Animated.Value(0).interpolate({
      inputRange: [-width / 2, 0, width / 2],
      outputRange: ['-20deg', '0deg', '20deg'],
      extrapolate: 'clamp',
    }),
  }));

  const handlePanResponderMove = (event: any, gestureState: any, index: number): void => {
    animatedCards[index].pan.setValue({
      x: gestureState.dx,
      y: gestureState.dy,
    });
  };

  const handlePanResponderRelease = (event: any, gestureState: any, index: number): void => {
    if (gestureState.dx > 120) {
      swipeCard('right', index);
    } else if (gestureState.dx < -120) {
      swipeCard('left', index);
    } else {
      resetCardPosition(index);
    }
  };

  const swipeCard = (direction: 'right' | 'left', index: number): void => {
    Animated.timing(animatedCards[index].pan, {
      toValue: { x: direction === 'right' ? width : -width, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      const card = cards[index];
      removeCard();
      if (direction === 'right') {
        onRightSwipe(card);
      } else if (direction === 'left') {
        onLeftSwipe(card);
      }
    });
  };


  const removeCard = (): void => {
    const newCards = [...cards];
    newCards.shift(); 
    setCards(newCards);
  };

  // Resetear la posición de la carta al centro
  const resetCardPosition = (index: number): void => {
    Animated.spring(animatedCards[index].pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  };

  const panResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event: any, gestureState: any) =>
        handlePanResponderMove(event, gestureState, index),
      onPanResponderRelease: (event: any, gestureState: any) =>
        handlePanResponderRelease(event, gestureState, index),
    });

  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        const isTopCard = index === 0;

        return (
          <Animated.View
            key={card.user._id}
            {...(isTopCard ? panResponder(index).panHandlers : {})}
            style={[
              styles.card,
              {
                transform: [
                  { translateX: animatedCards[index].pan.x },
                  { translateY: animatedCards[index].pan.y },
                  { rotate: animatedCards[index].rotate },
                ],
                zIndex: cards.length - index,
                top: 10 * index, 
                opacity: isTopCard ? 1 : 0.8, 
              },
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>{card.user.firstName}</Text>
            </View>
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
    backgroundColor: '#f2f2f2',
  },
  card: {
    width: width - 40,
    height: height / 2,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
