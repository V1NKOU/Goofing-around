const canvas = document.getElementById("draw-canvas")
const ctx = canvas.getContext("2d")
var mouseX
var mouseY
var balls = []
canvas.addEventListener("mouseenter", locateMouse)

function locateMouse() {
    canvas.addEventListener("mousemove", trackMouse)
    canvas.addEventListener("mouseleave", () => {
        canvas.removeEventListener("mousemove", trackMouse)
    })
}
function trackMouse(e) {
    mouseX = e.offsetX
    mouseY = e.offsetY
}
canvas.addEventListener("click", () => placeDot(mouseX, mouseY))

function placeDot(mouseX, mouseY) {
    const ball = {
        x: mouseX,
        y: mouseY,
        color: "black",
        radius: 20,
        velY: 0,
        velX: 0
    }
    ctx.beginPath()
    ctx.fillStyle = "black"
    ctx.arc(mouseX,mouseY,20,0,2*Math.PI)
    ctx.fill()
    ctx.strokeStyle = "red"
    ctx.stroke()
    ctx.closePath()
    balls.push(ball)
    console.log(balls)
}

function loop() {
    ctx.clearRect(0,0, canvas.width, canvas.height)

    for (let i = 0; i < balls.length; i++) {
        
        balls[i].ballX
    }
    requestAnimationFrame(loop)
}











/*
//Draw lines
ctx.beginPath()
ctx.lineWidth = 10
ctx.strokeStyle = "red"
ctx.moveTo(0,0)
ctx.lineTo(500,500)
ctx.stroke()
ctx.closePath()



//Draw rectangle
ctx.beginPath()
ctx.strokeStyle = "blue"
ctx.rect(50,50,200,100)
ctx.stroke()
ctx.closePath()

//Draw circle
ctx.beginPath()
ctx.strokeStyle = "green"
ctx.arc(250,250,200, 0, 2*Math.PI)
ctx.stroke()
ctx.closePath()

//Clear canvas
ctx.clearRect(0,0, canvas.width, canvas.height)
*/