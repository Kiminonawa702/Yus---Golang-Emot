// config.js

const config = {
  // ---------------------------------------------------------------------
  // Fitur autoRecord dihidupkan
  // Mengaktifkan atau menonaktifkan fitur perekaman otomatis.
  // Jika diatur ke true, bot akan otomatis merekam pesan.
  autoRecord: false,
  // ---------------------------------------------------------------------
  // Fitur autoTyping dihidupkan
  // Mengaktifkan atau menonaktifkan fitur mengetik otomatis.
  // Jika diatur ke true, bot akan menunjukkan status mengetik.
  autoTyping: true,
  // ---------------------------------------------------------------------
  // Durasi auto record dalam milidetik (60 detik)
  // Menentukan durasi perekaman otomatis dalam milidetik.
  recordDuration: 60000,
  // ---------------------------------------------------------------------
  // Batas waktu maksimal dalam milidetik (1 detik)
  // Menentukan batas waktu maksimal untuk operasi tertentu dalam milidetik.
  maxTime: 1000,
  // ---------------------------------------------------------------------
  // Set to true to send blue ticks (read receipts), false to disable
  // Mengaktifkan atau menonaktifkan pengiriman tanda centang biru (tanda terima baca).
  sendReadReceipt: false, // Diatur ke true untuk mengaktifkan fitur ini
  // ---------------------------------------------------------------------
  // Durasi auto typing dalam milidetik (60 detik)
  // Menentukan durasi mengetik otomatis dalam milidetik.
  typingDuration: 60000,
  // ---------------------------------------------------------------------
  // URL gambar untuk bio dalam bentuk array
  // Daftar URL gambar yang digunakan untuk memperbarui bio WhatsApp.
  bioImageUrls: [
    "https://files.catbox.moe/wdmwak.jpg",
    "https://files.catbox.moe/1vvl3c.jpg",
    "https://files.catbox.moe/azbrp4.jpg",
    "https://files.catbox.moe/zrezka.jpg",
    "https://files.catbox.moe/iemyvc.png"
  ],
  // ---------------------------------------------------------------------
  // Fitur autoOnline dihidupkan
  // Mengaktifkan atau menonaktifkan fitur auto online.
  // Jika diatur ke true, bot akan otomatis menampilkan status online.
  autoOnline: true,
  // ---------------------------------------------------------------------
  // Fitur uptimeBot dihidupkan
  // Mengaktifkan atau menonaktifkan fitur uptime bot.
  // Jika diatur ke true, bot akan mencatat dan menampilkan waktu berjalan.
  enableUptime: false,
  // ---------------------------------------------------------------------
  // Fitur selamat datang dihidupkan
  // Mengaktifkan atau menonaktifkan fitur selamat datang.
  enableWelcome: false,
  // ---------------------------------------------------------------------
  // Fitur selamat tinggal dihidupkan
  // Mengaktifkan atau menonaktifkan fitur selamat tinggal.
  enableGoodbye: false,
  // ---------------------------------------------------------------------
  // Fitur perubahan info grup dihidupkan
  // Mengaktifkan atau menonaktifkan fitur perubahan info grup.
  enableGroupInfoChange: false,
  // ---------------------------------------------------------------------
  // Fitur perubahan nama grup dihidupkan
  // Mengaktifkan atau menonaktifkan fitur perubahan nama grup.
  enableGroupNameChange: false,
  // ---------------------------------------------------------------------
  // Fitur pembaruan dependensi dihidupkan
  // Mengaktifkan atau menonaktifkan fitur pembaruan dependensi.
  enableDependencyUpdate: false,
  // ---------------------------------------------------------------------
  // Fitur penanganan uncaughtException dihidupkan
  // Mengaktifkan atau menonaktifkan penanganan uncaughtException.
  // Jika diatur ke true, bot akan menangani uncaughtException dan terus berjalan.
  enableUncaughtExceptionHandling: true,
  // ---------------------------------------------------------------------
  // Fitur pemberitahuan perubahan status admin dihidupkan
  // Mengaktifkan atau menonaktifkan fitur pemberitahuan perubahan status admin.
  enableAdminStatusChangeNotification: false,
  // ---------------------------------------------------------------------
  // Fitur autoFixError dihidupkan
  // Mengaktifkan atau menonaktifkan fitur perbaikan error otomatis.
  enableAutoFixError: false,
  // ---------------------------------------------------------------------
};

module.exports = config;
