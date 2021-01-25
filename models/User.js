const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minLength: 3 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: String
})

const User = mongoose.model('User', userSchema)

module.exports = User