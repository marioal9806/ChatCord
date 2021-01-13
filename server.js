require('dotenv').config()

const path = require('path')
const http = require('http')

const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const helmet = require('helmet')

const generate = require('project-name-generator')

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'
const PUBLIC_PATH = process.env.NODE_ENV === 'production' ? 'build' : 'dist'

const Room = require('./models/Room')
const Bot = require('./models/Bot')

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connection to database successful'))
.catch(err => console.log(err));

let CHATBOT_AVATAR
Bot.findOne({ name: 'welcome-bot' })
  .then(bot => {
    CHATBOT_AVATAR = bot
  })

// Express Middleware
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(express.static(path.join(__dirname, PUBLIC_PATH)))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(NODE_ENV === 'production' ? morgan('common') : morgan('dev'))

app.use(session({
  secret: 'LN2ByYpc?G7l37&',
  name: 'sessionVv33QBzn',
  resave: false,
  saveUninitialized: false,
  rolling: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: false
  },
  store: new MongoStore({
    url: process.env.MONGO_URI,
    dbName: 'chatcord',
    collection: 'sessions'
  })
}))

// API Endpoints
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, PUBLIC_PATH, 'index.html'))
})

app.get('/lobby', (req, res) => {
  res.sendFile(path.join(__dirname, PUBLIC_PATH, 'lobby.html'))
})

app.get('/room/:roomName', (req, res) => {
  res.sendFile(path.join(__dirname, PUBLIC_PATH, 'room.html'))
})

app.get('/api/rooms', async (req, res) => {
  Room.find({})
    .then(rooms => {
      res.json({ rooms })
    })
    .catch(error => console.error(error))
})

app.get('/api/generate', (req, res) => {
  res.json({
    username: generate({ alliterative: true }).dashed
  })
})

app.get('/api/username', (req, res) => {
  if(req.session.username) {
    res.json({ username: req.session.username })
  }
  else {
    res.status(404).json({ error: 'Username Not Found' })
  }
})

app.get('/api/avatar', (req, res) => {
  if(req.session.avatar) {
    res.json({ avatar: req.session.avatar })
  }
  else {
    res.status(404).json({ error: 'Avatar Not Found' })
  }
})

app.post('/join-room', (req, res) => {
  const { username, room: selectedRoom, avatar } = req.body
  req.session.username = username
  req.session.avatar = avatar
  Room.find({})
    .then(rooms => {
      const roomExists = rooms.filter(room => {
        return room.id === selectedRoom.id
      })
      if(roomExists.length === 0) {
        res.status(404).json({ error: 'Room Not Found' })
      }
      else {
        res.status(200).json({ room: selectedRoom })
      }
    })
    .catch(error => console.error(error))
})


// Socket Server Events
io.on('connection', socket => {
  console.log(`CONNECTION: Socket "${socket.id}" has connected`)

  socket.on('join room', (room, username) => {
    const { id, name } = room
    socket.username = username
    socket.room = room
    socket.join(id)
    console.log(`JOIN ROOM: Socket "${socket.id}" has joined room "${id}"`)
    io.in(id).emit('message', { message: `${username} has joined the chat!`, username: 'ChatCord', self: false, avatar: CHATBOT_AVATAR.base64})
  })

  socket.on('message', (msg, room) => {
    console.log(`MESSAGE: Message "${msg.message}" sent to room "${room.id}" by "${msg.username}"`)
    socket.to(room.id).emit('message', { message: msg.message, username: msg.username, self: false, avatar: msg.avatar })
  })

  socket.on('disconnect', () => {
    if(socket.room !== undefined) {
      console.log(`DISCONNECT: Socket "${socket.id}" has disconnected`)
      io.in(socket.room.id).emit('message', { message: `${socket.username} has left the chat!`, username: 'ChatCord', self: false, avatar: CHATBOT_AVATAR.base64})
    } else { 
      console.log(`DISCONNECT: An anonymous Socket has disconnected`)
    } 
  })
})


server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})