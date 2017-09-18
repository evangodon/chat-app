const io = require('socket.io-client');
const client = io();

const canvas = {}
let isDrawing = false;
let x, y, prevX, prevY;

const drawLine = (ctx, x1, y1, x2, y2, colour) => {
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.strokeStyle = colour;
    ctx.stroke();
}

canvas.init = (colour) => {
    const $canvasHTML = $('#canvas');
    const canvas = $canvasHTML[0];
    const ctx = canvas.getContext('2d');
    console.log("Canvas initialized")

    canvas.height = $canvasHTML.innerHeight();
    canvas.width = $canvasHTML.innerWidth();


    canvas.onmousedown = () => {
        isDrawing = true;
        prevX = x;
        prevY = y;
    }
    canvas.onmouseup = () => {
        isDrawing = false;
    }

    canvas.onmouseleave = () => {
        window.onmouseup = () => {
            isDrawing = false;
        }
    }

    canvas.onmousemove = function(e) {
        x = e.offsetX;
        y = e.offsetY;
        if (isDrawing) {
            client.emit('draw', {
                x1: prevX,
                y1: prevY,
                x2: x,
                y2: y,
                colour
            });
            drawLine(ctx, prevX, prevY, x, y, colour);
            prevX = x;
            prevY = y;
        }
    }

    client.on('draw', function(data) {
        drawLine(ctx, data.x1, data.y1, data.x2, data.y2, data.colour);
    });
}

export default canvas;
