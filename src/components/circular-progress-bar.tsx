import { Canvas, Path, Skia, Text, useFont } from '@shopify/react-native-skia';
import { View } from 'react-native';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface CircularProgressBarProps {
  radius: number;
  strock: number;
  perstage: number;
  end: SharedValue<number>;
  onProgressChange?: (progress: number) => void;
}
export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  radius,
  strock,
  end,
  perstage,
  onProgressChange,
}) => {
  console.log(perstage);
  const innerRadius = radius - strock / 2;
  const path = Skia.Path.Make().addCircle(radius, radius, innerRadius);
  const psgText = useDerivedValue(() => `${Math.round(perstage)}%`);
  const font = useFont(require('../fonts/Euclid Circular B Bold.ttf'), 60);
  const calculateAngle = (x: number, y: number) => {
    'worklet';
    const centerX = radius;
    const centerY = radius;
    const dx = x - centerX;
    const dy = y - centerY;
    let angle = Math.atan2(dy, dx);
    angle = angle + Math.PI / 2;

    if (angle < 0) angle += 2 * Math.PI;
    return angle / (2 * Math.PI);
  };

  const panGesture = Gesture.Pan()
    .onBegin(event => {
      const progress = calculateAngle(event.x, event.y);
      end.value = progress;
      if (onProgressChange) {
        onProgressChange(progress);
      }
    })
    .onUpdate(event => {
      const progress = calculateAngle(event.x, event.y);
      end.value = progress;
      if (onProgressChange) {
        onProgressChange(progress);
      }
    });

  const textX = useDerivedValue(() => {
    if (font) {
      const _fontSize = font.measureText(psgText.value);
      return radius - _fontSize.width / 2;
    }
  }, []);
  const fontSize = font?.measureText('%00');

  return (
    <GestureDetector gesture={panGesture}>
      <View style={{ width: radius * 2, height: radius * 2 }}>
        <Canvas style={{ flex: 1 }}>
          <Path
            path={path}
            strokeWidth={strock}
            style={'stroke'}
            strokeJoin={'round'}
            strokeCap={'round'}
            color={'#333438'}
            start={0}
            end={1}
          />
          <Path
            path={path}
            strokeWidth={strock / 2}
            style={'stroke'}
            strokeJoin={'round'}
            strokeCap={'round'}
            color={'#2a55ffff'}
            start={0}
            end={end}
          />
          {font && fontSize && (
            <Text
              y={radius + fontSize?.height / 2}
              text={psgText}
              x={textX.value}
              font={font}
              color={'#fff'}
            />
          )}
        </Canvas>
      </View>
    </GestureDetector>
  );
};
