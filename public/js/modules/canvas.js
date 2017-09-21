const io = require('socket.io-client');
const client = io();
const params = jQuery.deparam(window.location.search);

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
    ctx.shadowColor = colour;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = colour;
    ctx.stroke();
}

canvas.init = (colour) => {
    const $canvasHTML = $('#canvas');
    const canvas = $canvasHTML[0];
    const ctx = canvas.getContext('2d');
    console.log("Canvas initialized");

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
                colour,
                room: params.room.toLowerCase()
            });
            drawLine(ctx, prevX, prevY, x, y, colour);
            prevX = x;
            prevY = y;
        }
    }


    // Dot that follows the cursor
    const canvasPos = getPosition(canvas);
    let item = document.querySelector("#mouseDot");
    let itemRect = item.getBoundingClientRect();
    item.style.background = colour;

    document.addEventListener("mousemove", followMouse, false);
    canvas.onmouseleave = () => {
        item.style.display = 'none';
    }
    canvas.onmouseover = () => {
        item.style.display = 'block';
    }

    function getPosition(el) {
        var xPosition = 0;
        var yPosition = 0;

        while (el) {
            xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
            el = el.offsetParent;
        }
        return {
            x: xPosition,
            y: yPosition
        };
    }

    function followMouse(e) {
        let xPos = e.clientX - canvasPos.x - itemRect.width / 2;
        let yPos = e.clientY - canvasPos.y - itemRect.height / 2;

        item.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    // Socket Event
    client.on('draw', function(data) {
        drawLine(ctx, data.x1, data.y1, data.x2, data.y2, data.colour);
    });
}



export default canvas;
