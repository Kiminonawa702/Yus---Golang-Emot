const maxTime = 5 * 60 * 1000; // 5 menit
const { Boom } = require('@hapi/boom');
const fs = require('fs');

async function handleStatusUpdate(client, m) {
  if (m.key && !m.key.fromMe) {
    if (!m.message.reactionMessage) {
      const allowedSenders = [
        "6281447345627@s.whatsapp.net",
        "628145563553@s.whatsapp.net",
      ];

      if (!allowedSenders.includes(m.key.participant)) {
        const currentTime = Date.now();
        const messageTime = m.messageTimestamp * 1000;
        const timeDiff = currentTime - messageTime;

        if (timeDiff <= maxTime) {
          const emojis = [
            "🔥", "✨", "🤖", "🌟", "🌞", "🎉", "🎊", "😺"
          ];

          function getRandomEmoji() {
            const randomIndex = Math.floor(Math.random() * emojis.length);
            return emojis[randomIndex];
          }

          const randomEmoji = getRandomEmoji();
          try {
            if (m.key.id && m.key.participant) {
              await client.sendMessage("status@broadcast", {
                react: { text: randomEmoji, key: m.key },
              }, { statusJidList: [m.key.participant] });

              await client.readMessages([m.key]);

              // Periksa apakah status masih ada sebelum menampilkan pesan
              const statusCheck = await client.fetchStatus(m.key.remoteJid);
              if (statusCheck && statusCheck.status !== 'deleted') {
                console.log(`Berhasil melihat status dari ${m.pushName}`);
                viewCount++;
                saveCounts();
              }
            }
          } catch (error) {
            if (error instanceof Boom && error.output.statusCode === 410) {
              // Status telah dihapus, tidak menampilkan pesan
              console.log(`Status telah dihapus, tidak menampilkan pesan`);
            } else {
              console.error('Error', error);
            }
          }
        }
      }
    }
  }
}

// Fungsi untuk menyimpan dan memuat jumlah melihat status dan jumlah total restart bot
function saveCounts() {
  fs.writeFileSync('counts.json', JSON.stringify({ viewCount, restartCount }));
}

module.exports = { handleStatusUpdate };
