---
layout: post
title: Panduan Membuat Mobil untuk Pemula
subtitle: Dari nol sampai mobil bisa dikendarai di Open Street Simulator
tags: [roblox, mobil, panduan, open-street-simulator]
comments: false
author: ernugraha
---

{: .box-success}
Panduan ini ditulis untuk pemula. Ikuti **urutan langkahnya persis**, jangan melompat. Waktu yang dibutuhkan sekitar 30 menit untuk mobil pertama. Semua angka di bawah boleh disalin apa adanya.

## 0. Yang perlu disiapkan

- Roblox Studio dengan project game ini sudah terpasang semua script-nya.
- Jendela **Explorer** dan **Properties**: buka lewat tab **View**.
- **Command Bar**: tab **View**, lalu centang Command Bar (kotak panjang di bawah layar).
- **Output**: tab **View**, lalu Output (tempat pesan error muncul).

Tiga hal yang sering dipakai:

| Tujuan | Cara |
| :----- | :--- |
| Ganti nama | Klik item di Explorer, tekan **F2**, ketik nama, Enter |
| Gabungkan jadi Model | Pilih beberapa part (tahan Ctrl), tekan **Ctrl+G** |
| Duplikat | Pilih item, tekan **Ctrl+D** |

## 1. Pahami arah mobil (WAJIB)

Game ini hanya mengenal **satu arah depan: sumbu -Z**. Bangun mobil menghadap arah itu dan jangan memutar apa pun (semua **Orientation = 0, 0, 0**).

```
                 DEPAN  (-Z)
         WheelFL ----------- WheelFR
            |                 |
   KIRI     |      Body       |     KANAN
   (-X)     |   (kursi di     |     (+X)
            |    tengah)      |
         WheelRL ----------- WheelRR
                BELAKANG (+Z)
```

- **FL** = Front Left (roda depan kiri), **FR** = depan kanan, **RL** = belakang kiri, **RR** = belakang kanan.
- Atas = +Y. Roda menyentuh tanah di Y = 0.
- Satuan: 1 stud sekitar 0,28 meter. Mobil biasa panjangnya 12 stud dan lebarnya 6 stud.

## 2. Pilih jalur

| Jalur | Cocok untuk | Kesulitan |
| :---- | :---------- | :-------- |
| **A. Duplikat TestCar** | Pemula (paling mudah dan cepat) | Mudah |
| **B. Buat dari nol** | Ingin paham semua bagian | Sedang |
| **C. Model dari Toolbox atau Blender** | Sudah punya model mobil cantik | Lebih sulit |

### Jalur A: duplikat TestCar (disarankan)

1. Di Command Bar, tempel isi file `SetupTestScene.lua` lalu Enter (cukup sekali; ini membuat `TestCar`).
2. Di Explorer buka **ReplicatedStorage, VehicleTemplates**, klik `TestCar`, tekan **Ctrl+D**, ganti nama hasilnya menjadi nama mobil Anda, mis. `MobilKu`.
3. **Seret** `MobilKu` ke **Workspace** supaya terlihat di layar.
4. Ubah tampilannya: ganti warna, ubah ukuran, tambahkan part hiasan. **Jangan mengganti nama dan jangan menghapus** part ini: `Body`, `WheelFL`, `WheelFR`, `WheelRL`, `WheelRR`, `VehicleSeat`.
5. Lanjut ke **Bagian 5** (periksa).

### Jalur B: buat dari nol

Buat part-part berikut. Cara membuat part: tab **Home**, tombol **Part** (panah kecil di sampingnya untuk memilih bentuk), lalu isi **Size**, **Position**, dan **Name** di Properties.

| Name | Bentuk | Size (X, Y, Z) | Position (X, Y, Z) |
| :--- | :----- | :------------- | :----------------- |
| `Body` | Block | 6, 1, 12 | 0, 2.2, 0 |
| `WheelFL` | **Cylinder** | 0.8, 2.4, 2.4 | -3.4, 1.2, -4 |
| `WheelFR` | **Cylinder** | 0.8, 2.4, 2.4 | 3.4, 1.2, -4 |
| `WheelRL` | **Cylinder** | 0.8, 2.4, 2.4 | -3.4, 1.2, 4 |
| `WheelRR` | **Cylinder** | 0.8, 2.4, 2.4 | 3.4, 1.2, 4 |
| `VehicleSeat` | Insert Object, pilih **VehicleSeat** | 2, 1, 2 | 0, 2.9, 1 |

