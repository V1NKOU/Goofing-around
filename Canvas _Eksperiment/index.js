const canvas = document.getElementById("draw-canvas")
const ctx = canvas.getContext("2d")
var mouseX
var mouseY
var balls = []
var gravity = 0.6
var selectedColor = {fill: "#c73d28", border: "#802f22"}
canvas.addEventListener("mousemove", e => {
    mouseX = e.offsetX
    mouseY = e.offsetY
})

canvas.addEventListener("click", () => createBall(mouseX, mouseY))

document.querySelectorAll(".colorOption").forEach(e => {
    e.addEventListener("click", () => {
        document.querySelector(".colorOption.selected").classList.remove("selected")
        e.classList.add("selected")
        selectedColor = {fill: e.dataset.color, border: e.dataset.border}
        console.log(selectedColor)
    })
    e.style.backgroundColor = e.dataset.color
    e.style.borderColor = e.dataset.border
})



//START THE DRAWING STUFF!!

loop()

function createBall(x,y,) {
    var ball = {
        x: x,
        y: y,
        fillCol: selectedColor.fill,
        borCol: selectedColor.border,
        radius: 20,
        velY: 1,
        velX: 0
    }
    balls.push(ball)
    placeBall(ball)
}

function placeBall(ball) {
    ctx.beginPath()
    ctx.fillStyle = ball.fillCol
    ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI)
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = ball.borCol
    ctx.stroke()
    ctx.closePath()
}

function loop() {
    ctx.clearRect(0,0, canvas.width, canvas.height)

    //
    for (let i = 0; i < balls.length; i++) {
        //BALL POSITION UPDATE
        balls[i].velY += gravity
        balls[i].y += balls[i].velY
        //BOUNCE!
        if (balls[i].y + balls[i].radius >= canvas.height) {
            balls[i].y = canvas.height - balls[i].radius
            balls[i].velY = -(balls[i].velY-0.5)*0.9
        }
        placeBall(balls[i])
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