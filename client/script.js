const socket = io.connect()

document.addEventListener('DOMContentLoaded', () => {
    const pencil = {
        active: false,
        move: false,
        posCurrent: {x:0, y:0},
        posAfter: null,
        actionId: 0
    }

    const canvas = document.getElementById("board")
    canvas.width = 1000
    canvas.height = 600


    const context = canvas.getContext('2d')
    context.lineWidth = 3
    context.strokeStyle = 'teal'

    const drawLine = (line) => {
        if(line){
            context.beginPath()
            context.moveTo(line.posAfter.x, line.posAfter.y)
            context.lineTo(line.posCurrent.x, line.posCurrent.y)
            context.stroke()
        }
        else {
            context.clearRect(0, 0, canvas.width, canvas.height)
            pencil.actionId = 0
        }
    }

    canvas.onmousedown = () => {
        pencil.actionId += 1
        pencil.active = true
    }
    canvas.onmouseup = () => {
        pencil.active = false
    }
    canvas.onmousemove = (event) => {
        const canvasRect = canvas.getBoundingClientRect();
        pencil.posCurrent.x = event.clientX - canvasRect.left;
        pencil.posCurrent.y = event.clientY - canvasRect.top;
        pencil.move = true
    }

    socket.on('draw', (line) => {
        drawLine(line)
    })

    const draw_cycle = () => {
        if (pencil.active && pencil.move && pencil.posAfter){
          socket.emit('draw', {posCurrent: pencil.posCurrent, posAfter: pencil.posAfter, actionId: pencil.actionId })
          pencil.move = false
        }
        pencil.posAfter = { x: pencil.posCurrent.x, y: pencil.posCurrent.y}
    
        setTimeout(draw_cycle, 10)
      }
    
    draw_cycle()    
})

const handleClear = () => {
    socket.emit('clear')
}

const handleUndoLast = () => {
    socket.emit('undoLast')
  };