/**
 * Font constants for Euclid Circular B font family
 * Contains all available font weights and styles
 */

export const FONTS = {
  EuclidCircularB: {
    Regular: 'Euclid Circular B Regular',
    Light: 'Euclid Circular B Light',
    LightItalic: 'Euclid Circular B Light Italic',
    Bold: 'Euclid Circular B Bold',
    BoldItalic: 'Euclid Circular B Bold Italic',
    SemiBold: 'Euclid Circular B SemiBold',
    SemiBoldItalic: 'Euclid Circular B SemiBold Italic',
    MediumItalic: 'Euclid Circular B Medium Italic',
  },
} as const;

/**
 * Type for font family names
 */
export type FontFamily = typeof FONTS.EuclidCircularB[keyof typeof FONTS.EuclidCircularB];
