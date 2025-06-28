# Cloudinary Entegrasyonu Kurulum Rehberi

## 1. Cloudinary Hesabı Oluşturma

1. [Cloudinary](https://cloudinary.com) sitesine gidin
2. Ücretsiz hesap oluşturun
3. Dashboard'dan aşağıdaki bilgileri alın:
   - Cloud Name
   - API Key
   - API Secret

## 2. Environment Variables Ayarlama

`.env.local` dosyasını oluşturun ve aşağıdaki değerleri ekleyin:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 3. Özellikler

### ✅ Otomatik Optimizasyon
- Resimler otomatik olarak WebP formatına dönüştürülür
- Kalite otomatik optimize edilir
- Maksimum boyut: 1200x800px

### ✅ Klasör Organizasyonu
- Tüm emlak resimleri `irem-properties/` klasöründe saklanır
- Benzersiz dosya isimleri otomatik oluşturulur

### ✅ Güvenlik
- Sadece resim dosyaları kabul edilir
- API anahtarları environment variables'da saklanır

## 4. Kullanım

Sistem otomatik olarak çalışır. İlan ekleme formunda resim yüklediğinizde:

1. Resim Cloudinary'ye yüklenir
2. Optimize edilir (boyut, format, kalite)
3. CDN URL'i MongoDB'ye kaydedilir

## 5. Avantajlar

- **Hızlı Yükleme**: Global CDN ağı
- **Otomatik Optimizasyon**: Bandwidth tasarrufu
- **Sınırsız Depolama**: Sunucu disk alanı tasarrufu
- **Backup**: Otomatik yedekleme
- **Transformasyon**: Dinamik resim boyutlandırma

## 6. Maliyet

- **Ücretsiz Plan**: 25GB depolama, 25GB bandwidth/ay
- **Ücretli Planlar**: İhtiyaca göre ölçeklenebilir

## 7. Geçiş

Mevcut yerel resimler için migration scripti:

```bash
npm run migrate-images-to-cloudinary
```

Bu script mevcut `public/uploads/properties/` klasöründeki resimleri Cloudinary'ye taşır.
