/**
 * Scene Component
 *
 * This component creates an animated morphing shape using Skia shaders and React Native Reanimated.
 * The shape transitions between a circle and a rounded rectangle with smooth interpolation.
 *
 * Key features:
 * - Uses GLSL shaders for custom shape rendering
 * - Implements signed distance functions (SDFs) for shape blending
 * - Applies backdrop filters for visual effects
 * - Responds to tap gestures to trigger animations
 */

import type {
  SkImageFilter,
  SkRuntimeEffect,
  SkShader,
} from '@shopify/react-native-skia';
import {
  BackdropFilter,
  Canvas,
  convertToColumnMajor3,
  ImageFilter,
  processTransform2d,
  processUniforms,
  Skia,
  TileMode,
  useCanvasSize,
} from '@shopify/react-native-skia';
import React from 'react';
import {
  ReduceMotion,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { frag, glsl } from '../libs/tags';

import { ButtonGroup, useButtonGroup } from './button-group';
import { Pattern } from './pattern';

/**
 * Base uniforms shared across shaders
 * - progress: Animation progress (0 to 1) for morphing between shapes
 * - c1: Center position of the circle
 * - box: Rounded rectangle bounds (x, y, width, height)
 * - r: Radius value for both circle and rounded corners
 */
export const baseUniforms = glsl`
uniform float progress;
uniform vec2 c1;
uniform vec4 box;
uniform float r;
`;

/**
 * Main fragment shader for rendering the morphing shape
 * Combines a circle and rounded rectangle using smooth minimum blending
 */
const source = frag`
${baseUniforms}

/**
 * Signed Distance Function for a circle
 * @param p - Current pixel position
 * @param center - Center of the circle
 * @param radius - Radius of the circle
 * @returns vec2(distance, angle) - distance to circle edge and normalized angle (0-1)
 */
vec2 sdCircle(vec2 p, vec2 center, float radius) {
  vec2 offset = p - center;
  float d = length(offset) - radius;
  float t = atan(offset.y, offset.x) / (2.0 * 3.14159265) + 0.5;
  return vec2(d, t);
}

/**
 * Signed Distance Function for a rounded rectangle
 * @param p - Current pixel position
 * @param b - Half-extents of the rectangle
 * @param r - Corner radii (vec4 for different corners)
 * @returns vec2(distance, angle) - distance to shape edge and normalized angle (0-1)
 */
vec2 sdRoundedBox( in vec2 p, in vec2 b, in vec4 r ) {
  r.xy = (p.x>0.0) ? r.xy : r.zw;
  r.x  = (p.y>0.0) ? r.x  : r.y;
  vec2 q = abs(p)-b+r.x;
  float d = min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;

  // Approximate arc length using ellipse parameterization
  vec2 ellipseB = b + vec2(r.x); // Ellipse semi-axes matching rounded rect
  vec2 normalizedP = p / ellipseB;
  float t = atan(normalizedP.y, normalizedP.x) / (2.0 * 3.14159265) + 0.5;

  return vec2(d, t);
}

/**
 * Smooth minimum function - blends two distances smoothly
 * @param a - First distance value
 * @param b - Second distance value
 * @param k - Smoothing factor (higher = more blending)
 * @returns Smoothly blended distance
 */
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
  return mix(a, b, h) - k*h*(1.0-h);
}

/**
 * Main shader function - calculates color for each pixel
 * @param p - Current pixel position
 * @returns Final color (RGBA)
 */
half4 main(float2 p) {
  // Animate circle radius - shrinks as progress approaches 1.0
  float circleRadius = r * (1.0 - smoothstep(0.8, 1.0, progress));

  // Calculate signed distances for both shapes
  vec2 sdf1 = sdCircle(p + vec2(0, -r), c1, circleRadius);
  vec2 sdf2 = sdRoundedBox(p - box.xy - box.zw * 0.5, box.zw * 0.5, vec4(r));

  // Dynamic smoothing factor - increases in the middle of animation for more blending
  float k = 20 + 20 * (1.0 - abs(2.0 * progress - 1.0));

  // Blend the two shapes smoothly
  float d = smin(sdf1.x, sdf2.x, k);

  // Calculate the blend factor to interpolate angles between shapes
  float h = clamp(0.5 + 0.5*(sdf1.x - sdf2.x)/k, 0.0, 1.0);
  float t = mix(sdf1.y, sdf2.y, h);

  // Outside the shape - transparent
  if (d > 0.0) {
     return vec4(0.0);
  }

  // Create gradient from yellow center to alternating red/green edge
  float patternFreq = 1.0; // Frequency of the alternating pattern
  float centerFactor = clamp(-d / r, 0.0, 1.0); // 0 at edge, 1 at center
  float edgePattern = sin(t * 2.0 * 3.14159265 * patternFreq) * 0.5 + 0.5; // Alternating pattern

  vec3 yellow = vec3(0.5, 0.5, 0.0);
  vec3 red = vec3(0.5, 0.0, 0.0);
  vec3 green = vec3(0.0, 0.5, 0.0);
  vec3 edgeColor = mix(red, green, edgePattern);

  // Blend from edge colors to yellow center
  vec3 color = mix(edgeColor, yellow, centerFactor);
  return vec4(color, 1.0);
}
`;

// Radius constant for shapes
const r = 55;

/**
 * Props for Scene component
 * @property filter - Optional callback to create a custom image filter from the shader
 * @property shader - Optional runtime shader effect for advanced filtering
 */
interface SceneProps {
  filter?: (shader: SkShader) => SkImageFilter;
  shader?: SkRuntimeEffect;
}

/**
 * Scene Component
 *
 * Renders an interactive animated scene with morphing shapes.
 * Tapping the screen triggers a spring animation that morphs between a circle and rounded rectangle.
 *
 * @param filter - Optional filter callback for custom image effects
 * @param shader - Optional runtime shader for advanced visual effects
 */
export const Scene = ({
  filter: filterCB,
  shader: shaderFilter,
}: SceneProps) => {
  // Get canvas size and reference
  const { ref, size } = useCanvasSize();
  const { width, height } = size;

  // Get animated values for shape positions and progress
  const props = useButtonGroup({ width, height }, r);
  const { progress, c1, box, bounds } = props;

  // Create uniforms object for shader - updates when animated values change
  const uniforms = useDerivedValue(() => {
    return {
      progress: progress.value,
      c1: c1.value,
      box: box,
      boxRadius: r,
      r,
    };
  });

  /**
   * Create the image filter based on provided props
   * - If filterCB provided: creates shader and applies custom filter
   * - If shaderFilter provided: creates runtime shader with blur effect
   * - Otherwise: throws error
   */
  const filter = useDerivedValue(() => {
    // Transform matrix for positioning the shader output
    const localMatrix = processTransform2d([
      { translateX: bounds.x },
      { translateY: bounds.y },
    ]);

    if (filterCB) {
      // Create shader from source and apply custom filter callback
      const shader = source.makeShader(
        processUniforms(source, uniforms.value),
        localMatrix,
      );
      return filterCB(shader);
    } else if (shaderFilter) {
      // Build runtime shader with uniforms and blur effect
      const builder = Skia.RuntimeShaderBuilder(shaderFilter);
      const transform = convertToColumnMajor3(localMatrix.get());
      processUniforms(
        shaderFilter,
        {
          ...uniforms.value,
          transform,
          resolution: [width, height],
        },
        builder,
      );
      // Create image filter with blur as a child effect
      return Skia.ImageFilter.MakeRuntimeShaderWithChildren(
        builder,
        0,
        ['blurredImage'],
        [Skia.ImageFilter.MakeBlur(8, 8, TileMode.Clamp)],
      );
    } else {
      throw new Error('No filter or shader provided');
    }
  });

  /**
   * Tap gesture handler - toggles animation between two states
   * Uses spring physics for smooth, natural motion
   */
  const gesture = Gesture.Tap().onEnd(() => {
    progress.value = withSpring(progress.value === 0 ? 1 : 0, {
      duration: 1000,
      overshootClamping: false,
      reduceMotion: ReduceMotion.System,
    });
  });

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ flex: 1 }} ref={ref}>
          {/* Background pattern */}
          <Pattern />
          {/* Apply the backdrop filter effect over the pattern */}
          <BackdropFilter filter={<ImageFilter filter={filter} />} />
          {/* ButtonGroup can be uncommented to show shape boundaries */}
          <ButtonGroup {...props} />
        </Canvas>
      </GestureDetector>
    </View>
  );
};
