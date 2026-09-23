import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams } from 'expo-router';
import { BookOpen, ExternalLink, Headphones, Heart, RotateCcw, Volume2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudioBadge, Eyebrow, ProgressRing } from '../../components/ui';
import { zikirs } from '../../data/zikirs';
import { useSession } from '../../state/session';
import { colors } from '../../theme/colors';
import { dayKey } from '../../utils/daily';

export function generateStaticParams() {
  return zikirs.map((item) => ({ id: item.id }));
}

export default function ZikirDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = zikirs.find((entry) => entry.id === id);
  const insets = useSafeAreaInsets();
  const { counts, favorites, targets, addCount, resetCount, toggleFavorite, audioError, current, openUrl } = useSession();
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!item) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}><Text style={{ color: colors.white }}>İçerik bulunamadı.</Text></View>;
  const count = counts[dayKey(date)]?.[item.id] ?? 0;
  const target = targets[item.id] ?? item.suggestedCount;
  const favorite = favorites.includes(item.id);
  const isError = current?.key === 'zikir:' + item.id && audioError;

  return <>
    <Stack.Screen options={{ title: item.title }} />
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingHorizontal: 21, paddingTop: 20, paddingBottom: insets.bottom + 45, gap: 19 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Eyebrow tint={item.tint}>✦  {item.category.toUpperCase()}</Eyebrow>
        <Pressable accessibilityRole="button" accessibilityLabel={favorite ? 'Favoriden kaldır' : 'Favoriye ekle'} onPress={() => toggleFavorite(item.id)} style={{ backgroundColor: colors.surface2, padding: 11, borderRadius: 14 }}>
          <Heart size={20} color={favorite ? colors.coral : colors.muted} fill={favorite ? colors.coral : 'transparent'} />
        </Pressable>
      </View>

      <LinearGradient colors={['#254652', '#153244', '#102938']} style={{ borderRadius: 29, borderWidth: 1, borderColor: item.tint + '6B', padding: 23, gap: 18 }}>
        <Text style={{ color: colors.white, fontSize: 25, fontWeight: '900', letterSpacing: -0.6 }}>{item.title}</Text>
        <Text selectable style={{ color: '#FFFBED', fontSize: 30, lineHeight: 56, textAlign: 'center', writingDirection: 'rtl', paddingVertical: 10 }}>{item.arabic}</Text>
        <View style={{ height: 1, backgroundColor: '#FFFFFF29' }} />
        <Text selectable style={{ color: '#CBEBE6', lineHeight: 23, fontSize: 14 }}>{item.pronunciation}</Text>
      </LinearGradient>

      <View style={{ borderRadius: 23, padding: 19, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.stroke, gap: 9 }}>
        <Eyebrow tint={colors.gold}>KISA ANLAMI</Eyebrow>
        <Text selectable style={{ color: colors.white, fontSize: 15, lineHeight: 25 }}>{item.meaning}</Text>
        <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19 }}>{item.note}</Text>
        <Pressable onPress={() => openUrl(item.sourceUrl)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 5 }} accessibilityRole="link">
          <BookOpen color={item.tint} size={16} />
          <Text style={{ color: item.tint, fontSize: 12, fontWeight: '700', flex: 1 }} numberOfLines={1}>{item.sourceLabel}</Text>
          <ExternalLink color={item.tint} size={14} />
        </Pressable>
      </View>

      <View style={{ gap: 11 }}>
        <AudioBadge item={item} />
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
          {item.audioUrl || item.audioAsset ? <Headphones size={16} color={item.tint} /> : <Volume2 size={16} color={colors.gold} />}
          <Text style={{ flex: 1, color: colors.muted, fontSize: 12, lineHeight: 18 }}>{item.audioUrl
            ? 'Gerçek kâri tilaveti · ' + item.reciter + '. Ses internetten oynatılır.'
            : item.audioAsset ? 'Sakin tempoda üretilmiş Arapça seslendirme. İnternet gerekmez; gerçek hoca kaydı değildir.'
            : 'Yavaş seslendirme telefonunun Arapça sesi varsa Arapça, yoksa Türkçe cihaz sesiyle yapılır; hoca kaydı değildir.'}</Text>
        </View>
        {isError ? <Text style={{ color: colors.coral, fontSize: 12 }}>Ses yüklenemedi. Bağlantını kontrol edip yeniden dene.</Text> : null}
      </View>

      <View style={{ borderRadius: 27, padding: 22, gap: 15, alignItems: 'center', backgroundColor: '#102F3A', borderColor: item.tint + '55', borderWidth: 1 }}>
        <Eyebrow tint={item.tint}>DİJİTAL TESBİH · BUGÜN</Eyebrow>
        <Pressable onPress={() => addCount(item.id)} accessibilityRole="button" accessibilityLabel={item.title + ' sayacına bir ekle'} style={{ padding: 3, borderRadius: 130 }}>
          <ProgressRing value={count} max={target} size={202} color={item.tint}>
            <LinearGradient colors={[item.tint + '55', '#1B4D54', '#11323E']} style={{ width: 148, height: 148, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.white, fontSize: 49, fontWeight: '900', fontVariant: ['tabular-nums'] }}>{count}</Text>
              <Text style={{ color: '#D1E4E1', fontSize: 11, fontWeight: '700' }}>DOKUN · +1</Text>
            </LinearGradient>
          </ProgressRing>
        </Pressable>
        <Text style={{ color: colors.white, fontSize: 13, fontWeight: '700' }}>{count >= target ? 'Kişisel hedef tamamlandı ✦' : target + ' tekrar hedefine ' + (target - count) + ' kaldı'}</Text>
        <Text style={{ color: colors.muted, fontSize: 11, textAlign: 'center' }}>Sayacın uygulamayı kapatsan da bugün için korunur.</Text>
        <Pressable onPress={() => Alert.alert('Sayacı sıfırla?', 'Bu zikrin bugünkü sayımı silinecek.', [{ text: 'Vazgeç', style: 'cancel' }, { text: 'Sıfırla', style: 'destructive', onPress: () => resetCount(item.id) }])} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 }}>
          <RotateCcw color={colors.muted} size={15} /><Text style={{ color: colors.muted, fontSize: 12 }}>Bu sayacı sıfırla</Text>
        </Pressable>
      </View>

      <View style={{ gap: 11 }}>
        <Text style={{ color: colors.white, fontWeight: '800', fontSize: 18 }}>Bu sayfa için hedef</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[item.suggestedCount, 33, 99, 100].filter((number, index, array) => array.indexOf(number) === index).map((number) =>
            <TargetButton key={number} itemId={item.id} number={number} current={target} tint={item.tint} />
          )}
        </View>
        <Text style={{ color: colors.muted, fontSize: 11, lineHeight: 18 }}>Önerilen başlangıç sayısı içeriğe göre değişir; diğer seçenekler yalnızca kişisel sayım hedefidir.</Text>
      </View>
    </ScrollView>
  </>;
}

function TargetButton({ itemId, number, current, tint }: { itemId: string; number: number; current: number; tint: string }) {
  const { setTarget } = useSession();
  return <Pressable onPress={() => setTarget(itemId, number)} style={{ flex: 1, borderRadius: 14, borderWidth: 1, borderColor: current === number ? tint : colors.stroke, backgroundColor: current === number ? tint + '36' : colors.surface, paddingVertical: 12, alignItems: 'center' }}>
    <Text style={{ color: current === number ? colors.white : colors.muted, fontWeight: '900' }}>{number}</Text>
  </Pressable>;
}
