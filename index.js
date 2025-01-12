// index.js

const fs = require('fs');
const cfonts = require('cfonts'); // Impor cfonts
const readlineSync = require('readline-sync'); // Impor readline-sync untuk input pengguna
const { handleStatusUpdate } = require('./emoji'); // Impor handleStatusUpdate dari emoji.js
const config = require('./config'); // Impor konfigurasi
const { autoTyping, autoRecord, sendReadReceipt, sendWelcomeGoodbyeMessage, handleGroupInfoChange, handleAdminStatusChange } = require('./fitur'); // Impor fungsi dari fitur.js
const { execSync } = require('child_process'); // Impor child_process untuk menjalankan perintah npm
const { saveCounts, loadCounts, sendNotification } = require('./notifpesantersambung'); // Impor fungsi dari notifpesantersambung.js
const axios = require('axios'); // Impor axios untuk mengirim pesan kesalahan

let { viewCount, restartCount } = loadCounts();

// Fungsi untuk membuat garis panjang dengan warna acak
async function coloredLine(character, length) {
  const { default: chalk } = await import('chalk'); // Impor chalk secara dinamis
  const colors = [chalk.red, chalk.green, chalk.blue, chalk.yellow, chalk.magenta, chalk.cyan];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return randomColor(character.repeat(length));
}

// Fungsi untuk memeriksa dan memperbarui dependensi
async function updateDependencies() {
  if (config.enableDependencyUpdate) {
    try {
      console.log(await coloredLine('=', 50));
      console.log('🔍 Memeriksa dan memperbarui dependensi...');
      console.log(await coloredLine('=', 50));
      execSync('npx npm-check-updates -u', { stdio: 'inherit' });
      execSync('npm install', { stdio: 'inherit' });
      console.log(await coloredLine('=', 50));
      console.log('✅ Dependensi berhasil diperbarui.');
      console.log(await coloredLine('=', 50));
    } catch (error) {
      console.error('❌ Gagal memperbarui dependensi:', error);
    }
  }
}

// Fungsi untuk menyimpan dan memuat waktu mulai bot
function saveUptime(startTime) {
  fs.writeFileSync('uptime.json', JSON.stringify({ startTime }));
}

function loadUptime() {
  if (fs.existsSync('uptime.json')) {
    const data = fs.readFileSync('uptime.json');
    const { startTime } = JSON.parse(data);
    return new Date(startTime);
  }
  return new Date();
}

