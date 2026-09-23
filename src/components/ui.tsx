import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { ArrowRight, Headphones, Heart, Play, Sparkles, Volume2 } from 'lucide-react-native';
import { type ReactNode, useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type Zikir } from '../data/zikirs';
import { useSession } from '../state/session';
import { colors } from '../theme/colors';

export function Page({ children, bottom = 142 }: { children: ReactNode; bottom?: number }) {
  const insets = useSafeAreaInsets();
  return <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + bottom, paddingHorizontal: 22, gap: 20 }}>{children}</ScrollView>;
}

export function Eyebrow({ children, tint = colors.teal }: { children: ReactNode; tint?: string }) {
  return <Text style={{ color: tint, fontSize: 11, fontWeight: '800', letterSpacing: 2.2, textTransform: 'uppercase' }}>{children}</Text>;
}

export function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
    <Text style={{ color: colors.white, fontWeight: '800', fontSize: 21, letterSpacing: -0.5 }}>{title}</Text>
    {hint ? <Text style={{ color: colors.muted, fontSize: 12 }}>{hint}</Text> : null}
  </View>;
}

export function ProgressRing({ value, max, size = 90, color = colors.teal, children }: { value: number; max: number; size?: number; color?: string; children?: ReactNode }) {
  const stroke = size > 100 ? 10 : 7;
  const radius = (size - stroke - 4) / 2;
  const length = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, value / Math.max(1, max)));
  return <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#305366" strokeWidth={stroke} fill="none" />
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={length} strokeDashoffset={length * (1 - progress)} />
    </Svg>
    {children ?? <Text style={{ fontWeight: '900', color: colors.white, fontSize: 20 }}>{Math.round(progress * 100)}%</Text>}
  </View>;
}

export function BreathingMoon() {
  const [scale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(scale, { toValue: 1.08, duration: 2100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 2100, useNativeDriver: true })
    ]));
    animation.start();
    return () => animation.stop();
  }, [scale]);
  return <Animated.View style={{ width: 145, height: 145, transform: [{ scale }], alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ position: 'absolute', width: 142, height: 142, borderRadius: 80, borderWidth: 1, borderColor: '#B5FFE547' }} />
    <View style={{ position: 'absolute', width: 116, height: 116, borderRadius: 70, borderWidth: 1, borderColor: '#B5FFE573' }} />
    <View style={{ width: 81, height: 81, borderRadius: 50, backgroundColor: '#FFF1CA', shadowColor: '#FBE2A0', shadowOpacity: 0.7, shadowRadius: 30 }} />
    <View style={{ width: 78, height: 78, borderRadius: 50, position: 'absolute', top: 30, left: 62, backgroundColor: '#125958' }} />
    <Text style={{ color: '#FBE8AE', fontSize: 22, position: 'absolute', top: 0, right: 8 }}>✦</Text>
    <Text style={{ color: '#FBE8AE', fontSize: 13, position: 'absolute', bottom: 1, left: 8 }}>✧</Text>
  </Animated.View>;
}

export function ZikirCard({ item, compact = false }: { item: Zikir; compact?: boolean }) {
  const { favorites, toggleFavorite } = useSession();
  const favorite = favorites.includes(item.id);
  return <Link href={{ pathname: '/zikir/[id]', params: { id: item.id } }} asChild>
    <Pressable accessibilityRole="button" accessibilityLabel={item.title + ' detayını aç'} style={{ borderRadius: 25, overflow: 'hidden', borderWidth: 1, borderColor: '#385266', backgroundColor: colors.surface }}>
      <LinearGradient colors={['#1D3D49', '#102737', '#0D2232']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: compact ? 17 : 19, gap: compact ? 11 : 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
          <View style={{ width: 43, height: 43, borderRadius: 15, backgroundColor: item.tint + '25', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: item.tint, fontSize: 25 }}>{item.icon}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: item.tint, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 }}>{item.category.toUpperCase()}</Text>
            <Text style={{ color: colors.white, fontSize: 16, fontWeight: '800' }} numberOfLines={1}>{item.title}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={favorite ? 'Favoriden kaldır' : 'Favoriye ekle'} onPress={(event) => { event.stopPropagation(); toggleFavorite(item.id); }} hitSlop={10} style={{ padding: 7 }}>
            <Heart size={20} color={favorite ? colors.coral : colors.muted} fill={favorite ? colors.coral : 'transparent'} />
          </Pressable>
        </View>
        <Text selectable style={{ color: '#F5EFE2', fontSize: compact ? 21 : 25, lineHeight: compact ? 37 : 42, textAlign: 'right', writingDirection: 'rtl', paddingVertical: 3 }} numberOfLines={compact ? 1 : 2}>{item.arabic}</Text>
        <View style={{ height: 1, backgroundColor: '#4E697252' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Text style={{ color: colors.muted, fontSize: 12, flex: 1 }} numberOfLines={1}>{item.meaning}</Text>
          {item.audioUrl || item.audioAsset ? <Headphones size={16} color={item.tint} /> : <Volume2 size={16} color={item.tint} />}
          <ArrowRight size={17} color={item.tint} />
        </View>
      </LinearGradient>
    </Pressable>
  </Link>;
}

export function AudioBadge({ item }: { item: Zikir }) {
  const { current, playing, buffering, playZikir } = useSession();
  const active = current?.key === 'zikir:' + item.id;
  return <Pressable accessibilityRole="button" accessibilityLabel={(active && (playing || buffering) ? 'Durdur: ' : 'Dinle: ') + item.title} onPress={() => playZikir(item)} style={{ borderRadius: 18, backgroundColor: item.tint, paddingHorizontal: 17, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
    {active && (playing || buffering) ? <Volume2 color={colors.black} size={19} /> : <Play color={colors.black} fill={colors.black} size={19} />}
    <Text style={{ color: colors.black, fontWeight: '900', fontSize: 14 }}>{active && (playing || buffering) ? 'Durdur' : 'Sesli dinle'}</Text>
  </Pressable>;
}

export function SmallStar() {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}><Sparkles color={colors.gold} size={16} /><Text style={{ color: colors.gold, fontWeight: '700', fontSize: 12 }}>DraBornZikir</Text></View>;
}
