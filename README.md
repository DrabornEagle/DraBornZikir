# DraBornZikir · v0.1.0

DraBornEagle ekosistemi için Expo Go ile açılan zikir, dua ve canlı radyo uygulaması. **APK üretilmez.** İlk test hedefi: Android **Expo Go 58.0.0 / SDK 58**.

## İçerik

- Her yerel takvim gününde aynı kalan, ertesi gün değişen üçlü seçki: tesbih, dua ve kısa sure.
- 13 kaynak bağlantılı içerik; Arapça, okunuş, kısa anlam, arama ve favoriler.
- Her içerik için günlük dijital tesbih; seçilebilir kişisel hedef, güvenli sıfırlama, cihazda kayıt.
- Günlük toplam, yedi günlük görünüm, hedefe ulaşılan günlerin serisi.
- İzin verildiğinde her gün 08:00 veya 20:00 için tek yerel hatırlatma.
- İhlâs, Felak ve Nâs sureleri için **Abdullah Avvad el-Cüheynî'nin gerçek tilavetine** bağlantı. Diğer zikirlerde cihazda Arapça ses varsa yavaş Arapça seslendirme; yoksa yavaş Türkçe okunuş. Cihaz sesini gerçek hoca kaydı olarak tanıtmaz.
- Diyanet Radyo, Diyanet Kur'an Radyo ve Diyanet Risalet Radyo canlı HLS akışları; her kanalın resmî dinleme sayfasına doğrudan geçiş.

Metinler ve sayaç çevrim dışı çalışır. Tilavet ve radyo için internet gerekir. Yayınlar ve ses dosyaları ilgili yayıncıların sunucularından doğrudan açılır; uygulama onları kopyalamaz. **DraBornZikir, Diyanet İşleri Başkanlığı'nın resmî uygulaması değildir.**

### Kaynaklar ve sınırlar

Namaz tesbihatı ve sayıları için [Diyanet fetvası](https://kurul.diyanet.gov.tr/tr/fetva/namazlardan-sonra-tesbihat-nasil-yapilir/0193c42d-56d7-7df9-8636-ceba3a7927e6), diğer içerikler için her kartta görünen Diyanet hadis veya Kur'an bağlantısı kullanılır. Kısa anlamlar uygulama için özetlenmiştir; ayrıntılar için kaynak açılır. Sure sesleri [Quran Foundation belgelerinde](https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/chapter-reciter-audio-files/) belirtilen QuranicAudio sunucusundan gelir.

Radyo akış adresleri ağda kontrol edilmiştir, fakat yayıncı tarafından zamanla değiştirilebilir. Uygulama içi yayın açılmazsa karttaki dış bağlantı ilgili kanalın resmî sayfasını açar. Expo Go'da arka plan radyo oynatması garanti edilmez; bu sürüm açık uygulama testine yöneliktir.

SDK 58 için npm'deki en güncel yayımlanmış **58.0.0-preview.6** Expo sürümü kullanılır. Önizleme sürümünde React Native eş bağımlılıkları için proje npm ayarı vardır. Expo 58 kararlı npm sürümü çıktığında bu sabitleme ve kilit dosyası ayrıca güncellenmelidir.

## Termux · aynı Android telefonda Expo Go

Önce Expo Go 58.0.0 telefonunda yüklü olsun. Yeni bir Termux oturumunda aşağıdakileri **bir kerede kopyala**:

    pkg update -y
    pkg install -y nodejs-lts curl unzip
    mkdir -p ~/projects
    cd ~/projects
    curl -fL 'https://github.com/DrabornEagle/DraBornZikir/archive/refs/heads/main.zip' -o DraBornZikir_Source.zip
    unzip -q DraBornZikir_Source.zip
    cd DraBornZikir-main
    npm ci
    npx expo start --localhost -c

Sunucu açıldığında Expo Go içinde URL girişi ile **exp://127.0.0.1:8081** adresini aç. Aynı cihazda ikinci bir Termux oturumunda bağlantıyı açmayı da deneyebilirsin:

    termux-open-url 'exp://127.0.0.1:8081'

Sunucu penceresi açık kalmalıdır. Geliştirici bilgisayarı ve ayrı telefon kullanıyorsan npx expo start --lan -c çalıştırıp aynı Wi-Fi üzerindeki Expo Go ile QR kodu okut.

### Güncelleme

Yeni sürümü mevcut klasörde üzerine açabilirsin:

    cd ~/projects
    curl -fL 'https://github.com/DrabornEagle/DraBornZikir/archive/refs/heads/main.zip' -o DraBornZikir_Source.zip
    unzip -qo DraBornZikir_Source.zip
    cd DraBornZikir-main
    npm ci
    npx expo start --localhost -c

## Geliştirici denetimleri

    npm ci
    npm run typecheck
    npm run lint
    npx expo export --platform android

GitHub Actions her kod değişikliğinde tür denetimi, lint ve Android JS paketi oluşturma kontrolü yapar. APK, imzalama, Google Play yüklemesi ve sunucu/veritabanı bu sürümün kapsamı dışındadır.
