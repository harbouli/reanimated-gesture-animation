import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { View } from 'react-native';
import Animated, { FadeOut, SlideInDown } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

interface SentenceProps extends TextProps {
  stagger?: number;
  onEnterFinish?: () => void;
  onExistFinish?: () => void;
}
export const Sentence: React.FC<SentenceProps> = ({
  children,
  onEnterFinish,
  onExistFinish,
  stagger = 16,
  ...rest
}) => {
  console.log(children);
  if (typeof children !== 'string') {
    throw new Error('Sentence component  only accepts string!');
  }
  //   const fontSize = rest?.style.
  const words = children.split(' ');
  const fontSize = rest.style?.fontSize ?? 16;
  return (
    <View style={style.wrodsHolder}>
      {words.map((word, index) => (
        <View
          key={`word-${word}-index-${index}`}
          style={{ height: fontSize, overflow: 'hidden' }}
        >
          <Animated.Text
            {...rest}
            entering={SlideInDown.springify()
              .damping(80)
              .stiffness(200)
              .delay(index * stagger)
              .withInitialValues({
                transform: [{ translateY: fontSize * 1.2 }],
              })
              .withCallback(finished => {
                if (finished && index === words.length - 1 && onEnterFinish) {
                  scheduleOnRN(onEnterFinish);
                }
              })}
            exiting={FadeOut.springify()
              .damping(80)
              .stiffness(200)
              .delay(index * stagger)
              .withCallback(finished => {
                if (finished && index === words.length - 1 && onExistFinish) {
                  scheduleOnRN(onExistFinish);
                }
              })}
          >
            {word}
          </Animated.Text>
        </View>
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  wrodsHolder: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    padding: 20,
  },
});