// Fungsi untuk menghitung uptime bot
function getUptime(startTime) {
  const now = new Date();
  const diff = now - startTime;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${days} hari 🌞, ${hours} jam ⏰, ${minutes} menit ⏳, ${seconds} detik ⏱️`;
}

// Fungsi untuk menampilkan status online
function autoOnline(client) {
  if (config.autoOnline) {
    setInterval(async () => {
      try {
        await client.sendPresenceUpdate('available');
      } catch (error) {
        console.error("Error terjadi:", error);
      }
    }, 30000);
  }
}

// Tampilkan teks menggunakan cfonts saat bot dimulai
cfonts.say('auto-read-sw\nby-wily-kun', {
  font: 'tiny',
  align: 'center',
  colors: ['system'],
  background: 'transparent',
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: '0',
  gradient: false,
  independentGradient: false,
  transitionGradient: false,
  env: 'node'
});

// Fungsi untuk meminta username dan password
function promptCredentials() {
  const username = readlineSync.question('Username: ');
  const password = readlineSync.question('Password: ', { hideEchoBack: true });
  return { username, password };
}

// Fungsi untuk memeriksa kredensial
function checkCredentials(username, password) {
  return username === 'wily' && password === 'wily';
}

// Fungsi untuk menyimpan status login
function saveLoginStatus(isLoggedIn) {
  fs.writeFileSync('login_status.json', JSON.stringify({ isLoggedIn }));
}

// Fungsi untuk memuat status login
function loadLoginStatus() {
  if (fs.existsSync('login_status.json')) {
    const data = fs.readFileSync('login_status.json');
    const { isLoggedIn } = JSON.parse(data);
    return isLoggedIn;
  }
  return false;
}

// Fungsi utama untuk memulai bot
async function main() {
  // Memeriksa dan memperbarui dependensi
  await updateDependencies();

  // Memeriksa apakah sudah login sebelumnya
  let isLoggedIn = loadLoginStatus();

  if (!isLoggedIn) {
    console.log(await coloredLine('=', 50));
    console.log('Silakan masukkan username dan password untuk melanjutkan:');
    console.log(await coloredLine('=', 50));

    const { username, password } = promptCredentials();

    if (checkCredentials(username, password)) {
      const chalk = (await import('chalk')).default;
      console.log(chalk.green('Login berhasil!'));
      isLoggedIn = true;  // Menyimpan status login
      saveLoginStatus(isLoggedIn); // Simpan status login ke file
    } else {
      const chalk = (await import('chalk')).default;
      console.log(chalk.red('Username atau password salah!'));
      process.exit(1); // Keluar dari proses jika login gagal
    }
  }

  const {
    default: WAConnect,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    Browsers,
    fetchLatestWaWebVersion
  } = require("@whiskeysockets/baileys");
  const pino = require("pino");
  const readline = require('readline');
  const { Boom } = require("@hapi/boom");

  const pairingCode = process.argv.includes("--pairing-code");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (text) => new Promise((resolve) => rl.question(text, resolve));
  const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

  async function WAStart() {
    const { state, saveCreds } = await useMultiFileAuthState("./sesi");
    const { version, isLatest } = await fetchLatestWaWebVersion().catch(() => fetchLatestBaileysVersion());
    console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

    const client = WAConnect({
      logger: pino({ level: "silent" }),
      printQRInTerminal: !pairingCode,
      browser: Browsers.ubuntu("Chrome"),
      auth: state,
    });

    store.bind(client.ev);

    if (pairingCode && !client.authState.creds.registered) {
      const phoneNumber = await question(`Silahkan masukin nomor Whatsapp kamu: `);
      let code = await client.requestPairingCode(phoneNumber);
      code = code?.match(/.{1,4}/g)?.join("-") || code;
      console.log(`⚠︎ Kode Whatsapp kamu : ` + code)
    }

    client.ev.on("messages.upsert", async (chatUpdate) => {
      try {
        const m = chatUpdate.messages[0];
        if (!m.message) return;

        const maxTime = config.maxTime;

        if (m.key && !m.key.fromMe && m.message.protocolMessage?.type !== 2) { // 2 is the protocol message type for status delete
          await autoTyping(client, m);
          await autoRecord(client, m);
          await sendReadReceipt(client, m);
          await handleStatusUpdate(client, m);
          viewCount++;
          saveCounts(viewCount, restartCount);
        }
      } catch (err) {
        console.error("Error terjadi:", err);
      }
    });

    client.ev.on('group-participants.update', async (update) => {
      const { id, participants, action } = update;
      for (const participant of participants) {
        await sendWelcomeGoodbyeMessage(client, id, participant, action);
      }
    });

    client.ev.on('groups.update', async (update) => {
      for (const groupUpdate of update) {
        await handleGroupInfoChange(client, groupUpdate);
      }
    });

    client.ev.on('group-participants.update', async (update) => {
      await handleAdminStatusChange(client, update);
    });

    client.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        restartCount++;
        saveCounts(viewCount, restartCount);
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (reason === DisconnectReason.badSession) {
          console.log(`Bad Session File, Please Delete Session and Scan Again`);
          process.exit();
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log("Connection closed, reconnecting....");
          WAStart();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log("Connection Lost from Server, reconnecting...");
          WAStart();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
          process.exit();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(`Device Logged Out, Please Delete Folder Session and Scan Again.`);
          process.exit();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log("Restart Required, Restarting...");
          WAStart();
        } else if (reason === DisconnectReason.timedOut) {
          console.log("Connection TimedOut, Reconnecting...");
          WAStart();
        } else {
          console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
          WAStart();
        }
      } else if (connection === "open") {
        console.log("Connected to Readsw");

        // Tambahkan restartCount setiap kali bot tersambung kembali
        restartCount++;
        saveCounts(viewCount, restartCount);

        // Uptime Bot
        if (config.enableUptime) {
          const startTime = loadUptime();
          saveUptime(startTime); // Simpan waktu mulai bot
          setInterval(async () => {
            const uptime = getUptime(startTime);
            await client.updateProfileStatus(uptime); // Perbarui bio WhatsApp dengan uptime
          }, 60000); // Perbarui bio setiap 60 detik
        }

        await sendNotification(client, viewCount, restartCount);
        autoOnline(client);
      }
    });

    client.ev.on("creds.update", saveCreds);

    return client;
  }

  WAStart().catch((err) => {
    console.error("Error terjadi:", err);
  });
}

// Jalankan fungsi utama
main().catch((err) => {
  console.error("Error terjadi:", err);
});

// Fungsi untuk memperbaiki error secara otomatis
async function autoFixError(error) {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('module not found')) {
    const missingModule = errorMessage.match(/'([^']+)'/)[1];
    console.log(`🔍 Mencoba menginstal modul yang hilang: ${missingModule}`);
    try {
      execSync(`npm install ${missingModule}`, { stdio: 'inherit' });
      console.log(`✅ Modul ${missingModule} berhasil diinstal.`);
    } catch (installError) {
      console.error(`❌ Gagal menginstal modul ${missingModule}:`, installError);
    }
  } else {
    console.error('❌ Tidak dapat memperbaiki error secara otomatis:', error);
  }
}

// Tambahkan penanganan uncaughtException berdasarkan konfigurasi
if (config.enableUncaughtExceptionHandling) {
  const { default: WAConnect, Browsers, useMultiFileAuthState } = require("@whiskeysockets/baileys");
  const pino = require("pino");

  process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);

    try {
      if (config.enableAutoFixError) {
        await autoFixError(err); // Coba perbaiki error secara otomatis
      }

      const { state } = await useMultiFileAuthState("./sesi");
      const client = await WAConnect({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        browser: Browsers.ubuntu("Chrome"),
        auth: state,
      });

      await client.sendMessage('6289688206739@s.whatsapp.net', {
        text: err.message
      });

    } catch (sendError) {
      console.error('Failed to send error notification:', sendError);
    }
  });
}
