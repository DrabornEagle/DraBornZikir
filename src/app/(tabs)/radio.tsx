import { LinearGradient } from 'expo-linear-gradient';
import { ExternalLink, Headphones, Pause, Play, Radio, Wifi } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { Eyebrow, Page } from '../../components/ui';
import { stations, type Station } from '../../data/zikirs';
import { useSession } from '../../state/session';
import { colors } from '../../theme/colors';

function StationCard({ station, index }: { station: Station; index: number }) {
  const { current, playing, buffering, audioError, playStation, openUrl } = useSession();
  const active = current?.key === 'radio:' + station.id;
  return <LinearGradient colors={index === 0 ? ['#1C766F', '#174B55', '#143349'] : ['#1D3D4D', '#142D40']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 25, borderWidth: 1, borderColor: station.tint + '66', padding: 20, gap: 16 }}>
    <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
      <View style={{ width: 54, height: 54, borderRadius: 19, backgroundColor: station.tint + '33', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: station.tint, fontSize: 28 }}>{station.icon}</Text>
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ color: colors.white, fontSize: 17, fontWeight: '900' }}>{station.name}</Text>
        <Text style={{ color: '#C3D8D7', fontSize: 12 }}>{station.subtitle}</Text>
      </View>
      <View style={{ backgroundColor: '#F3737360', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <View style={{ width: 5, height: 5, borderRadius: 4, backgroundColor: '#FF9991' }} />
        <Text style={{ color: '#FFE4DC', fontSize: 9, fontWeight: '900' }}>CANLI</Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={(active && (playing || buffering) ? 'Yayını durdur' : 'Yayını dinle') + ': ' + station.name} onPress={() => playStation(station)} style={{ flex: 1, backgroundColor: station.tint, paddingVertical: 14, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        {active && (playing || buffering) ? <Pause size={19} color={colors.black} fill={colors.black} /> : <Play size={19} color={colors.black} fill={colors.black} />}
        <Text style={{ color: colors.black, fontWeight: '900', fontSize: 14 }}>{active && (playing || buffering) ? 'Durdur' : 'Canlı dinle'}</Text>
      </Pressable>
      <Pressable onPress={() => openUrl(station.website)} accessibilityLabel={station.name + ' resmî sayfasını aç'} style={{ backgroundColor: '#FFFFFF19', borderWidth: 1, borderColor: '#FFFFFF45', padding: 14, borderRadius: 15 }}>
        <ExternalLink size={19} color={colors.white} />
      </Pressable>
    </View>
    {active && audioError ? <View style={{ gap: 7 }}>
      <Text style={{ color: '#FFC7B9', fontSize: 12 }}>Yayın şu anda yüklenemedi. Resmî sayfadan dinlemeyi deneyebilirsin.</Text>
      <Pressable onPress={() => openUrl(station.website)}><Text style={{ color: station.tint, fontSize: 12, fontWeight: '800' }}>Resmî yayını aç ↗</Text></Pressable>
    </View> : null}
    {active && buffering && !audioError ? <Text style={{ color: '#E1F6ED', fontSize: 12 }}>Yayın bağlanıyor...</Text> : null}
  </LinearGradient>;
}

export default function RadioScreen() {
  return <Page>
    <Eyebrow>●  CANLI RADYO</Eyebrow>
    <Text style={{ color: colors.white, fontSize: 33, fontWeight: '900', letterSpacing: -1.2 }}>Kulak ver, sakinleş.</Text>
    <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 23 }}>Diyanet’in yayınları bir dokunuşla yanında.</Text>
    <LinearGradient colors={['#36426D', '#172E51', '#102B43']} style={{ borderRadius: 26, minHeight: 172, padding: 22, justifyContent: 'space-between', overflow: 'hidden', borderWidth: 1, borderColor: '#6683A180' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}><Wifi size={17} color={colors.gold} /><Eyebrow tint={colors.gold}>İNTERNET ÜZERİNDEN</Eyebrow></View>
      <View style={{ alignSelf: 'center', flexDirection: 'row', gap: 7, alignItems: 'center' }}>
        {[18, 35, 55, 28, 69, 42, 23, 48, 65, 31, 51, 19].map((height, index) => <View key={index} style={{ width: 5, height, borderRadius: 5, backgroundColor: index % 2 ? colors.gold : colors.teal, opacity: 0.7 }} />)}
      </View>
      <Text style={{ color: '#E1ECF4', fontSize: 13, textAlign: 'center' }}>Sohbetler, dualar ve Kur’an tilavetleri</Text>
    </LinearGradient>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Headphones size={17} color={colors.teal} />
      <Text style={{ color: colors.white, fontSize: 20, fontWeight: '900' }}>Yayınları keşfet</Text>
    </View>
    {stations.map((station, index) => <StationCard key={station.id} station={station} index={index} />)}
    <View style={{ padding: 16, borderRadius: 18, backgroundColor: colors.surface, gap: 6 }}>
      <Radio size={18} color={colors.gold} />
      <Text style={{ color: colors.white, fontWeight: '700', fontSize: 13 }}>Bağımsız bir dinleme arayüzü</Text>
      <Text style={{ color: colors.muted, lineHeight: 19, fontSize: 12 }}>DraBornZikir, Diyanet’in resmî uygulaması değildir. Canlı yayının çalışması internet bağlantısına ve yayıncıya bağlıdır. Sağdaki ↗ düğmesi resmî dinleme sayfasını açar.</Text>
    </View>
  </Page>;
}
