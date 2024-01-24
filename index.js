// Impor modul telegraf dan fs
const { Telegraf } = require('telegraf')
const fs = require('fs')

// Baca file config.json dan simpan dalam variabel config
const config = JSON.parse(fs.readFileSync('config.json'))

// Akses nilai-nilai dari config
const bot_token = config.bot_token
const start_image = config.start_image

// Buat instance bot dengan token Anda
const bot = new Telegraf(bot_token)

// Tambahkan fungsi untuk mengirim pesan sambutan dengan gambar yang ada di config dan button untuk setiap kategori
bot.start((ctx) => {
  // Kirim gambar dari config
  ctx.replyWithPhoto(start_image, {
    // Tambahkan caption
    caption: 'Welcome to my bot!',
    // Tambahkan button gambar
    reply_markup: {
      inline_keyboard: [
        // Button kiri
        [{ text: 'Anime', callback_data: 'anime' }],
        // Button kanan
        [{ text: 'Binatang', callback_data: 'binatang' }],
        // Button bawah
        [{ text: 'Meme', callback_data: 'meme' }]
      ]
    }
  })
})

// Tambahkan fungsi untuk menangani callback query dengan mengirim gambar acak dari kategori yang dipilih
bot.on('callback_query', (ctx) => {
  // Dapatkan kategori dari data callback
  let kategori = ctx.callbackQuery.data
  // Dapatkan url json dari config
  let url_json = config[kategori]
  // Kirim permintaan HTTP ke url json
  axios.get(url_json)
    .then(res => {
      // Dapatkan array gambar dari respon
      let gambar = res.data
      // Pilih gambar acak dari array
      let gambar_acak = gambar[Math.floor(Math.random() * gambar.length)]
      // Kirim gambar ke pengguna
      ctx.replyWithPhoto(gambar_acak)
    })
    .catch(err => {
      // Kirim pesan kesalahan jika ada
      ctx.reply('Maaf, terjadi kesalahan: ' + err.message)
    })
})

// Jalankan bot
bot.launch()
