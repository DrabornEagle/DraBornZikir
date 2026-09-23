import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import { type Station, type Zikir } from '../data/zikirs';
import { dayKey, todayTotal } from '../utils/daily';

const STORAGE_KEY = 'dkd_drabornzikir_v1';
type Counts = Record<string, Record<string, number>>;
type Stored = {
  counts: Counts;
  favorites: string[];
  dailyGoal: number;
  targets: Record<string, number>;
};
type CurrentAudio = {
  key: string;
  title: string;
  subtitle: string;
  kind: 'recitation' | 'radio' | 'speech';
} | null;
type Session = {
  ready: boolean;
  counts: Counts;
  favorites: string[];
  dailyGoal: number;
  targets: Record<string, number>;
  total: number;
  current: CurrentAudio;
  playing: boolean;
  buffering: boolean;
  audioError: string | null;
  addCount: (id: string) => void;
  resetCount: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setDailyGoal: (goal: number) => void;
  setTarget: (id: string, count: number) => void;
  playZikir: (item: Zikir) => Promise<void>;
  playStation: (station: Station) => Promise<void>;
  stopAudio: () => void;
  openUrl: (url: string) => Promise<void>;
};

const initial: Stored = { counts: {}, favorites: [], dailyGoal: 100, targets: {} };
const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Stored>(initial);
  const [clock, setClock] = useState(() => new Date());
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState<CurrentAudio>(null);
  const [speaking, setSpeaking] = useState(false);
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const total = todayTotal(state.counts, clock);
  const playing = current?.kind === 'speech' ? speaking : status.playing;
  const audioError = current?.kind === 'speech' ? null : status.error;

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'doNotMix' }).catch(() => {});
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (active && json) {
        const saved = JSON.parse(json) as Partial<Stored>;
        setState({
          counts: saved.counts && typeof saved.counts === 'object' ? saved.counts : {},
          favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
          dailyGoal: [33, 66, 100, 200].includes(saved.dailyGoal ?? 0) ? saved.dailyGoal! : 100,
          targets: saved.targets && typeof saved.targets === 'object' ? saved.targets : {}
        });
      }
    }).catch(() => {}).finally(() => { if (active) setReady(true); });
    return () => { active = false; Speech.stop().catch(() => {}); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => { AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {}); }, 180);
    return () => clearTimeout(timer);
  }, [state, ready]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'background' && ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    });
    return () => subscription.remove();
  }, [ready, state]);

  const addCount = (id: string) => {
    const today = dayKey();
    setState((previous) => ({
      ...previous,
      counts: { ...previous.counts, [today]: { ...previous.counts[today], [id]: (previous.counts[today]?.[id] ?? 0) + 1 } }
    }));
    Haptics.selectionAsync().catch(() => {});
  };

  const resetCount = (id: string) => {
    const today = dayKey();
    setState((previous) => ({
      ...previous,
      counts: { ...previous.counts, [today]: { ...previous.counts[today], [id]: 0 } }
    }));
  };

  const toggleFavorite = (id: string) => setState((previous) => ({
    ...previous,
    favorites: previous.favorites.includes(id)
      ? previous.favorites.filter((favorite) => favorite !== id)
      : [...previous.favorites, id]
  }));

  const stopAudio = () => {
    Speech.stop().catch(() => {});
    setSpeaking(false);
    player.pause();
    setCurrent(null);
  };

  const startStream = async (key: string, title: string, subtitle: string, source: string | number, kind: 'radio' | 'recitation') => {
    await Speech.stop().catch(() => {});
    setSpeaking(false);
    player.pause();
    setCurrent({ key, title, subtitle, kind });
    player.replace(typeof source === 'number' ? source : { uri: source });
    player.play();
  };

  const playZikir = async (item: Zikir) => {
    const key = 'zikir:' + item.id;
    if (current?.key === key && (playing || status.isBuffering)) { stopAudio(); return; }
    if (item.audioUrl || item.audioAsset) {
      try { await startStream(key, item.title, item.audioUrl ? 'Kâri • ' + item.reciter : 'Üretilmiş Arapça seslendirme', item.audioAsset ?? item.audioUrl!, 'recitation'); }
      catch { setCurrent(null); Alert.alert('Ses açılamadı', 'Bağlantını kontrol edip yeniden deneyebilirsin.'); }
      return;
    }
    player.pause();
    await Speech.stop().catch(() => {});
    const voices = await Speech.getAvailableVoicesAsync().catch(() => []);
    const arabicVoice = voices.find((voice) => voice.language.toLowerCase().startsWith('ar'));
    setCurrent({ key, title: item.title, subtitle: arabicVoice ? 'Arapça cihaz sesi • yavaş okuma' : 'Türkçe cihaz sesi • yavaş okuma', kind: 'speech' });
    setSpeaking(true);
    Speech.speak(arabicVoice ? item.arabic : item.pronunciation, {
      language: arabicVoice ? arabicVoice.language : 'tr-TR',
      voice: arabicVoice?.identifier,
      rate: 0.76, pitch: 0.83,
      onDone: () => { setSpeaking(false); setCurrent(null); },
      onError: () => { setSpeaking(false); setCurrent(null); Alert.alert('Seslendirme kullanılamıyor', 'Telefonunda Türkçe konuşma sesini etkinleştirip yeniden dene.'); }
    });
  };

  const playStation = async (station: Station) => {
    const key = 'radio:' + station.id;
    if (current?.key === key && (playing || status.isBuffering)) { stopAudio(); return; }
    try { await startStream(key, station.name, 'Diyanet • canlı yayın', station.url, 'radio'); }
    catch { setCurrent(null); Alert.alert('Yayın açılamadı', 'Resmî dinleme sayfasını açabilirsin.', [{ text: 'Kapat' }, { text: 'Sayfayı aç', onPress: () => { Linking.openURL(station.website).catch(() => {}); } }]); }
  };

  const openUrl = async (url: string) => {
    try { await Linking.openURL(url); }
    catch { Alert.alert('Bağlantı açılamadı', 'İnternet bağlantını kontrol et.'); }
  };

  const value: Session = {
    ready, counts: state.counts, favorites: state.favorites, dailyGoal: state.dailyGoal, targets: state.targets,
    total, current, playing, buffering: status.isBuffering, audioError, addCount, resetCount,
    toggleFavorite, setDailyGoal: (goal) => setState((previous) => ({ ...previous, dailyGoal: goal })),
    setTarget: (id, count) => setState((previous) => ({ ...previous, targets: { ...previous.targets, [id]: count } })),
    playZikir, playStation, stopAudio, openUrl
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('SessionProvider bulunamadı');
  return session;
}
