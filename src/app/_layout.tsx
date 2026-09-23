import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from '../state/session';
import { colors } from '../theme/colors';

function DkdStartupSplash() {
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.72)).current;
  const glow = useRef(new Animated.Value(0.15)).current;
  const bead = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 7, tension: 58, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 1, duration: 850, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(bead, { toValue: 1, duration: 1050, easing: Easing.out(Easing.cubic), useNativeDriver: true })
    ]);
    const exit = Animated.timing(opacity, { toValue: 0, duration: 420, delay: 850, easing: Easing.inOut(Easing.quad), useNativeDriver: true });
    Animated.sequence([entrance, exit]).start(() => setVisible(false));
  }, [bead, glow, opacity, scale]);

  if (!visible) return null;
  const rotate = bead.interpolate({ inputRange: [0, 1], outputRange: ['-25deg', '12deg'] });
  return <Animated.View pointerEvents="none" style={[styles.splash, { opacity }]}>
    <Animated.View style={[styles.halo, { opacity: glow, transform: [{ scale }] }]} />
    <Animated.View style={[styles.logo, { transform: [{ scale }] }]}>
      <Text style={styles.crescent}>☾</Text>
      <Animated.Text style={[styles.tasbih, { transform: [{ rotate }] }]}>● ● ● ● ● ● ● ● ●</Animated.Text>
    </Animated.View>
    <Text style={styles.brand}>DraBornZikir</Text>
    <Text style={styles.slogan}>Zikir ile huzura...</Text>
    <Text style={styles.version}>v0.2</Text>
  </Animated.View>;
}

export default function RootLayout() {
  return <SafeAreaProvider>
    <SessionProvider>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="light" backgroundColor="transparent" />
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
  splash: {
    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#071827'
  },
  halo: {
    position: 'absolute',
    width: 238,
    height: 238,
    borderRadius: 119,
    borderWidth: 1,
    borderColor: '#5CDCC766',
    backgroundColor: '#0A31405C',
    shadowColor: '#5CDCC7',
    shadowOpacity: 0.36,
    shadowRadius: 40
  },
  logo: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center' },
  crescent: { color: '#F5D69E', fontSize: 112, lineHeight: 126, textShadowColor: '#F5D69E66', textShadowRadius: 18 },
  tasbih: { position: 'absolute', bottom: 26, color: '#56DDC4', fontSize: 13, letterSpacing: -1.5 },
  brand: { marginTop: 14, color: '#FFFFFF', fontSize: 31, fontWeight: '900', letterSpacing: -0.9 },
  slogan: { marginTop: 8, color: '#9FB8C2', fontSize: 14, fontWeight: '600' },
  version: { position: 'absolute', bottom: 36, color: '#5CDCC7', fontSize: 11, fontWeight: '900', letterSpacing: 1.6 }
});
