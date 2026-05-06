# BGT 132 Final Projesi: Yılan Oyunu

## 📝 Proje Hakkında
Bu proje, **OSTİM Teknik Üniversitesi** BGT 132 Yazılım Geliştirme Teknolojileri dersi final ödevi kapsamında geliştirilmiştir. Klasik yılan oyunu mekanikleri, modern **Nesne Yönelimli Programlama (OOP)** prensipleri ve modüler mimari kullanılarak yeniden inşa edilmiştir.

## 🚀 Yeni Eklenen Özellikler
* **Dinamik Engel Sistemi:** Her başlangıçta haritada rastgele oluşan engeller (`Obstacle`), oyunun zorluk seviyesini artırır.
* **Hayatta Kalma Süresi (Timer):** Oyuncunun kaç saniye hayatta kaldığı anlık olarak takip edilir.
* **Gelişmiş Rekor Sistemi:** En yüksek skor ve en uzun hayatta kalma süresi `localStorage` kullanılarak tarayıcı hafızasında saklanır.
* **Zorluk Seviyeleri:** Kullanıcı Kolay, Normal ve Zor seçenekleriyle oyun hızını ayarlayabilir.

## 🎯 Uygulanan Yazılım Prensipleri
* **Kalıtım (Inheritance):** `Snake`, `Food` ve `Obstacle` sınıfları `GameEntity` temel sınıfından türetilmiştir.
* **Kapsülleme (Encapsulation):** Yılanın gövde yapısı ve yön bilgileri `#` private operatörü ile korunarak dış müdahalelere kapatılmıştır.
* **Çok Biçimlilik (Polymorphism):** Temel çizim metotları (`draw`), her varlık için özelleştirilerek (override) farklı görsel yapılar oluşturulmuştur.
* **Hata Yönetimi:** Kritik oyun döngüleri `try-catch` blokları ile güvenli hale getirilmiştir.

## 🛠️ Kurulum ve Çalıştırma Talimatı
Proje modern JavaScript modülleri (`ES6 Modules`) kullanmaktadır. Güvenlik politikaları (CORS) gereği doğrudan HTML dosyasına çift tıklanarak çalışmaz.

**Çalıştırma Adımları:**
1.  Proje klasörünü **VS Code** ile açın.
2.  **"Live Server"** eklentisinin kurulu olduğundan emin olun.
3.  `src/ui/index.html` dosyasına sağ tıklayıp **"Open with Live Server"** seçeneğine basın.
4.  Açılan tarayıcı ekranında zorluk seviyesini seçip **"Oyuna Başla"** butonuna tıklayın.

## 📂 Klasör Yapısı
* `docs/`: Gereksinim Analizi ve UML Diyagramları (PDF).
* `src/core/`: Temel oyun nesneleri (`Snake`, `Food`, `Obstacle`, `GameEntity`).
* `src/services/`: Oyun motoru ve yönetim mantığı (`GameManager`).
* `src/ui/`: Arayüz (HTML) dosyası.