Langkah:

1. Buat semua part di atas. Pastikan **Orientation = 0, 0, 0** untuk semuanya.
2. Pilih semua part, tekan **Ctrl+G**, ganti nama Model menjadi nama mobil Anda.
3. Tidak perlu weld dan tidak perlu mengubah Anchored. Sistem mengurusnya otomatis.
4. Lanjut ke **Bagian 5**.

{: .box-note}
Roda berbentuk Cylinder dengan Size X = 0,8 artinya **lebar ban 0,8** dan **diameter 2,4**. Angka yang paling kecil pada Size adalah arah **as roda**.

### Jalur C: model dari Toolbox atau Blender

1. **Hapus semua Script dan LocalScript** di dalam model (script bawaan akan mengganggu).
2. Pastikan hanya ada **satu VehicleSeat**. Kursi lain ganti menjadi Seat biasa atau hapus.
3. **Pisahkan roda** menjadi part (atau Model) tersendiri, satu per roda, lalu beri nama `WheelFL`, `WheelFR`, `WheelRL`, `WheelRR`.
4. Titik tengah (pivot) roda harus di **pusat roda**. Bila roda berupa Model dan pivotnya melenceng, pilih Model roda itu lalu jalankan di Command Bar:

```lua
local m = game:GetService("Selection"):Get()[1]
local cf = m:GetBoundingBox()
m.WorldPivot = cf
```

5. Buat satu part chassis besar bernama `Body` (boleh transparan) sebagai akar mobil, lalu pastikan seluruh bodi mobil menghadap -Z.
6. Semua roda harus **menghadap arah yang sama** (jangan diputar 180 derajat untuk sisi kiri).
7. Bila as roda bukan sumbu X, lihat Bagian 6 (WheelSpinAxis).

## 3. Aturan hiasan (lampu, kaca, bemper, dll.)

- Part hiasan **boleh ditambahkan di dalam Model** dengan nama bebas. Sistem akan me-weld-nya ke `Body` otomatis.
- Untuk part kecil yang tidak perlu menabrak (kaca, lampu, interior), **matikan CanCollide**. Hanya bodi utama dan bemper yang sebaiknya CanCollide menyala.
- **Jangan** menaruh Script di dalam model.
- Jarak bodi ke tanah sebaiknya **0,6 sampai 2 stud**. Terlalu rendah membuat bodi menggesek tanah.

## 4. Pintu dan setir (opsional)

### Setir

Buat part bernama **`SteeringWheel`** di depan kursi. Setir akan berputar mengikuti belokan. Bila berputar seperti kincir (sumbu salah), lihat Bagian 6.

### Pintu

1. Buat part pintu (mis. Size 0.3, 2, 4) di sisi bodi, beri nama `DoorL` dan `DoorR`. **Jangan di-weld manual.**
2. Di dalam model, buat **ModuleScript** bernama `VehicleSettings` dan isi dengan:

```lua
return {
	Parts = {
		Doors = {
			{ Part = "DoorL", Hinge = "Front", OpenAngle = 65 },
			{ Part = "DoorR", Hinge = "Front", OpenAngle = 65 },
		},
	},
}
```

3. Di game, dekati pintu lalu tekan **E**. Bila pintu membuka ke arah yang salah, tambahkan `Invert = true` pada pintu itu.

{: .box-note}
Bila nama part Anda sama persis dengan panduan ini, Anda **tidak perlu** `VehicleSettings` sama sekali (kecuali untuk pintu, atau bila ingin mengatur karakter mobil).

## 5. Periksa otomatis dengan CekMobil

1. Klik **Model** mobil di Explorer.
2. Di Command Bar, tempel isi file `CekMobil.lua`, tekan Enter.
3. Buka **Output** dan baca:
   - ✅ sudah benar
   - ⚠️ peringatan, sebaiknya diperbaiki
   - ❌ masalah, mobil **tidak akan jalan** sebelum diperbaiki
