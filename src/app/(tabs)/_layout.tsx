import { Tabs, router } from 'expo-router';
import { BookOpenText, ChartNoAxesCombined, House, Pause, Play, Radio, X } from 'lucide-react-native';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../../state/session';
import { colors } from '../../theme/colors';

const sections = [
  { name: 'index', href: '/', webHref: '/DraBornZikir/', title: 'Bugün', icon: House },
  { name: 'library', href: '/library', webHref: '/DraBornZikir/library/', title: 'Keşfet', icon: BookOpenText },
  { name: 'radio', href: '/radio', webHref: '/DraBornZikir/radio/', title: 'Radyo', icon: Radio },
  { name: 'progress', href: '/progress', webHref: '/DraBornZikir/progress/', title: 'Ritüelim', icon: ChartNoAxesCombined }
] as const;

type DkdTabHref = '/' | '/library' | '/radio' | '/progress';

function dkdNavigate(href: DkdTabHref, webHref: string) {
  if (Platform.OS === 'web') {
    const browserLocation = (globalThis as typeof globalThis & { location?: { assign: (url: string) => void } }).location;
    if (browserLocation) {
      browserLocation.assign(webHref);
      return;
    }
  }
  router.navigate(href);
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { current, playing, buffering, stopAudio } = useSession();
  return <Tabs screenOptions={{ headerShown: false }} tabBar={({ state }) =>
    <View style={{ backgroundColor: colors.bg, borderTopColor: '#2E4B5D', borderTopWidth: 1, paddingBottom: Math.max(12, insets.bottom), paddingHorizontal: 12 }}>
      {current ? <View style={{ marginTop: 8, marginHorizontal: 8, borderRadius: 16, paddingHorizontal: 13, paddingVertical: 11, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center', gap: 11 }}>
        {current.kind === 'radio' ? <Radio size={19} color={colors.teal} /> : (playing || buffering ? <Pause size={19} color={colors.teal} /> : <Play size={19} color={colors.teal} />)}
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 13 }} numberOfLines={1}>{current.title}</Text>
          <Text style={{ color: colors.muted, fontSize: 11 }} numberOfLines={1}>{current.subtitle}{buffering ? ' · Yükleniyor' : ''}</Text>
        </View>
        <Pressable onPress={stopAudio} hitSlop={12} accessibilityLabel="Sesi durdur"><X size={20} color={colors.muted} /></Pressable>
      </View> : null}
      <View style={{ flexDirection: 'row', paddingTop: 9 }}>
        {sections.map((section) => {
          const selected = state.routes[state.index].name === section.name;
          const Icon = section.icon;
          return <Pressable key={section.name} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => dkdNavigate(section.href, section.webHref)} style={{ flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6 }}>
            <View style={{ backgroundColor: selected ? '#25544F' : 'transparent', borderRadius: 14, paddingHorizontal: 20, paddingVertical: 5 }}>
              <Icon size={20} color={selected ? colors.teal : colors.muted} strokeWidth={selected ? 2.6 : 1.8} />
            </View>
            <Text style={{ color: selected ? colors.white : colors.muted, fontSize: 10, fontWeight: selected ? '800' : '600' }}>{section.title}</Text>
          </Pressable>;
        })}
      </View>
    </View>
  }>
    <Tabs.Screen name="index" options={{ title: 'Bugün' }} />
    <Tabs.Screen name="library" options={{ title: 'Keşfet' }} />
    <Tabs.Screen name="radio" options={{ title: 'Radyo' }} />
    <Tabs.Screen name="progress" options={{ title: 'Ritüelim' }} />
  </Tabs>;
}
