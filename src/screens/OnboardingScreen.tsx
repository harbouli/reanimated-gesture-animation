import React, { useState } from 'react';
import {
  Button,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Marquee } from '../components/marquee';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../fonts';
import Animated, { FadeIn } from 'react-native-reanimated';
const { width, height } = Dimensions.get('screen');
const __GAP = 20;
const columns = [
  [
    'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwfNa6NPKv3F8HF5u9Qa96RlW4vzevr_Dkj8dpJgjMzRyWGC4YPdXZe5sD_kbBBqA8taO_XtBcEcXipr2mmu1igQy11tYAwMJX4n_iiiR61ozypXkrQQGWKW58qel-HADtXqXI=s1360-w1360-h1020-rw',
    'https://provinceazilal.ma/wp-content/uploads/2020/09/binlwidane-1.jpg',
    'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwwgM4qPCHQUEhp98hSe5XwbzDoO2fw9DZ9Vcpe15-O-H6JHA_qzT2MrK0pbv1PqUf3MEjUCzWg76VIhf60ZQEm3uaYEKB3R3n2E6HjnX6GTi9Mg6_FqavOy9pw6CiiYgDxvzQg7g=s1360-w1360-h1020-rw',
    'https://moroccomagics.com/wp-content/uploads/2024/10/Bin-El-Ouidane-Dam.jpg',
    'https://images.ctfassets.net/4c8obikr7ztw/4m1D2lBwyn8QZa94zfabO/a3f917c3c2c95af34190a20e48de59c7/cathedrale_Imsfrane_location_voiture_maroc.jpg',
    'https://static.yabiladi.com/files/articles/6e5a7df7d553b25254c530d8363d45aa20171119113651.jpg',
    'https://www.discoverimages.com/p/251/view-garden-ain-asserdoun-kasbah-ras-el-ain-19489379.jpg.webp',
    'https://media.routard.com/image/12/3/pt55500.1265123.w1000.jpg',
  ],
  [
    'https://s2.wklcdn.com/image_91/2730877/23447577/14911409.400x300.jpg',
    'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzXFwIkKb5Tckd7BiHBQzCUnHKVR9wPL5Fxyl68qGQw4ha3UrHd_7GmeDMa2k5IfXoTRIs14cYeignDFsKXisuskNDMwplvozmaAlPEVYLWWtuQ8FhqZG1DNgSD93__vI8vjKkg=s1360-w1360-h1020-rw',
    'https://marocvoyagedereve.com/wp-content/uploads/2025/04/Cathedrale-Imsfrane.jpg',
    'https://photos.altai-travel.com/1920x1040/ait-bouguemez-adobe-stock-42441.jpg',
    'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwANSmhb27-Pz_HBbNw7FSUYso9_J62tsXeUtSZGPzkTshymx5V_9G9iz1QGs0m_JBD8IlcMj5usUw-5OK1YR8Q9tgrRiUcNh7IP5BWXaVPdkYdELeS5duSt8Kj86Syv4u54ixh=s1360-w1360-h1020-rw',
    'https://upload.wikimedia.org/wikipedia/commons/a/ac/Barrage_Bin_el_Ouidane_1.JPG',
    'https://moroccospecialtours.com/wp-content/uploads/2024/07/Tangier-to-Fes-and-Chefchaouen-4-Day-Tour-Tour-Morocco-Special-Tours-5.webp',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/e0/ef/75/caption.jpg?w=1100&h=1100&s=1',
    'https://www.ecotourisme-trek-maroc.com/wp-content/uploads/2017/07/La-vall%C3%A9e-heureuse-Ait-Bouguemez.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbYhde80D8-mhvpzpTF8f-A4h-8_BD34kLFw&s',
  ],
  [
    'https://provinceazilal.ma/wp-content/uploads/2020/09/2004_01_bin_el_ouidane_2.jpg',
    'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSznc-mzi8VjHE-0cUaARNjKaJXSQF9tE_CHGYOXv5fTiZEGOD8yEkUAedCrfiHNZeQXtTkIYo6-vb420__D6Oh-XbrsdaxsiZkqteKX8IlpJeDYc44tuocZFgFIqE-BwAW-YrG2=s1360-w1360-h1020-rw',
    'https://upload.wikimedia.org/wikipedia/commons/a/a4/Province_Fkih_Ben_Salah%2C_Morocco_-_panoramio.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/0c/c5/8a/fc/la-grande-piscine.jpg',
    'https://imgservice.meilleureslocations.fr/500x245/g%C3%AEte-rural-%C3%A0-jnane-ima-ma-jnane-imes-bc-13747722-0.jpg',
    'https://static1.mclcm.net/iod/images/v2/69/citytheque/localite_104_114/1200x630_80_300_000000x10x0.jpg',
    'https://provinceazilal.ma/wp-content/uploads/2020/09/binlwidane-1.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/97/Jbel_Tassemit_%E2%B5%9C%E2%B4%B0%E2%B5%99%E2%B5%8E%E2%B5%89%E2%B5%9C_.jpg',
    'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwwgM4qPCHQUEhp98hSe5XwbzDoO2fw9DZ9Vcpe15-O-H6JHA_qzT2MrK0pbv1PqUf3MEjUCzWg76VIhf60ZQEm3uaYEKB3R3n2E6HjnX6GTi9Mg6_FqavOy9pw6CiiYgDxvzQg7g=s1360-w1360-h1020-rw',
    'https://images.ctfassets.net/4c8obikr7ztw/4m1D2lBwyn8QZa94zfabO/a3f917c3c2c95af34190a20e48de59c7/cathedrale_Imsfrane_location_voiture_maroc.jpg',
    'https://static.yabiladi.com/files/articles/6e5a7df7d553b25254c530d8363d45aa20171119113651.jpg',
  ],
];
export const OnboardingScreen = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1a1a1a' : '#bb5a51' },
      ]}
    >
      {/* Top gradient */}
      <LinearGradient
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 33,
          width,
          height: height * 0.15,
          pointerEvents: 'none',
        }}
        colors={[isDarkMode ? '#1a1a1a' : '#bb5a51', 'rgba(187, 90, 81, 0)']}
      />

      <View style={styles.rowsHolder}>
        <LinearGradient
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 33,
            width,
            height: height * 0.15,
            pointerEvents: 'none',
          }}
          colors={['rgba(187, 90, 81, 0)', isDarkMode ? '#1a1a1a' : '#bb5a51']}
        />
        <View style={{ gap: __GAP / 2, transform: [{ rotate: '15deg' }] }}>
          {columns.map((column, index) => (
            <Marquee
              withGesture={false}
              key={`key-${index}-column-${column.length}`}
              spacing={__GAP}
              reverse={index % 2 == 0}
            >
              <View style={styles.rowContainer}>
                {column.map((image, key) => (
                  <Image
                    key={`key-${key}-index-${index}-image-${image.slice(
                      0,
                      10,
                    )}}`}
                    source={{ uri: image }}
                    style={styles.image}
                  />
                ))}
              </View>
            </Marquee>
          ))}
        </View>
      </View>
      <View
        style={{
          marginTop: __GAP * 3,
          gap: __GAP,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 'auto',
          width: width * 0.8,
        }}
      >
        <Animated.Text entering={FadeIn.duration(900)} style={styles.text}>
          Explorez les{' '}
          <Text
            style={{
              ...styles.text,
              fontFamily: FONTS.EuclidCircularB.Bold,
              fontWeight: '900',
            }}
          >
            meilleurs
          </Text>{' '}
          sites de{' '}
          <Text
            style={{
              ...styles.text,
              fontFamily: FONTS.EuclidCircularB.Bold,
              fontWeight: '900',
            }}
          >
            tresors hachés
          </Text>
        </Animated.Text>

        <Pressable
          style={{
            paddingHorizontal: __GAP * 3,
            backgroundColor: '#dedede',
            paddingVertical: __GAP,
            borderRadius: 99,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontFamily: FONTS.EuclidCircularB.SemiBold,
              fontWeight: '600',
            }}
          >
            Discover more
          </Text>
        </Pressable>
      </View>
      {/* <Button title="Test" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bb5a51',
  },
  image: {
    width: width * 0.55 - __GAP,
    aspectRatio: 1,
    borderRadius: __GAP * 0.4,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: __GAP,
  },
  rowsHolder: {
    overflow: 'hidden',
    gap: __GAP / 2,
    backgroundColor: '#bb5a51',
    // transform: [{ rotate: '15deg' }],
  },
  text: {
    fontFamily: FONTS.EuclidCircularB.Regular,
    color: '#FFF',
    fontSize: 28,
    textAlign: 'center',
  },
});