4. Perbaiki lalu jalankan lagi sampai tidak ada tanda silang.

CekMobil memeriksa: nama part, arah depan, kiri dan kanan, tinggi roda, jarak bodi ke tanah, jumlah kursi, serta script yang tertinggal.

## 6. Bila roda atau setir berputar salah

Lihat angka **Size** pada roda. **Angka paling kecil** adalah as roda.

| Angka Size paling kecil | Tambahkan di VehicleSettings |
| :---------------------- | :--------------------------- |
| X (bawaan) | tidak perlu apa-apa |
| Y | `WheelSpinAxis = Vector3.new(0, 1, 0)` |
| Z | `WheelSpinAxis = Vector3.new(0, 0, 1)` |

Contoh isi `VehicleSettings`:

```lua
return {
	WheelSpinAxis = Vector3.new(0, 0, 1),
	WheelSpinDirection = 1,          -- ganti -1 bila roda berputar mundur saat maju
	SteeringWheelAxis = Vector3.new(0, 0, 1),
	SteeringWheelDirection = 1,      -- ganti -1 bila setir berputar terbalik
}
```

Bila nama part berbeda dari panduan, daftarkan seperti ini (hanya yang berbeda):

```lua
return {
	Parts = {
		Body = "Chassis",
		SteeringWheel = "Setir",
		Wheels = {
			FL = { Part = "RodaDepanKiri",     Steer = true,  Drive = false, Brake = true, Handbrake = false },
			FR = { Part = "RodaDepanKanan",    Steer = true,  Drive = false, Brake = true, Handbrake = false },
			RL = { Part = "RodaBelakangKiri",  Steer = false, Drive = true,  Brake = true, Handbrake = true },
			RR = { Part = "RodaBelakangKanan", Steer = false, Drive = true,  Brake = true, Handbrake = true },
		},
	},
}
```

## 7. Masukkan ke game

1. **Pindahkan** Model mobil dari Workspace ke **ReplicatedStorage, VehicleTemplates**. Jangan tinggalkan di Workspace.
2. Buka script **SpawnCatalog** (ReplicatedStorage, OSS). Tambahkan satu baris di dalam `Catalog.Vehicles`:

```lua
{ Id = "MobilKu", Name = "Mobil Ku", Category = "Sedan", Template = "MobilKu" },
```

| Kolom | Isi |
| :---- | :-- |
| `Id` | Nama unik, tanpa spasi |
| `Name` | Nama yang tampil di kartu |
| `Category` | Salah satu dari daftar `Catalog.Categories` (mis. Sedan, SUV, Sport) |
| `Template` | **Sama persis** dengan nama Model di VehicleTemplates |

Kolom tambahan (opsional):

| Kolom | Fungsi |
| :---- | :----- |
| `New = true` | Badge **New!** |
| `Gamepass = 123456789` | Mobil berbayar (isi ID gamepass) |
| `Bundle = "F1"` | Masuk bundle gamepass |
| `UnlockKm = 5` | Terbuka setelah total jarak tempuh mencapai 5 km |

## 8. Tes mobil

**Cara cepat (tanpa spawner):**

1. Letakkan model **sementara** di **Workspace, Vehicles**.
2. Tekan **Play (F5)** (bukan Run), pilih lokasi lalu Deploy.
3. Jalan ke mobil dan duduk di kursinya. Kendalikan dengan **W, A, S, D**.
4. Setelah selesai tes, ingat memindahkan model ke VehicleTemplates.

**Cara normal:** daftarkan di SpawnCatalog (Bagian 7), Play, tekan **E** di spawner, pilih mobilnya.

## 9. Mengatur karakter mobil

Tulis di `VehicleSettings` **hanya** yang ingin diubah. Pilih salah satu resep lalu salin:

**Mobil kota biasa**

```lua
return { Mass = 1300, MaxSpeed = 180, Engine = { PeakTorque = 180 }, Fuel = { Capacity = 50 },
	Sound = { Preset = "Sedan" } }
```

