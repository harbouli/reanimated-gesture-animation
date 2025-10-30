import React, { useState } from 'react';
import { Sentence } from '../components/sentence';
import { StyleSheet, View } from 'react-native';
const mySentences = [
  'All clouds have souls.',
  'I was at some place other than my body.',
  'I felt awful and nobody believed me.',
  'We just sat there and said nothing.',
];
export const TextAnimation = () => {
  const [index, setIndex] = useState<number>(0);
  const [sentence, setSentence] = useState<string>(mySentences[index]);
  return (
    <View style={style.container}>
      <Sentence
        style={style.sentence}
        onEnterFinish={() => {
          const newIndex = (index + 1) % mySentences.length;
          setIndex(newIndex);
        }}
        onExistFinish={() => {
          setSentence(mySentences[index]);
        }}
        stagger={100}
      >
        {mySentences[index]}
      </Sentence>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#FFF',
    flex: 1,
  },
  sentence: {
    fontSize: 42,
    letterSpacing: -2,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
});
