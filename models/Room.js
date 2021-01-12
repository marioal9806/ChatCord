const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true }
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room