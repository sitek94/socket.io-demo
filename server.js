import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import {join, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {Low} from 'lowdb'
import {JSONFile} from 'lowdb/node'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

const adapter = new JSONFile(file)
const defaultData = {messages: []}
const db = new Low(adapter, defaultData)

await db.read()

const app = express()
const server = createServer(app)
const io = new Server(server)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
  console.log('user connected')

  socket.on('message', message => {
    const {user, text} = message
    console.log(`${user}: ${text}`)

    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')

    socket.broadcast.emit('message', {
      user: 'server',
      text: 'user disconnected',
    })
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
