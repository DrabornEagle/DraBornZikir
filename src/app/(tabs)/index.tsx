import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { ArrowRight, Headphones, Radio, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BreathingMoon, Eyebrow, Page, ProgressRing, SectionHeading, SmallStar, ZikirCard } from '../../components/ui';
import { dailySelection, streak } from '../../utils/daily';
import { useSession } from '../../state/session';
import { colors } from '../../theme/colors';

export default function TodayScreen() {
  const { counts, total, dailyGoal } = useSession();
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const selection = dailySelection(today);
  const [featured, ...remaining] = selection;
  const completedDays = streak(counts, dailyGoal, today);

  return <Page>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <SmallStar />
      <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600' }}>{new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(today)}</Text>
    </View>

    <View style={{ gap: 5 }}>
      <Text style={{ color: colors.white, fontWeight: '900', fontSize: 31, letterSpacing: -1.2 }}>Huzura bir an ayır.</Text>
      <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 22 }}>Her gün yeni bir zikir, her tekrar bir durak.</Text>
    </View>

    <LinearGradient colors={['#147A78', '#135C63', '#18344E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 29, padding: 22, borderWidth: 1, borderColor: '#70E4C45C', overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 132 }}>
        <View style={{ flex: 1, gap: 8, zIndex: 1 }}>
          <Eyebrow tint="#B9F4E0">✦  GÜNÜN ZİKRİ</Eyebrow>
          <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '900', lineHeight: 32, letterSpacing: -0.8 }}>{featured.title}</Text>
          <Text style={{ color: '#C7E9E2', fontSize: 12, lineHeight: 19 }}>{featured.meaning}</Text>
        </View>
        <BreathingMoon />
      </View>
      <Link href={{ pathname: '/zikir/[id]', params: { id: featured.id } }} asChild>
        <Pressable accessibilityRole="button" style={{ backgroundColor: '#E5F9DF', borderRadius: 16, paddingVertical: 15, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 15 }}>
          <Headphones color="#0A4A46" size={19} /><Text style={{ color: '#0A4A46', fontSize: 14, fontWeight: '900' }}>Oku, dinle ve zikret</Text><ArrowRight color="#0A4A46" size={18} />
        </Pressable>
      </Link>
    </LinearGradient>

    <View style={{ borderRadius: 24, padding: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#345360', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <ProgressRing value={total} max={dailyGoal} size={76} />
      <View style={{ flex: 1, gap: 5 }}>
        <Eyebrow tint={colors.gold}>BUGÜNKÜ RİTİMİN</Eyebrow>
        <Text style={{ color: colors.white, fontSize: 19, fontWeight: '900', fontVariant: ['tabular-nums'] }}>{total} / {dailyGoal} tekrar</Text>
        <Text style={{ color: colors.muted, fontSize: 12 }}>{total >= dailyGoal ? 'Bugünkü kişisel hedef tamamlandı ✦' : 'Dilediğin hızda devam et.'}</Text>
      </View>
    </View>

    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ flex: 1, padding: 16, backgroundColor: '#2A2951', borderRadius: 21, gap: 7 }}>
        <Sparkles size={20} color={colors.lavender} />
        <Text style={{ color: colors.white, fontSize: 18, fontWeight: '900' }}>{completedDays} gün</Text>
        <Text style={{ color: '#C8C0DF', fontSize: 11 }}>Hedef serin</Text>
      </View>
      <Link href="/radio" asChild>
        <Pressable style={{ flex: 1, padding: 16, backgroundColor: '#3E3536', borderRadius: 21, gap: 7 }} accessibilityRole="button">
          <Radio size={20} color={colors.gold} />
          <Text style={{ color: colors.white, fontSize: 18, fontWeight: '900' }}>Canlı yayın</Text>
          <Text style={{ color: '#E0CBB8', fontSize: 11 }}>Diyanet radyoları  →</Text>
        </Pressable>
      </Link>
    </View>

    <SectionHeading title="Bugünün seçkisi" hint="Her gün yenilenir" />
    {remaining.map((item) => <ZikirCard item={item} key={item.id} compact />)}
    <Link href="/library" asChild>
      <Pressable style={{ alignSelf: 'center', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <Text style={{ color: colors.teal, fontWeight: '800' }}>Tüm zikirleri keşfet</Text><ArrowRight size={17} color={colors.teal} />
      </Pressable>
    </Link>
  </Page>;
}
