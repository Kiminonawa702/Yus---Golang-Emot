const axios = require('axios');
const fs = require('fs');
const config = require('./config'); // Impor konfigurasi

// Fungsi untuk menyimpan dan memuat jumlah melihat status dan jumlah total restart bot
function saveCounts(viewCount, restartCount) {
  fs.writeFileSync('counts.json', JSON.stringify({ viewCount, restartCount }));
}

function loadCounts() {
  if (fs.existsSync('counts.json')) {
    const data = fs.readFileSync('counts.json');
    const { viewCount, restartCount } = JSON.parse(data);
    return { viewCount, restartCount };
  }
  return { viewCount: 0, restartCount: 0 };
}

function getFormattedDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return now.toLocaleDateString('id-ID', options);
}

function getTimeUntil(targetDate) {
  const now = new Date();
  const diff = targetDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days;
}

function getRandomBioImageUrl() {
  const urls = config.bioImageUrls;
  const randomIndex = Math.floor(Math.random() * urls.length);
  return urls[randomIndex];
}

function buildFeatureMessage(config) {
  const activeFeatures = [];
  const inactiveFeatures = [];

  Object.entries(config)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .forEach(([key, value]) => {
      const featureString = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value ? 'Aktif ✅' : 'Tidak Aktif ❌'}`;
      if (typeof value === 'boolean') {
        if (value) {
          activeFeatures.push(`- ${featureString}`);
        } else {
          inactiveFeatures.push(`- ${featureString}`);
        }
      } else {
        activeFeatures.push(`- ${featureString}`);
      }
    });

  return `Fitur Aktif:\n${activeFeatures.join('\n')}\n────────────────────────────\nFitur Tidak Aktif:\n${inactiveFeatures.join('\n')}`;
}

async function sendNotification(client, viewCount, restartCount) {
  const notificationNumber = "6289688206739@s.whatsapp.net";

  const formattedDate = getFormattedDate();

  const nextRamadhan = new Date('2025-03-29');
  const nextNewYear = new Date(new Date().getFullYear() + 1, 0, 1);

  const daysUntilRamadhan = getTimeUntil(nextRamadhan);
  const daysUntilNewYear = getTimeUntil(nextNewYear);

  const randomBioImageUrl = getRandomBioImageUrl();

  const featureMessage = buildFeatureMessage(config);
  const textMessage = `
────────────────────────────
Bot berhasil terhubung dan berjalan. 🤖
${formattedDate}
────────────────────────────
Berikut adalah daftar fitur:
${featureMessage}
────────────────────────────
Hari menuju Ramadhan: ${daysUntilRamadhan} hari 🌙
Hari menuju Tahun Baru: ${daysUntilNewYear} hari 🎉
────────────────────────────
Jumlah melihat status orang: ${viewCount} kali 👀
Jumlah total restart bot: ${restartCount} kali 🔄
────────────────────────────
  `;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await axios.get(randomBioImageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');

      await client.sendMessage(notificationNumber, {
        image: imageBuffer,
        caption: textMessage
      });

      console.log("Notifikasi berhasil dikirim ke nomor 6289688206739");
      break;
    } catch (err) {
      attempts++;
      console.error('Error sending notification:', err);
    }
  }
}

module.exports = { saveCounts, loadCounts, sendNotification };
