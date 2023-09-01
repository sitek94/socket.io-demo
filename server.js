import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import path from 'path'
import {fileURLToPath} from 'url'
import {dirname} from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
})

io.on('connection', socket => {
  console.log('New user connected')

  socket.on('send_message', message => {
    io.emit('receive_message', message)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