**Mobil sport**

```lua
return { Mass = 1250, MaxSpeed = 250, BlowSpeed = 310, Engine = { PeakTorque = 310, RedlineRPM = 7800 },
	Tires = { Grip = 1.6 }, Suspension = { Sag = 0.35 }, Fuel = { Capacity = 60 },
	Sound = { Preset = "Supercar" } }
```

**Truk atau SUV berat**

```lua
return { Mass = 2800, MaxSpeed = 130, BlowSpeed = 170, Engine = { PeakTorque = 420 },
	Tires = { Grip = 1.3 }, Suspension = { Sag = 0.5 }, Fuel = { Capacity = 90 },
	Sound = { Preset = "Truck" } }
```

**Mobil drift**

```lua
return { Mass = 1200, MaxSpeed = 200, Engine = { PeakTorque = 260 }, Tires = { GripRear = 0.9 },
	Drift = { HandbrakeGrip = 0.5 }, Sound = { Preset = "Rally" } }
```

{: .box-note}
**Rumus torsi:** `PeakTorque` sekitar **Massa x 0,14** untuk mobil biasa, **x 0,22** untuk mobil sport. Contoh: 1300 kg menjadi sekitar 180.

Preset suara yang tersedia: `Sedan`, `Hybrid`, `MuscleV8`, `Supercar`, `F1`, `Truck`, `Rally`.

## 10. Masalah umum dan solusinya

Selalu cek **Output** dan cari pesan berawalan `[OSS]`.

| Gejala atau pesan | Penyebab | Solusi |
| :---------------- | :------- | :----- |
| `[OSS] Body 'Body' not found` | Tidak ada part bernama `Body` | Buat atau ganti nama part chassis |
| `needs a VehicleSeat as the driver seat` | Tidak ada VehicleSeat | Tambahkan tepat satu VehicleSeat |
| `Roda 'WheelFL' (FL) not found` | Nama roda salah | Samakan nama atau daftarkan di VehicleSettings |
| `Door not found` | Nama pintu di Settings tidak ada | Samakan nama part pintu |
| Mobil tidak muncul di spawner | Nama `Template` beda dengan nama model | Samakan persis |
| Mobil menghadap terbalik | Depan bodi bukan -Z | Putar model, atau `Forward = Vector3.new(0, 0, 1)` |
| Mobil tenggelam atau melayang | Roda tidak menyentuh tanah | Samakan tinggi keempat roda |
| Salah satu roda berputar mundur | Orientation roda tidak sama | Samakan Orientation semua roda |
| Roda berputar seperti kincir | Sumbu roda salah | Lihat Bagian 6 |
| Mobil terlalu licin | Grip kurang | `Tires = { Grip = 1.6 }` |
| Mobil sulit belok | Grip terlalu besar | Turunkan `Tires.Grip` |
| Terlalu lambat | Torsi kecil | Naikkan `Engine.PeakTorque` |
| Pintu membuka ke arah salah | Arah engsel | Tambah `Invert = true` |
| Bodi menggesek tanah | Bodi terlalu rendah | Naikkan bodi atau perbesar roda |
| Setir berputar terbalik | Arah putar | `SteeringWheelDirection = -1` |

## 11. Checklist akhir

- [ ] Depan mobil menghadap **-Z**, semua Orientation = 0, 0, 0
- [ ] Ada `Body`, 4 roda (`WheelFL`, `WheelFR`, `WheelRL`, `WheelRR`), tepat 1 `VehicleSeat`
- [ ] Keempat roda sejajar dan menyentuh tanah (Y = 0)
- [ ] Tidak ada Script di dalam model
- [ ] CekMobil: **0 masalah**
- [ ] Model berada di `ReplicatedStorage, VehicleTemplates`
- [ ] Sudah didaftarkan di `SpawnCatalog` (`Template` sama persis dengan nama model)
- [ ] Sudah dites: jalan lurus, belok, rem, handbrake, keluar dan masuk lagi

{: .box-success}
Bila macet, kirim ke pengembang: **hasil CekMobil**, **pesan `[OSS]` di Output**, dan **tangkapan layar Explorer** model Anda.
