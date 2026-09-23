import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Bell, CalendarDays, Check, Flame, Target } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Eyebrow, Page, ProgressRing, SectionHeading } from '../../components/ui';
import { zikirs } from '../../data/zikirs';
import { useSession } from '../../state/session';
import { colors } from '../../theme/colors';
import { dayKey, shiftDay, streak, todayTotal } from '../../utils/daily';

const REMINDER_KEY = 'dkd_drabornzikir_reminder_v1';
type Reminder = { hour: number; identifier: string } | null;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export default function ProgressScreen() {
  const { counts, total, dailyGoal, setDailyGoal } = useSession();
  const [reminder, setReminder] = useState<Reminder>(null);
  const [busy, setBusy] = useState(false);
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    AsyncStorage.getItem(REMINDER_KEY).then((value) => {
      if (value) setReminder(JSON.parse(value) as Reminder);
    }).catch(() => {});
    const timer = setInterval(() => setToday(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const selectReminder = async (hour: number | null) => {
    if (busy) return;
    setBusy(true);
    try {
      if (hour !== null) {
        await Notifications.setNotificationChannelAsync('dkd-zikir', {
          name: 'Günlük zikir hatırlatması', importance: 3
        });
        const permission = await Notifications.requestPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Bildirim izni gerekli', 'Günlük hatırlatmayı açmak için cihaz ayarlarından bildirimlere izin ver.');
          return;
        }
      }
      if (reminder?.identifier) await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
      if (hour === null) {
        setReminder(null);
        await AsyncStorage.removeItem(REMINDER_KEY);
      } else {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: { title: 'DraBornZikir ✦', body: 'Bugünün zikrine birkaç dakika ayırmak ister misin?' },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute: 0, channelId: 'dkd-zikir' }
        });
        const next = { hour, identifier };
        setReminder(next);
        await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(next));
      }
    } catch {
      Alert.alert('Hatırlatma ayarlanamadı', 'Lütfen telefonun bildirim ayarlarını kontrol et.');
    } finally { setBusy(false); }
  };

  const days = Array.from({ length: 7 }, (_, index) => shiftDay(today, index - 6));
  const completedDays = streak(counts, dailyGoal, today);
  const countsToday = counts[dayKey(today)] ?? {};
  const top = Object.entries(countsToday).filter(([, count]) => count > 0).sort((first, second) => second[1] - first[1]).slice(0, 4);

  return <Page>
    <Eyebrow>✦  KİŞİSEL YOLCULUĞUN</Eyebrow>
    <Text style={{ color: colors.white, fontSize: 32, fontWeight: '900', letterSpacing: -1 }}>Küçük anlar, güzel bir alışkanlık.</Text>
    <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 22 }}>Sayılar sadece sana ait; ibadetin değeri bir puana sığmaz.</Text>

    <View style={{ borderRadius: 27, padding: 24, backgroundColor: '#193C48', borderWidth: 1, borderColor: '#4F877F', alignItems: 'center', gap: 12 }}>
      <ProgressRing value={total} max={dailyGoal} size={155} color={colors.teal}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.white, fontSize: 33, fontWeight: '900', fontVariant: ['tabular-nums'] }}>{total}</Text>
          <Text style={{ color: '#B9E6DC', fontSize: 12 }}>/ {dailyGoal} tekrar</Text>
        </View>
      </ProgressRing>
      <Text style={{ color: colors.white, fontWeight: '800', fontSize: 17 }}>{total >= dailyGoal ? 'Bugünkü kişisel hedefine ulaştın ✦' : 'Bugün kendi ritminde devam et'}</Text>
      <Text style={{ color: colors.muted, fontSize: 12 }}>Günlük sayım telefonunda saklanır.</Text>
    </View>

    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ flex: 1, padding: 18, borderRadius: 20, backgroundColor: '#3B3147', gap: 5 }}>
        <Flame color={colors.coral} size={22} /><Text style={{ color: colors.white, fontWeight: '900', fontSize: 22 }}>{completedDays}</Text><Text style={{ color: colors.muted, fontSize: 12 }}>Hedefe ulaşılan seri</Text>
      </View>
      <View style={{ flex: 1, padding: 18, borderRadius: 20, backgroundColor: '#263E51', gap: 5 }}>
        <CalendarDays color={colors.gold} size={22} /><Text style={{ color: colors.white, fontWeight: '900', fontSize: 22 }}>{days.filter((date) => todayTotal(counts, date) >= dailyGoal).length} / 7</Text><Text style={{ color: colors.muted, fontSize: 12 }}>Bu haftanın günleri</Text>
      </View>
    </View>

    <SectionHeading title="Son 7 gün" />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 5, padding: 15, backgroundColor: colors.surface, borderRadius: 22 }}>
      {days.map((date) => {
        const amount = todayTotal(counts, date);
        const complete = amount >= dailyGoal;
        const isToday = dayKey(today) === dayKey(date);
        return <View key={dayKey(date)} style={{ alignItems: 'center', gap: 9, flex: 1 }}>
          <Text style={{ color: isToday ? colors.white : colors.muted, fontSize: 10 }}>{new Intl.DateTimeFormat('tr-TR', { weekday: 'short' }).format(date).replace('.', '')}</Text>
          <View style={{ width: 32, height: 32, backgroundColor: complete ? colors.teal : amount > 0 ? '#385D5D' : '#203B49', borderWidth: isToday ? 1 : 0, borderColor: colors.gold, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }}>
            {complete ? <Check size={17} color={colors.black} /> : <Text style={{ color: amount > 0 ? colors.white : colors.muted, fontSize: 11, fontWeight: '800' }}>{date.getDate()}</Text>}
          </View>
        </View>;
      })}
    </View>

    <View style={{ gap: 11 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}><Target size={18} color={colors.gold} /><Text style={{ color: colors.white, fontWeight: '800', fontSize: 20 }}>Günlük hedefin</Text></View>
      <View style={{ flexDirection: 'row', gap: 8 }}>{[33, 66, 100, 200].map((goal) => <Pressable key={goal} onPress={() => setDailyGoal(goal)} style={{ flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 15, borderWidth: 1, borderColor: dailyGoal === goal ? colors.teal : colors.stroke, backgroundColor: dailyGoal === goal ? '#26534F' : colors.surface }}><Text style={{ color: dailyGoal === goal ? colors.white : colors.muted, fontWeight: '800', fontSize: 13 }}>{goal}</Text></Pressable>)}</View>
      <Text style={{ color: colors.muted, fontSize: 11, lineHeight: 18 }}>Bu sayı kişisel takip hedefindir; bütün zikirler için dinî tavsiye olarak sunulmaz.</Text>
    </View>

    <View style={{ gap: 11 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}><Bell size={18} color={colors.lavender} /><Text style={{ color: colors.white, fontWeight: '800', fontSize: 20 }}>Günlük hatırlatma</Text></View>
      <View style={{ flexDirection: 'row', gap: 8 }}>{[{ hour: null, title: 'Kapalı' }, { hour: 8, title: '08:00' }, { hour: 20, title: '20:00' }].map((option) => {
        const selected = reminder?.hour === option.hour || (!reminder && option.hour === null);
        return <Pressable key={option.title} onPress={() => selectReminder(option.hour)} disabled={busy} style={{ flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 15, borderWidth: 1, borderColor: selected ? colors.lavender : colors.stroke, backgroundColor: selected ? '#403956' : colors.surface }}><Text style={{ color: selected ? colors.white : colors.muted, fontWeight: '800', fontSize: 12 }}>{option.title}</Text></Pressable>;
      })}</View>
      <Text style={{ color: colors.muted, fontSize: 11 }}>İzin verirsen her gün seçtiğin saatte yalnızca bir yerel bildirim planlanır.</Text>
    </View>

    <SectionHeading title="Bugün okudukların" />
    {top.length === 0 ? <Text style={{ color: colors.muted, padding: 17, backgroundColor: colors.surface, borderRadius: 15 }}>İlk zikir sayacını açtığında burada görünecek.</Text> : top.map(([id, count]) => {
      const item = zikirs.find((entry) => entry.id === id);
      return item ? <View key={id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14, backgroundColor: colors.surface }}>
        <Text style={{ color: item.tint, fontSize: 25 }}>{item.icon}</Text><Text style={{ color: colors.white, flex: 1, fontWeight: '700' }}>{item.title}</Text><Text style={{ color: item.tint, fontWeight: '900', fontVariant: ['tabular-nums'] }}>{count}</Text>
      </View> : null;
    })}
  </Page>;
}
