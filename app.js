const express = require('express')
const Server = require('socket.io').Server

const app = express()
const http = require('http').createServer(app)

app.use(express.static(__dirname + '/client'))

const corsOptions = ({
    cors: {
        origin: "localhost"
    }
})

const io = new Server(http, corsOptions)

let history = []

io.on("connection", (socket) => {

    history.forEach((line) => socket.emit('draw', line))

    socket.on('clear', () => {
        history = []
        io.emit('draw')
    })
    socket.on('draw', (line) => {
        history.push(line)
        io.emit('draw', line)
        console.log(line)
    })
} )


http.listen(3000, () => {
    console.log("conectado na porta 3000")
})