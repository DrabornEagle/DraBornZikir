import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from '../state/session';
import { colors } from '../theme/colors';

function DkdStartupSplash() {
  if (Platform.OS === 'web') return null;
  return <DkdStartupSplashNative />;
}

function DkdStartupSplashNative() {
  const [visible, setVisible] = useState(true);
  const [fade] = useState(() => new Animated.Value(1));
  const [cardScale] = useState(() => new Animated.Value(0.86));
  const [cardOpacity] = useState(() => new Animated.Value(0));
  const [ringOne] = useState(() => new Animated.Value(0));
  const [ringTwo] = useState(() => new Animated.Value(0));
  const [ringThree] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));
  const [loader] = useState(() => new Animated.Value(0));
  const [aura] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const ringOneLoop = Animated.loop(Animated.timing(ringOne, {
      toValue: 1,
      duration: 4200,
      easing: Easing.linear,
      useNativeDriver: true
    }));
    const ringTwoLoop = Animated.loop(Animated.timing(ringTwo, {
      toValue: 1,
      duration: 5800,
      easing: Easing.linear,
      useNativeDriver: true
    }));
    const ringThreeLoop = Animated.loop(Animated.timing(ringThree, {
      toValue: 1,
      duration: 8400,
      easing: Easing.linear,
      useNativeDriver: true
    }));
    const pulseLoop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    ]));
    const loaderLoop = Animated.loop(Animated.timing(loader, {
      toValue: 1,
      duration: 1150,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true
    }));
    const auraLoop = Animated.loop(Animated.sequence([
      Animated.timing(aura, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(aura, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    ]));

    ringOneLoop.start();
    ringTwoLoop.start();
    ringThreeLoop.start();
    pulseLoop.start();
    loaderLoop.start();
    auraLoop.start();

    Animated.sequence([
      Animated.parallel([
        Animated.spring(cardScale, { toValue: 1, friction: 7, tension: 52, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true })
      ]),
      Animated.delay(1550),
      Animated.timing(fade, { toValue: 0, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    ]).start(() => setVisible(false));

    return () => {
      ringOneLoop.stop();
      ringTwoLoop.stop();
      ringThreeLoop.stop();
      pulseLoop.stop();
      loaderLoop.stop();
      auraLoop.stop();
    };
  }, [aura, cardOpacity, cardScale, fade, loader, pulse, ringOne, ringThree, ringTwo]);

  if (!visible) return null;

  const ringOneRotate = ringOne.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const ringTwoRotate = ringTwo.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const ringThreeRotate = ringThree.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.045] });
  const auraScale = aura.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const auraOpacity = aura.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.82] });
  const loaderX = loader.interpolate({ inputRange: [0, 1], outputRange: [-210, 245] });

  return (
    <Animated.View pointerEvents="none" style={[styles.splash, { opacity: fade }]}>
      <LinearGradient colors={['#06131F', '#0A1830', '#071827']} start={{ x: 0.05, y: 0 }} end={{ x: 0.95, y: 1 }} style={styles.fill} />

      <Animated.View style={[styles.auraField, { opacity: auraOpacity, transform: [{ scale: auraScale }, { rotate: '10deg' }] }]}>
        <View style={styles.auraPurple} />
        <View style={styles.auraTeal} />
        <View style={styles.auraPink} />
      </Animated.View>

      <Animated.View style={[styles.splashContent, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
        <View style={styles.orbitWrap}>
          <Animated.View style={[styles.orbit, styles.orbitOne, { transform: [{ rotate: ringOneRotate }] }]}>
            <View style={[styles.orbitDot, styles.dotTeal]} />
          </Animated.View>
          <Animated.View style={[styles.orbit, styles.orbitTwo, { transform: [{ rotate: ringTwoRotate }] }]}>
            <View style={[styles.orbitDot, styles.dotGold]} />
          </Animated.View>
          <Animated.View style={[styles.orbit, styles.orbitThree, { transform: [{ rotate: ringThreeRotate }] }]}>
            <View style={[styles.orbitDot, styles.dotPurple]} />
          </Animated.View>

          <Animated.View style={[styles.logoHalo, { transform: [{ scale: pulseScale }] }]}>
            <LinearGradient colors={['#204D5B', '#111F38']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoCore}>
              <Text style={styles.crescent}>☾</Text>
              <View style={styles.beadArc}>
                {Array.from({ length: 11 }).map((_, index) => <View key={index} style={styles.bead} />)}
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        <Text style={styles.kicker}>DRABORN EAGLE</Text>
        <Text style={styles.brand}>DraBornZikir</Text>
        <Text style={styles.slogan}>Zikir ile huzura, renklerle dinginliğe...</Text>

        <View style={styles.loadingTrack}>
          <Animated.View style={[styles.loadingGlowWrap, { transform: [{ translateX: loaderX }] }]}>
            <LinearGradient colors={['#00000000', '#5CDCC7', '#81CEFF', '#B59DFF', '#F5C583', '#00000000']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.loadingGlow} />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>DENEYİM HAZIRLANIYOR</Text>
      </Animated.View>

      <Text style={styles.version}>SÜRÜM <Text style={styles.versionAccent}>v0.3</Text> • ANDROID</Text>
    </Animated.View>
  );
}

export default function RootLayout() {
  return <SafeAreaProvider>
    <SessionProvider>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="light" />
        <Stack screenOptions={{
          contentStyle: { backgroundColor: colors.bg },
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '800' },
          headerShadowVisible: false
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="zikir/[id]" options={{ title: 'Zikir detayı' }} />
        </Stack>
        <DkdStartupSplash />
      </View>
    </SessionProvider>
  </SafeAreaProvider>;
}

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  splash: {
    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#071827'
  },
  auraField: { position: 'absolute', width: 620, height: 760 },
  auraPurple: { position: 'absolute', left: 35, top: 55, width: 310, height: 310, borderRadius: 155, backgroundColor: '#7556FF35' },
  auraTeal: { position: 'absolute', right: 18, top: 150, width: 290, height: 290, borderRadius: 145, backgroundColor: '#00E0C42B' },
  auraPink: { position: 'absolute', left: 150, bottom: 55, width: 330, height: 330, borderRadius: 165, backgroundColor: '#FF75A32A' },
  splashContent: { width: '100%', alignItems: 'center', paddingHorizontal: 28 },
  orbitWrap: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center' },
  orbit: { position: 'absolute', borderRadius: 999, borderWidth: 1 },
  orbitOne: { width: 228, height: 228, borderTopColor: '#5CDCC7', borderRightColor: '#B59DFF88', borderBottomColor: '#FFFFFF0B', borderLeftColor: '#FFFFFF0B' },
  orbitTwo: { width: 186, height: 186, borderLeftColor: '#F5C583', borderBottomColor: '#F7A9B888', borderTopColor: '#FFFFFF0B', borderRightColor: '#FFFFFF0B' },
  orbitThree: { width: 144, height: 144, borderTopColor: '#81CEFFAA', borderBottomColor: '#B59DFF77', borderLeftColor: '#FFFFFF09', borderRightColor: '#FFFFFF09' },
  orbitDot: { position: 'absolute', width: 9, height: 9, borderRadius: 5, borderWidth: 1, borderColor: '#FFFFFF99' },
  dotTeal: { top: -5, left: 109, backgroundColor: '#5CDCC7' },
  dotGold: { right: 22, bottom: 29, backgroundColor: '#F5C583' },
  dotPurple: { left: 11, top: 35, backgroundColor: '#B59DFF' },
  logoHalo: { width: 142, height: 142, borderRadius: 45, padding: 1, backgroundColor: '#FFFFFF22', shadowColor: '#5CDCC7', shadowOpacity: 0.2, shadowRadius: 24, elevation: 16 },
  logoCore: { flex: 1, borderRadius: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFFFFF28' },
  crescent: { color: '#F8DCA7', fontSize: 88, lineHeight: 98, textShadowColor: '#F5C58388', textShadowRadius: 20, transform: [{ translateY: -4 }] },
  beadArc: { position: 'absolute', bottom: 23, flexDirection: 'row', gap: 3, transform: [{ rotate: '8deg' }] },
  bead: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#82F5DE', borderWidth: 1, borderColor: '#49B5FF' },
  kicker: { marginTop: 18, color: '#81CEFF', fontSize: 10, fontWeight: '900', letterSpacing: 3.4 },
  brand: { marginTop: 8, color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1.5, textShadowColor: '#00000066', textShadowRadius: 20 },
  slogan: { marginTop: 10, color: '#A9C3CF', fontSize: 14, lineHeight: 20, fontWeight: '600', textAlign: 'center' },
  loadingTrack: { marginTop: 30, width: 190, height: 5, borderRadius: 999, backgroundColor: '#FFFFFF17', overflow: 'hidden', borderWidth: 1, borderColor: '#FFFFFF0B' },
  loadingGlowWrap: { width: 110, height: 5 },
  loadingGlow: { flex: 1, borderRadius: 999 },
  loadingText: { marginTop: 12, color: '#7599A7', fontSize: 10, fontWeight: '800', letterSpacing: 1.15 },
  version: { position: 'absolute', bottom: 34, color: '#6F8998', fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  versionAccent: { color: '#8FE8D7' }
});
