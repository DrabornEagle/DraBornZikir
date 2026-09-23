import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from '../state/session';
import { colors } from '../theme/colors';

function DkdStartupSplash() {
  const [visible, setVisible] = useState(true);
  const [fade] = useState(() => new Animated.Value(1));
  const [logoScale] = useState(() => new Animated.Value(0.82));
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [ringOne] = useState(() => new Animated.Value(0));
  const [ringTwo] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));
  const [loader] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const ringOneLoop = Animated.loop(
      Animated.timing(ringOne, {
        toValue: 1,
        duration: 4200,
        easing: Easing.linear,
        useNativeDriver: true
      })
    );
    const ringTwoLoop = Animated.loop(
      Animated.timing(ringTwo, {
        toValue: 1,
        duration: 5600,
        easing: Easing.linear,
        useNativeDriver: true
      })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 850, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 850, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ])
    );
    const loaderLoop = Animated.loop(
      Animated.timing(loader, { toValue: 1, duration: 1250, easing: Easing.inOut(Easing.cubic), useNativeDriver: true })
    );

    ringOneLoop.start();
    ringTwoLoop.start();
    pulseLoop.start();
    loaderLoop.start();

    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 7, tension: 52, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 620, easing: Easing.out(Easing.cubic), useNativeDriver: true })
      ]),
      Animated.delay(1500),
      Animated.timing(fade, { toValue: 0, duration: 480, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    ]).start(() => setVisible(false));

    return () => {
      ringOneLoop.stop();
      ringTwoLoop.stop();
      pulseLoop.stop();
      loaderLoop.stop();
    };
  }, [fade, loader, logoOpacity, logoScale, pulse, ringOne, ringTwo]);

  if (!visible) return null;

  const ringOneRotate = ringOne.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const ringTwoRotate = ringTwo.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.34, 0.78] });
  const loaderX = loader.interpolate({ inputRange: [0, 1], outputRange: [-150, 150] });

  return (
    <Animated.View pointerEvents="none" style={[styles.splash, { opacity: fade }]}>
      <LinearGradient colors={['#03151E', '#072934', '#0A1E2A']} style={styles.fill} />
      <View style={styles.ambientTop} />
      <View style={styles.ambientBottom} />

      <Animated.View style={[styles.pulseHalo, { opacity: pulseOpacity, transform: [{ scale: pulseScale }] }]} />
      <Animated.View style={[styles.orbit, styles.orbitOne, { transform: [{ rotate: ringOneRotate }] }]}> 
        <View style={[styles.orbitDot, styles.orbitDotOne]} />
        <View style={[styles.orbitDot, styles.orbitDotTwo]} />
      </Animated.View>
      <Animated.View style={[styles.orbit, styles.orbitTwo, { transform: [{ rotate: ringTwoRotate }] }]}> 
        <View style={[styles.orbitDot, styles.orbitDotThree]} />
      </Animated.View>

      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <LinearGradient colors={['#163E46', '#0B2530']} style={styles.logoCore}>
          <Text style={styles.crescent}>☾</Text>
          <View style={styles.beadArc}>
            {Array.from({ length: 9 }).map((_, index) => <View key={index} style={styles.bead} />)}
          </View>
        </LinearGradient>
      </Animated.View>

      <Text style={styles.brand}>DraBornZikir</Text>
      <Text style={styles.slogan}>Kalbine kısa bir huzur molası</Text>

      <View style={styles.loadingTrack}>
        <Animated.View style={[styles.loadingGlow, { transform: [{ translateX: loaderX }] }]} />
      </View>
      <Text style={styles.loadingText}>Zikir deneyimi hazırlanıyor</Text>
      <Text style={styles.version}>DRABORN EAGLE • v0.3</Text>
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
    backgroundColor: '#03151E'
  },
  ambientTop: {
    position: 'absolute', top: -120, width: 340, height: 340, borderRadius: 170,
    backgroundColor: '#4FD8C51A'
  },
  ambientBottom: {
    position: 'absolute', bottom: -180, width: 420, height: 420, borderRadius: 210,
    backgroundColor: '#F5C5830D'
  },
  pulseHalo: {
    position: 'absolute', width: 250, height: 250, borderRadius: 125,
    backgroundColor: '#4FD8C518', borderWidth: 1, borderColor: '#75EAD75A'
  },
  orbit: { position: 'absolute', borderRadius: 999, borderWidth: 1 },
  orbitOne: { width: 274, height: 274, borderColor: '#5CDCC738' },
  orbitTwo: { width: 222, height: 222, borderColor: '#F5C58324' },
  orbitDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
  orbitDotOne: { top: 18, left: 45, backgroundColor: '#5CDCC7' },
  orbitDotTwo: { right: 23, bottom: 54, backgroundColor: '#F5C583' },
  orbitDotThree: { top: -4, left: 106, backgroundColor: '#FFFFFF' },
  logoWrap: { width: 166, height: 166, borderRadius: 83, padding: 2, backgroundColor: '#5CDCC73A' },
  logoCore: { flex: 1, borderRadius: 81, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFFFFF16' },
  crescent: { color: '#F7D59D', fontSize: 92, lineHeight: 104, textShadowColor: '#F5C58355', textShadowRadius: 18 },
  beadArc: { position: 'absolute', bottom: 35, flexDirection: 'row', gap: 4, transform: [{ rotate: '8deg' }] },
  bead: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#62E2CD', borderWidth: 1, borderColor: '#D8FFF8' },
  brand: { marginTop: 42, color: '#FFFFFF', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  slogan: { marginTop: 8, color: '#9BB8C1', fontSize: 13, fontWeight: '600', letterSpacing: 0.2 },
  loadingTrack: { marginTop: 30, width: 180, height: 4, borderRadius: 2, backgroundColor: '#FFFFFF14', overflow: 'hidden' },
  loadingGlow: { width: 72, height: 4, borderRadius: 2, backgroundColor: '#62E2CD', shadowColor: '#62E2CD', shadowOpacity: 0.8, shadowRadius: 8 },
  loadingText: { marginTop: 12, color: '#78A7B1', fontSize: 11, fontWeight: '700', letterSpacing: 0.35 },
  version: { position: 'absolute', bottom: 38, color: '#5CDCC7', fontSize: 10, fontWeight: '900', letterSpacing: 1.7 }
});
