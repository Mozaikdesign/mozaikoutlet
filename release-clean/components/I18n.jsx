/* global React */
const { createContext, useContext, useState, useEffect } = React;

const DICT = {
  en: {
    announce: 'FINAL DAYS · OUTLET CLOSING — SHOWROOM PIECES UP TO 70% OFF',
    nav: { indoor: 'Indoor', outdoor: 'Outdoor', objects: 'Objects', brands: 'Brands' },
    searchPlaceholder: 'Search 200 pieces…',
    account: 'Account',
    bag: 'Bag',
    subscribe: 'Subscribe',
    hero: {
      eyebrowLeft: 'Mozaik Design Outlet Catalogue',
      eyebrowRight: 'Istanbul · Kağıthane · +90 212 327 05 95',
      titlePart1: 'The showroom collection is',
      titleEm: 'now at the outlet.',
      titlePart2: '',
      titleU: '',
      sub: 'Timeless Italian design, in singular pieces. Original designs selected from B&B Italia, Cassina, Flexform, Maxalto, Paola Lenti, Vitra, and Knoll, offered at special prices.',
      subEm: '',
      pickerLabel: 'I am looking for',
      indoorTitle: 'Indoor',
      indoorSub: 'sofas · chairs · tables · storage · objects',
      outdoorTitle: 'Outdoor',
      outdoorSub: 'terrace · garden · poolside',
      allTitle: 'The whole lot',
      allSub: 'browse everything',
      pieces: 'pieces',
      stats: [
        ['200', 'pieces in this lot'],
        ['42', 'Italian houses'],
        ['−55%', 'average off list'],
        ['1', 'of each. always.'],
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
      appt: 'Phone: +90 212 327 05 95',
      shop: 'Catalogue', services: '', house: 'Customer Service',
      shopLinks: ['Online Outlet Store', 'Online Stock', 'Products', 'Brands', 'Designers', 'Explore Award-Winning Products'],
      servicesLinks: [],
      houseLinks: ['My Account', 'Order Tracking', 'Frequently Asked Questions', 'Delivery & Returns', 'Agreements', 'Terms of Use'],
      newsletter: {
        title: 'Subscribe to our newsletter',
        body: 'Don\'t miss new products, news, and campaigns!',
        placeholder: 'Email address',
        submit: 'Subscribe',
        consent: 'I have read, understood, and approve the Clarification Text regarding my personal data to be processed.',
      },
      infoPanels: {
        services: [
          { title: 'Award-winning Products', body: 'A curated selection of pieces honoured at the Compasso d\'Oro, Red Dot, iF Design and EDIDA awards. From Le Corbusier and Charlotte Perriand at Cassina to Patricia Urquiola at B&B Italia — design history, in stock at outlet pricing. Filter the catalogue or ask our team for the full award list.' },
        ],
        house: [
          { title: 'My Account', body: 'Sign in to view your saved pieces, order history, and reservation status. Don\'t have an account yet? Create one at checkout — it takes thirty seconds and lets you reserve outlet pieces for 24 hours while we confirm condition and dispatch.' },
          { title: 'Order Tracking', body: 'Every order receives a tracking link by email the moment it dispatches from our Istanbul warehouse. White-glove deliveries are scheduled directly with you by phone. For status on a current order, contact orders@mozaikdesign.com with your order number.' },
          { title: 'Frequently Asked Questions', body: 'Are outlet pieces authentic? Yes — every piece comes directly from our showroom or from the manufacturer. Are they returnable? Yes, within 14 days for unused condition. Do you ship internationally? Yes, white-glove worldwide. For everything else, write to hello@mozaikdesign.com.' },
          { title: 'Delivery & Returns', body: 'White-glove delivery worldwide, handled by our team. Istanbul & Milano: 5–10 days. Europe: 2–4 weeks. Rest of world: 4–8 weeks. Returns accepted within 14 days for unused pieces in original condition. Outlet pieces are sold as-described — see each listing\'s condition report.' },
          { title: 'Agreements', body: 'Distance Sales Agreement, Pre-Information Form, and KVKK personal data processing agreements are presented and accepted at checkout. Copies are emailed to you with your order confirmation. For prior review, write to legal@mozaikdesign.com.' },
          { title: 'Terms of Use', body: 'Use of this catalogue is subject to our Terms of Use and Privacy Notice. Outlet listings reflect a single physical piece per SKU; pricing is in EUR including VAT; availability changes in real time. Full terms at mozaikdesign.com/terms.' },
        ],
      },
      copyright: '© 2026 Mozaikdesign · all pieces ex-display · priced in EUR incl. VAT',
      tagline: 'Every piece sold is retired from the catalogue within the hour.',
    },
    modal: {
      close: 'close ×',
      tabs: { details: 'details', dimensions: 'dimensions', condition: 'condition', delivery: 'delivery' },
      asCatalogued: 'As catalogued',
      save: '○ save to list',
      saved: '● saved',
      reserve: 'Reserve this piece',
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
  },
  tr: {
    announce: 'SON GÜNLER · OUTLET KAPANIYOR — TEŞHİR ÜRÜNLERİ %70\'E VARAN İNDİRİM',
    nav: { indoor: 'İç Mekan', outdoor: 'Dış Mekan', objects: 'Objeler', brands: 'Markalar' },
    searchPlaceholder: '200 parça içinde ara…',
    account: 'Hesap',
    bag: 'Sepet',
    subscribe: 'Abone Ol',
    hero: {
      eyebrowLeft: 'Mozaik Design Outlet Katalog',
      eyebrowRight: 'İstanbul · Kağıthane · +90 212 327 05 95',
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
      allTitle: 'Tüm koleksiyon',
      allSub: 'hepsine göz at',
      pieces: 'parça',
      stats: [
        ['200', 'bu partide parça'],
        ['42', 'İtalyan marka'],
        ['−%55', 'liste fiyatından ortalama'],
        ['1', 'her birinden. her zaman.'],
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
      appt: 'Telefon: +90 212 327 05 95',
      shop: 'Online Outlet Mağaza', services: 'Keşfet', house: 'Müşteri Hizmetleri',
      shopLinks: ['Online Stok', 'Ürünler', 'Markalar', 'Tasarımcılar'],
      servicesLinks: ['Ödüllü Ürünler'],
      houseLinks: ['Hesabım', 'Sipariş Takibi', 'Sıkça Sorulan Sorular', 'Teslimat ve İade', 'Sözleşmeler', 'Kullanım Koşulları'],
      newsletter: {
        title: 'E-bültene kayıt olun',
        body: 'Yeni ürünler, haberler ve kampanyalar kaçırmayın!',
        placeholder: 'e-posta adresi',
        submit: 'Kayıt ol',
        consent: 'İşlenecek kişisel verilerime ilişkin Aydınlatma Metnini okudum, anladım ve onaylıyorum.',
      },
      infoPanels: {
        services: [
          { title: 'Ödüllü Ürünler', body: 'Compasso d\'Oro, Red Dot, iF Design ve EDIDA ödüllerine layık görülmüş seçkin parçalar. Cassina\'da Le Corbusier ve Charlotte Perriand\'dan B&B Italia\'da Patricia Urquiola\'ya — tasarım tarihi, outlet fiyatlarıyla stoklarımızda. Katalogu filtrelemek veya tam ödül listesi için ekibimizle iletişime geçin.' },
        ],
        house: [
          { title: 'Hesabım', body: 'Kaydettiğiniz parçaları, sipariş geçmişinizi ve rezervasyon durumunuzu görmek için giriş yapın. Hesabınız yok mu? Ödeme adımında otuz saniyede oluşturabilirsiniz — outlet parçalarını biz durum ve sevkiyatı onaylarken 24 saat süreyle rezerve edebilirsiniz.' },
          { title: 'Sipariş Takibi', body: 'Siparişiniz İstanbul depomuzdan çıkar çıkmaz size e-posta ile takip linki gönderilir. Özel teslimatlar telefonla doğrudan sizinle planlanır. Mevcut siparişinizin durumu için sipariş numaranızla orders@mozaikdesign.com adresine yazın.' },
          { title: 'Sıkça Sorulan Sorular', body: 'Outlet parçalar orijinal mi? Evet — her parça doğrudan showroom\'umuzdan ya da üreticiden gelir. İade edilebilir mi? Kullanılmamış halde 14 gün içinde, evet. Yurt dışına gönderiyor musunuz? Evet, dünya çapında özel teslimat. Diğer sorularınız için: hello@mozaikdesign.com.' },
          { title: 'Teslimat ve İade', body: 'Tüm dünyaya kendi ekibimizle özel teslimat. İstanbul ve Milano: 5–10 gün. Avrupa: 2–4 hafta. Dünyanın geri kalanı: 4–8 hafta. Kullanılmamış ve orijinal halinde olan parçalar için 14 gün içinde iade kabul edilir. Outlet parçalar tariflendiği gibi satılır — her ilanın durum raporuna bakınız.' },
          { title: 'Sözleşmeler', body: 'Mesafeli Satış Sözleşmesi, Ön Bilgilendirme Formu ve KVKK kişisel veri işleme onayları ödeme aşamasında sunulur ve onaylanır. Onay kopyalarınız sipariş onayınızla birlikte e-posta ile iletilir. Önceden incelemek için: legal@mozaikdesign.com.' },
          { title: 'Kullanım Koşulları', body: 'Bu katalogun kullanımı Kullanım Koşulları ve Aydınlatma Metnimize tabidir. Outlet ilanları her SKU için tek bir fiziksel parçayı yansıtır; fiyatlar KDV dahil EUR cinsindendir; stok gerçek zamanlı değişir. Tam koşullar: mozaikdesign.com/terms.' },
        ],
      },
      copyright: '© 2026 Mozaikdesign · tüm parçalar teşhir · KDV dahil EUR',
      tagline: 'Satılan her parça bir saat içinde katalogdan kaldırılır.',
    },
    modal: {
      close: 'kapat ×',
      tabs: { details: 'detaylar', dimensions: 'ölçüler', condition: 'durum', delivery: 'teslimat' },
      asCatalogued: 'Katalogda',
      save: '○ listeye kaydet',
      saved: '● kaydedildi',
      reserve: 'Bu parçayı rezerve et',
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
