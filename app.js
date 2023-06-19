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

    const syncState = () => {
        history.forEach((line) => io.emit('draw', line))
    }
    syncState()

    socket.on('clear', () => {
        history = []
        io.emit('draw')
    })
    socket.on('draw', (line) => {
        line.owner = socket.id
        history.push(line)
        io.emit('draw', line)
    })
    socket.on('undoLast', () => {
        if(history[history.length -1]?.actionId > 0){
            const lastItemId = history[history.length-1].actionId
            io.emit('draw')
            history = history.filter((item) => (item.owner != socket.id || item.actionId < lastItemId))
            syncState()
        }   
        
    })
} )

// const desiredId = 2
// const novaLista = lista.filter((item) => item.actionId <= 2)

http.listen(3000, () => {
    console.log("conectado na porta 3000")
})
