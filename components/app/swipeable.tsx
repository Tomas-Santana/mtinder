import React, { useRef } from 'react';
import { View, PanResponder, Animated } from 'react-native';
import mt from '@/style/mtWind';

interface SwipeableProps {
  children: React.ReactNode;
  onSwipeAction: () => void; // Acción a ejecutar al completar el swipe
}

export const Swipeable = ({ children, onSwipeAction }: SwipeableProps) => {
  const translateX = useRef(new Animated.Value(0)).current; // Control del movimiento horizontal

  // Configuración de PanResponder para el swipe
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true, // Permite que el movimiento sea detectado

    onPanResponderMove: (e, gestureState) => {
      const newTranslateX = Math.max(0, gestureState.dx); // Restringe el movimiento a la derecha
      translateX.setValue(newTranslateX); // Actualiza el valor de translateX
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx > 100) {
        // Ejecuta la acción si se supera el umbral
        onSwipeAction();
        Animated.timing(translateX, {
          toValue: 500, // Mueve el ítem fuera de la pantalla
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        // Si no se supera el umbral, regresa a la posición original
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  // Estilo animado para la posición
  const animatedStyle = {
    transform: [{ translateX }],
  };

  return (
    <Animated.View
      style={[ animatedStyle]}
      {...panResponder.panHandlers} // Asigna el panResponder al contenedor
    >
      {children}
    </Animated.View>
  );
};

