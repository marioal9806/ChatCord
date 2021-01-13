const mongoose = require('mongoose')

const botSchema = new mongoose.Schema({
  name: { type: String, required: true },
  base64: { type: String, required: true },
})

const Bot = mongoose.model('Bot', botSchema)

module.exports = Bot