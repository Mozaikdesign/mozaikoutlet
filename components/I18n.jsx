/* global React */
const { createContext, useContext, useState, useEffect } = React;

const DICT = {
  en: {
    announce: 'FINAL DAYS · BEFORE THESE PIECES FIND A NEW HOME — SHOWROOM PIECES UP TO 55% OFF',
    nav: { indoor: 'Indoor', outdoor: 'Outdoor', lighting: 'Lighting', objects: 'Objects', brands: 'Brands' },
    searchPlaceholder: 'Search 274 pieces…',
    account: 'Account',
    bag: 'Bag',
    subscribe: 'Subscribe',
    callBtn: 'Bize Ulaşın',
    hero: {
      eyebrowLeft: 'Mozaik Design Outlet Catalogue',
      eyebrowRight: 'Istanbul · Kağıthane · +90 212 327 05 95 · +90 539 576 18 00',
      titlePart1: 'The Showroom Collection is',
      titleEm: 'Now At the Outlet.',
      titlePart2: '',
      titleU: '',
      sub: 'Timeless Italian design, in singular pieces. Original designs selected from B&B Italia, Cassina, Flexform, Maxalto, Paola Lenti, Vitra, and Knoll, offered at special prices.',
      subEm: '',
      pickerLabel: 'I am looking for',
      indoorTitle: 'Indoor',
      indoorSub: 'sofas · chairs · tables · storage · objects',
      outdoorTitle: 'Outdoor',
      outdoorSub: 'terrace · garden · poolside',
      lightingTitle: 'Lighting',
      lightingSub: 'pendants · table · floor · wall',
      allTitle: 'The whole lot',
      allSub: 'browse everything',
      pieces: 'pieces',
      enter: 'View',
      stats: [
        ['274', 'pieces in this lot'],
        ['42', 'brands'],
        ['−55%', 'off list price'],
        ['1', 'iconic pieces. always'],
      ],
      view: 'view',
      views: { grid: 'grid', editorial: 'editorial', list: 'list' },
    },
    filters: {
      collection: 'Collection',
      category: 'Category',
      allCategories: 'All categories',
      discountBand: 'Discount band',
      bands: {
        any: 'Any discount',
        '15-29': '15–29%',
        '30-44': '30–44%',
        '45-59': '45–59%',
        '60-plus': '60% and over',
      },
      house: 'House',
      allHouses: 'All houses',
      sort: 'Sort',
      sorts: {
        featured: 'Featured',
        discount: 'Biggest discount',
        'price-low': 'Price, low to high',
        'price-high': 'Price, high to low',
        brand: 'By house (A–Z)',
      },
    },
    breadcrumb: { whole: 'The whole lot', pieces: 'pieces' },
    list: { house: 'House', piece: 'Piece', qty: 'Qty', list: 'List', outlet: 'Outlet' },
    empty: { title: 'Nothing matches — yet.', body: 'Try relaxing the filters, or search by house.', clear: 'clear everything' },
    qty: { one: 'one of one', two: '2 left', many: 'available' },
    loading: 'loading the showroom…',
    footer: {
      desc: 'Mozaik Design Outlet Catalog. Discover product collections full of Mozaik\'s inspiring curated selections.',
      address: 'Outlet Store: Istanbul, Kağıthane, Ulubaş Cad., 37A',
      appt: 'Phone: +90 212 327 05 95 · +90 539 576 18 00',
      follow: 'Follow us',
      shop: 'Catalogue', services: '', house: 'Customer Service',
      viewSite: 'View', mobile: 'Mobile', desktop: 'Desktop',
      shopLinks: ['Online Outlet Store', 'Online Stock', 'Products', 'Brands'],
      servicesLinks: [],
      houseLinks: ['Frequently Asked Questions'],
      newsletter: {
        title: 'Subscribe to our newsletter',
        body: 'Don\'t miss new products, news, and campaigns!',
        placeholder: 'Email address',
        phonePlaceholder: 'Phone number (optional)',
        addressPlaceholder: 'Address (optional)',
        submit: 'Subscribe',
        sending: 'Sending…',
        success: 'Thank you — you\'re on the list.',
        error: 'Something went wrong. Please try again or email info@mozaikdesign.com.',
        consent: 'I have read, understood, and approve the Clarification Text regarding my personal data to be processed.',
      },
      infoPanels: {
        services: [
          { title: 'Award-winning Products', body: 'A curated selection of pieces honoured at the Compasso d\'Oro, Red Dot, iF Design and EDIDA awards. From Le Corbusier and Charlotte Perriand at Cassina to Patricia Urquiola at B&B Italia — design history, in stock at outlet pricing. Filter the catalogue or ask our team for the full award list.' },
        ],
        house: [
          {
            title: 'Frequently Asked Questions',
            qa: [
              {
                q: 'Shipping fees',
                a: ['Shipping fees vary depending on the weight of the product and the delivery destination. All orders are carefully packaged by the Mozaik Delivery Team in accordance with our shipping standards to ensure safe transportation. Shipping rates for deliveries outside the city may also vary depending on the destination.'],
              },
              {
                q: 'My order hasn\'t arrived — what should I do?',
                a: ['If your order has not arrived, or if you experience any issues regarding delivery, please contact us at info@mozaikdesign.com.'],
              },
              {
                q: 'How can I return a product?',
                a: [
                  'You may request a return within 14 days from the delivery date by contacting our Customer Relations team. To be eligible for a return, products must:',
                  ['Be unused', 'Be returned in their original packaging', 'Be free from any damage', 'Retain their original condition and resale quality'],
                  'Returns cannot be accepted for products that have been used, damaged, altered, or returned without their original packaging. Products must be returned in the same condition in which they were delivered.',
                  'The return policy above applies only to purchases made through our online store. Personalized or made-to-order products cannot be returned.',
                ],
              },
              {
                q: 'What should I do if my product arrives damaged?',
                a: [
                  'If you notice any signs of damage, impact, or tampering on the package at the time of delivery, please do not accept the shipment before requesting a damage report from the courier representative.',
                  'Once the report has been completed, please contact our Customer Service team and provide the necessary information regarding the issue.',
                ],
              },
              {
                q: 'How are refunds processed?',
                a: [
                  'Once the returned product reaches our warehouse, it will be inspected to ensure that it meets the return conditions. Approved refunds will be processed within 5 business days.',
                  'After the refund has been issued, the time required for the amount to appear in your account may vary depending on your bank\'s processing procedures. For updates regarding your refund status, please contact your bank directly.',
                ],
              },
            ],
          },
        ],
      },
      copyright: '© 2026 Mozaikdesign · all pieces ex-display · priced in EUR incl. VAT',
      tagline: 'Every piece sold is retired from the catalogue within the hour.',
    },
    modal: {
      close: 'close ×',
      tryRoom: 'Try in your room',
      tabs: { details: 'details', dimensions: 'dimensions', condition: 'condition', delivery: 'delivery' },
      asCatalogued: 'As catalogued',
      save: '○ save to list',
      saved: '● saved',
      reserve: 'Reserve this piece',
      callBtn: 'Bize Ulaşın',
      oneOnly: 'One of one. When this piece leaves the showroom, the listing is retired.',
      manyAvail: (n) => `${n} available — each ex-display, each sold once.`,
      listPrice: 'Original list price',
      outletPrice: 'Outlet price',
      youSave: 'You save',
      detailsP1Singular: 'singular in this lot',
      detailsP1Limited: 'limited in this lot',
      detailsP1: (brand, cat, scarcity) => (
        <>A showroom piece from <strong>{brand}</strong>, held here at our Istanbul outlet. {cat} — {scarcity}.</>
      ),
      detailsP2: 'All measurements and condition notes are taken on-site. This piece has been used in a showroom setting and may carry minor surface marks consistent with ex-display status.',
      dimsTolerance: 'Please allow ±2cm tolerance on upholstered pieces. Full condition report with measurements included with every invoice.',
      condition: [
        'Ex-display — showroom use only',
        'Original manufacturer tags retained where present',
        'Photographed in natural light, un-retouched',
        'Full condition report issued at invoice',
      ],
      deliveryP1: 'White-glove delivery worldwide. Istanbul & Milano pickup available by appointment. Crating and export documentation handled by our team.',
      deliveryP2: 'Typical lead time: 2–4 weeks within Europe, 4–8 weeks rest of world.',
      microcopy: 'Reserve holds the piece for 24 hours while our team confirms condition and dispatch. No charge until you approve.',
      phone: '+90 539 576 18 00',
      noReturn: 'No returns or exchanges.',
    },
    savedTray: {
      eyebrow: 'Your list',
      title: 'Saved pieces',
      empty: 'No pieces saved yet. Tap "save to list" on any piece to add it here.',
      reserve: 'Reserve',
      remove: 'Remove',
      clearAll: 'Clear all',
      clearConfirm: 'Remove all saved pieces?',
    },
    reserveMail: {
      subject: (p) => `Reserve: ${p.brand} ${p.name}`,
      bodyModal: (p) =>
        `Hello Mozaikdesign team,\n\nI'd like to reserve the piece below:\n\n` +
        `• ${p.brand} — ${p.name}\n` +
        `• Category: ${p.category}\n` +
        `• Dimensions: ${p.dims || '—'}\n` +
        `• Outlet price: €${p.saleEur?.toLocaleString('de-DE')}\n\n` +
        `Please confirm availability and condition.\n\nThank you.`,
      bodySaved: (p) =>
        `Hello Mozaikdesign team,\n\nI'd like to reserve:\n\n` +
        `• ${p.brand} — ${p.name}\n` +
        `• Dimensions: ${p.dims || '—'}\n` +
        `• Outlet price: €${p.saleEur?.toLocaleString('de-DE')}\n\nThank you.`,
      toast: (p) => `Reservation email opened for ${p.brand} ${p.name}. If nothing happened, write to simge@mozaikdesign.com.`,
    },
  },
  tr: {
    announce: 'SON GÜNLER · BU PARÇALAR YENİ SAHİBİNİ BULMADAN — TEŞHİR ÜRÜNLERİ %75\'E VARAN İNDİRİM',
    nav: { indoor: 'İç Mekan', outdoor: 'Dış Mekan', lighting: 'Aydınlatma', objects: 'Objeler', brands: 'Markalar' },
    searchPlaceholder: '274 parça içinde ara…',
    account: 'Hesap',
    bag: 'Sepet',
    subscribe: 'Abone Ol',
    callBtn: 'Bize Ulaşın',
    hero: {
      eyebrowLeft: 'Mozaik Design Outlet Katalog',
      eyebrowRight: 'İstanbul · Kağıthane · +90 212 327 05 95 · +90 539 576 18 00',
      titlePart1: 'Showroom seçkisi',
      titleEm: 'şimdi outlet\'te.',
      titlePart2: '',
      titleU: '',
      sub: 'B&B Italia, Cassina, Flexform, Maxalto, Paola Lenti, Vitra ve Knoll\'dan seçilen özgün tasarımlar, özel fiyatlarla sunuluyor. ',
      subEm: 'Mozaik\'in ilham veren özel seçkilerini keşfedin.',
      pickerLabel: 'Arıyorum',
      indoorTitle: 'İç Mekan',
      indoorSub: 'koltuk · sandalye · masa · depolama · obje',
      outdoorTitle: 'Dış Mekan',
      outdoorSub: 'teras · bahçe · havuz başı',
      lightingTitle: 'Aydınlatma',
      lightingSub: 'sarkıt · masa · ayaklı · duvar',
      allTitle: 'Tüm koleksiyon',
      allSub: 'hepsine göz at',
      pieces: 'parça',
      enter: 'Gör',
      stats: [
        ['274', 'ürün'],
        ['42', 'marka'],
        ['%55', "'e varan indirim"],
        ['1', 'ikonik parça. her zaman'],
      ],
      view: 'görünüm',
      views: { grid: 'ızgara', editorial: 'editoryal', list: 'liste' },
    },
    filters: {
      collection: 'Koleksiyon',
      category: 'Kategori',
      allCategories: 'Tüm kategoriler',
      discountBand: 'İndirim aralığı',
      bands: {
        any: 'Tüm indirimler',
        '15-29': '%15–29',
        '30-44': '%30–44',
        '45-59': '%45–59',
        '60-plus': '%60 ve üzeri',
      },
      house: 'Marka',
      allHouses: 'Tüm markalar',
      sort: 'Sırala',
      sorts: {
        featured: 'Öne çıkan',
        discount: 'En büyük indirim',
        'price-low': 'Fiyat, düşükten yükseğe',
        'price-high': 'Fiyat, yüksekten düşüğe',
        brand: 'Markaya göre (A–Z)',
      },
    },
    breadcrumb: { whole: 'Tüm koleksiyon', pieces: 'parça' },
    list: { house: 'Marka', piece: 'Ürün', qty: 'Adet', list: 'Liste', outlet: 'Outlet' },
    empty: { title: 'Henüz eşleşme yok.', body: 'Filtreleri gevşetmeyi veya markaya göre aramayı deneyin.', clear: 'tümünü temizle' },
    qty: { one: 'tek parça', two: '2 adet kaldı', many: 'adet mevcut' },
    loading: 'showroom yükleniyor…',
    footer: {
      desc: 'Mozaik\'in ilham veren özel seçkileriyle dolu ürün koleksiyonlarını keşfedin.',
      address: 'Outlet Mağaza: İstanbul, Kağıthane, Ulubaş Cad., 37A',
      appt: 'Telefon: +90 212 327 05 95 · +90 539 576 18 00',
      follow: 'Bizi takip edin',
      shop: 'Online Outlet Mağaza', services: '', house: 'Müşteri Hizmetleri',
      viewSite: 'Görünüm', mobile: 'Mobil', desktop: 'Masaüstü',
      shopLinks: ['Online Stok', 'Ürünler', 'Markalar'],
      servicesLinks: [],
      houseLinks: ['Sıkça Sorulan Sorular'],
      newsletter: {
        title: 'E-bültene kayıt olun',
        body: 'Yeni ürünler, haberler ve kampanyalar kaçırmayın!',
        placeholder: 'e-posta adresi',
        phonePlaceholder: 'Telefon numarası (isteğe bağlı)',
        addressPlaceholder: 'Adres (isteğe bağlı)',
        submit: 'Kayıt ol',
        sending: 'Gönderiliyor…',
        success: 'Teşekkürler — listeye eklendiniz.',
        error: 'Bir şeyler ters gitti. Lütfen tekrar deneyin veya info@mozaikdesign.com adresine yazın.',
        consent: 'İşlenecek kişisel verilerime ilişkin Aydınlatma Metnini okudum, anladım ve onaylıyorum.',
      },
      infoPanels: {
        services: [
          { title: 'Ödüllü Ürünler', body: 'Compasso d\'Oro, Red Dot, iF Design ve EDIDA ödüllerine layık görülmüş seçkin parçalar. Cassina\'da Le Corbusier ve Charlotte Perriand\'dan B&B Italia\'da Patricia Urquiola\'ya — tasarım tarihi, outlet fiyatlarıyla stoklarımızda. Katalogu filtrelemek veya tam ödül listesi için ekibimizle iletişime geçin.' },
        ],
        house: [
          {
            title: 'Sıkça Sorulan Sorular',
            qa: [
              {
                q: 'Kargo ücretleri',
                a: ['Kargo ücretleri ürünün ağırlığına ve teslimat adresine göre değişiklik gösterir. Tüm siparişler, güvenli taşıma için Mozaik Teslimat Ekibi tarafından kargo standartlarımıza uygun şekilde özenle paketlenir. Şehir dışı teslimatlarda kargo ücretleri varış noktasına göre de değişebilir.'],
              },
              {
                q: 'Siparişim gelmedi — ne yapmalıyım?',
                a: ['Siparişiniz ulaşmadıysa veya teslimatla ilgili herhangi bir sorun yaşarsanız lütfen info@mozaikdesign.com adresinden bizimle iletişime geçin.'],
              },
              {
                q: 'Bir ürünü nasıl iade edebilirim?',
                a: [
                  'Teslimat tarihinden itibaren 14 gün içinde Müşteri İlişkileri ekibimizle iletişime geçerek iade talebinde bulunabilirsiniz. İade için ürünlerin:',
                  ['Kullanılmamış olması', 'Orijinal ambalajında iade edilmesi', 'Herhangi bir hasar içermemesi', 'Orijinal durumunu ve yeniden satılabilir kalitesini koruması'],
                  'Kullanılmış, hasar görmüş, değiştirilmiş veya orijinal ambalajı olmadan iade edilen ürünler kabul edilemez. Ürünler teslim edildiği durumla aynı şekilde iade edilmelidir.',
                  'Yukarıdaki iade politikası yalnızca online mağazamızdan yapılan alışverişler için geçerlidir. Kişiye özel veya siparişe özel üretilen ürünler iade edilemez.',
                ],
              },
              {
                q: 'Ürünüm hasarlı gelirse ne yapmalıyım?',
                a: [
                  'Teslimat sırasında pakette herhangi bir hasar, darbe veya müdahale izi fark ederseniz, lütfen kurye yetkilisinden hasar tespit tutanağı talep etmeden gönderiyi teslim almayın.',
                  'Tutanak tamamlandıktan sonra lütfen Müşteri Hizmetleri ekibimizle iletişime geçerek konuyla ilgili gerekli bilgileri iletin.',
                ],
              },
              {
                q: 'İadeler nasıl işleme alınır?',
                a: [
                  'İade edilen ürün depomuza ulaştığında, iade koşullarını karşıladığından emin olmak için incelenir. Onaylanan iadeler 5 iş günü içinde işleme alınır.',
                  'İade işleme alındıktan sonra tutarın hesabınıza yansıması, bankanızın işlem süreçlerine göre değişebilir. İade durumunuzla ilgili güncellemeler için lütfen doğrudan bankanızla iletişime geçin.',
                ],
              },
            ],
          },
        ],
      },
      copyright: '© 2026 Mozaikdesign · tüm parçalar teşhir · KDV dahil EUR',
      tagline: 'Satılan her parça bir saat içinde katalogdan kaldırılır.',
    },
    modal: {
      close: 'kapat ×',
      tryRoom: 'Evinizde Nasıl Durduğunu Görün',
      tabs: { details: 'detaylar', dimensions: 'ölçüler', condition: 'durum', delivery: 'teslimat' },
      asCatalogued: 'Katalogda',
      save: '○ listeye kaydet',
      saved: '● kaydedildi',
      reserve: 'Bu parçayı rezerve et',
      callBtn: 'Bize Ulaşın',
      oneOnly: 'Tek parça. Bu parça showroom\'dan ayrıldığında ilan kaldırılır.',
      manyAvail: (n) => `${n} adet mevcut — her biri teşhir, her biri bir kez satılır.`,
      listPrice: 'Orijinal liste fiyatı',
      outletPrice: 'Outlet fiyatı',
      youSave: 'Kazancınız',
      detailsP1Singular: 'bu partide tek',
      detailsP1Limited: 'bu partide sınırlı',
      detailsP1: (brand, cat, scarcity) => (
        <><strong>{brand}</strong> showroom parçası, İstanbul outlet'imizde sergileniyor. {cat} — {scarcity}.</>
      ),
      detailsP2: 'Tüm ölçüler ve durum notları yerinde alınır. Bu parça showroom ortamında kullanılmıştır ve teşhir statüsüne uygun küçük yüzey izleri taşıyabilir.',
      dimsTolerance: 'Döşemeli parçalarda ±2cm tolerans tanıyın. Ölçüler içeren tam durum raporu her faturayla birlikte sunulur.',
      condition: [
        'Teşhir — yalnızca showroom kullanımı',
        'Mevcut olduğunda orijinal üretici etiketleri korunur',
        'Doğal ışıkta, rötuşsuz fotoğraflanmıştır',
        'Faturada tam durum raporu verilir',
      ],
      deliveryP1: 'Dünya çapında özel teslimat. İstanbul ve Milano\'dan randevuyla teslim alma mevcuttur. Sandıklama ve ihracat belgeleri ekibimiz tarafından yapılır.',
      deliveryP2: 'Tipik teslim süresi: Avrupa içinde 2–4 hafta, dünyanın geri kalanı 4–8 hafta.',
      microcopy: 'Rezervasyon, ekibimiz durumu ve sevkiyatı onaylarken parçayı 24 saat tutar. Onaylayana kadar ücret alınmaz.',
      phone: '+90 539 576 18 00',
      noReturn: 'İade ve değişim yoktur.',
    },
    savedTray: {
      eyebrow: 'Listeniz',
      title: 'Kaydedilen parçalar',
      empty: 'Henüz parça kaydetmediniz. Bir parçada "listeye kaydet"e dokunarak buraya ekleyin.',
      reserve: 'Rezerve et',
      remove: 'Kaldır',
      clearAll: 'Tümünü temizle',
      clearConfirm: 'Tüm kayıtlı parçalar kaldırılsın mı?',
    },
    reserveMail: {
      subject: (p) => `Rezervasyon: ${p.brand} ${p.name}`,
      bodyModal: (p) =>
        `Merhaba Mozaikdesign ekibi,\n\nAşağıdaki parçayı rezerve etmek istiyorum:\n\n` +
        `• ${p.brand} — ${p.name}\n` +
        `• Kategori: ${p.category}\n` +
        `• Ölçüler: ${p.dims || '—'}\n` +
        `• Outlet fiyatı: €${p.saleEur?.toLocaleString('de-DE')}\n\n` +
        `Lütfen uygunluğu ve ürün durumunu teyit edebilir misiniz?\n\nTeşekkürler.`,
      bodySaved: (p) =>
        `Merhaba Mozaikdesign ekibi,\n\nŞu parçayı rezerve etmek istiyorum:\n\n` +
        `• ${p.brand} — ${p.name}\n` +
        `• Ölçüler: ${p.dims || '—'}\n` +
        `• Outlet fiyatı: €${p.saleEur?.toLocaleString('de-DE')}\n\nTeşekkürler.`,
      toast: (p) => `${p.brand} ${p.name} için rezervasyon e-postası açıldı. Bir şey olmadıysa simge@mozaikdesign.com adresine yazın.`,
    },
  },
};

const I18nContext = createContext({ t: DICT.en, lang: 'en', setLang: () => {} });

function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('mozaik.lang') || 'en');
  useEffect(() => {
    localStorage.setItem('mozaik.lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const t = DICT[lang] || DICT.en;
  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

function useI18n() {
  return useContext(I18nContext);
}

window.I18N = { I18nProvider, useI18n, DICT };
