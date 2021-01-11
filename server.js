const path = require('path')
const http = require('http')

const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const morgan = require('morgan')
const session = require('express-session')
const helmet = require('helmet')

const generate = require('project-name-generator')

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

// Express Middleware
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(express.static(path.join(__dirname, NODE_ENV === 'production' ? 'build' : 'dist')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(NODE_ENV === 'production' ? morgan('common') : morgan('dev'))

app.use(session({
  secret: 'LN2ByYpc?G7l37&',
  name: 'sessionVv33QBzn',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: NODE_ENV === 'production' ? true : false 
  }
}))

const ROOMS = [
  { id: 'algo', name: 'Algorithms and Data Structures', description: 'Share your tips to prepare for technical interviews' },
  { id: 'web-dev', name: 'Web Development', description: 'Share your ideas and showcase your projects' },
  { id: 'mobile-dev', name: 'Mobile Development', description: 'Explore the trends in mobile development' },
  { id: 'ml', name: 'Machine Learning', description: 'Learn new techniques and models of AI and Machine Learning' },
]

// API Endpoints
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.get('/lobby', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'lobby.html'))
})

app.get('/room/:roomName', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'room.html'))
})

app.get('/api/rooms', (req, res) => {
  res.json({ rooms: ROOMS })
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

app.post('/join-room', (req, res) => {
  const { username, room: selectedRoom } = req.body
  req.session.username = username

  const roomExists = ROOMS.filter(room => {
    return room.id === selectedRoom.id
  })
  if(roomExists.length === 0) {
    res.status(404).json({ error: 'Room Not Found' })
  }
  else {
    res.status(200).json({ room: selectedRoom })
  }
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
    io.in(id).emit('message', { message: `${username} has joined the chat!`, username: 'ChatCord', self: false})
  })

  socket.on('message', (msg, room) => {
    console.log(`MESSAGE: Message "${msg.message}" sent to room "${room.id}" by "${msg.username}"`)
    socket.to(room.id).emit('message', { message: msg.message, username: msg.username, self: false })
  })

  socket.on('disconnect', () => {
    if(socket.room !== undefined) {
      console.log(`DISCONNECT: Socket "${socket.id}" has disconnected`)
      io.in(socket.room.id).emit('message', { message: `${socket.username} has left the chat!`, username: 'ChatCord', self: false})
    } else { 
      console.log(`DISCONNECT: An anonymous Socket has disconnected`)
    } 
  })
})


server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})