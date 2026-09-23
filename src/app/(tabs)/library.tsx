import { Heart, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Eyebrow, Page, ZikirCard } from '../../components/ui';
import { type ZikirCategory, zikirs } from '../../data/zikirs';
import { useSession } from '../../state/session';
import { colors } from '../../theme/colors';

const categories = ['Tümü', 'Tesbih', 'Dua', 'Kur’an', 'Favoriler'] as const;
type Filter = (typeof categories)[number];

export default function LibraryScreen() {
  const [filter, setFilter] = useState<Filter>('Tümü');
  const [search, setSearch] = useState('');
  const { favorites } = useSession();
  const filtered = useMemo(() => zikirs.filter((item) => {
    if (filter === 'Favoriler' && !favorites.includes(item.id)) return false;
    if (filter !== 'Tümü' && filter !== 'Favoriler' && item.category !== (filter as ZikirCategory)) return false;
    const query = search.toLocaleLowerCase('tr-TR').trim();
    return !query || (item.title + ' ' + item.pronunciation + ' ' + item.meaning).toLocaleLowerCase('tr-TR').includes(query);
  }), [filter, search, favorites]);

  return <Page>
    <Eyebrow>✦  ZİKİR KÜTÜPHANESİ</Eyebrow>
    <View style={{ gap: 7 }}>
      <Text style={{ color: colors.white, fontSize: 32, fontWeight: '900', letterSpacing: -1 }}>Kalbine iyi geleni bul.</Text>
      <Text style={{ color: colors.muted, lineHeight: 22, fontSize: 14 }}>Anlamını oku, sesini dinle, kendi ritminde ilerle.</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.stroke, borderRadius: 18, paddingHorizontal: 15 }}>
      <Search size={19} color={colors.muted} />
      <TextInput value={search} onChangeText={setSearch} placeholder="Zikir veya dua ara..." placeholderTextColor={colors.muted} style={{ color: colors.white, flex: 1, height: 52, fontSize: 14 }} accessibilityLabel="Zikir ara" />
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -22 }} contentContainerStyle={{ paddingHorizontal: 22, gap: 9 }}>
      {categories.map((category) => <Pressable key={category} onPress={() => setFilter(category)} style={{ paddingHorizontal: 16, paddingVertical: 11, borderRadius: 24, borderWidth: 1, borderColor: filter === category ? colors.teal : colors.stroke, backgroundColor: filter === category ? '#28554F' : colors.surface, flexDirection: 'row', gap: 6, alignItems: 'center' }}>
        {category === 'Favoriler' ? <Heart size={14} color={filter === category ? colors.teal : colors.muted} /> : null}
        <Text style={{ color: filter === category ? colors.white : colors.muted, fontSize: 12, fontWeight: '800' }}>{category}</Text>
      </Pressable>)}
    </ScrollView>
    <Text style={{ color: colors.muted, fontSize: 12 }}>{filtered.length} içerik</Text>
    {filtered.length === 0 ? <View style={{ padding: 30, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', gap: 8 }}>
      <Text style={{ fontSize: 26, color: colors.gold }}>✦</Text>
      <Text style={{ color: colors.white, fontWeight: '700' }}>Burada henüz bir şey yok</Text>
      <Text style={{ color: colors.muted, fontSize: 13, textAlign: 'center' }}>Başka bir sözcük veya kategori deneyebilirsin.</Text>
    </View> : filtered.map((item) => <ZikirCard key={item.id} item={item} compact />)}
  </Page>;
}
