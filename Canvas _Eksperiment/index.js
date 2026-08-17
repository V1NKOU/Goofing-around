const canvas = document.getElementById("draw-canvas")
const ctx = canvas.getContext("2d")
var mouseX
var mouseY
var balls = []
var gravity = 1600
var selectedColor = {fill: document.querySelector(".selected").dataset.color,border: document.querySelector(".selected").dataset.border}
//{fill: "#c73d28", border: "#802f22"}
var lastTime = 0
var isDragging = false
var arrowPos = {}
canvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX
    mouseY = e.offsetY
})
canvas.addEventListener("mouseleave", () => {
    let velX = -(mouseX - arrowPos.startX) * 5
    let velY = -(mouseY - arrowPos.startY) * 5
    if (isDragging) createBall(arrowPos.startX, arrowPos.startY, velX, velY)
    isDragging = false
})
canvas.addEventListener("mouseup", () => {
    let velX = -(mouseX - arrowPos.startX) * 5
    let velY = -(mouseY - arrowPos.startY) * 5
    console.log(mouseX, mouseY)
    if (isDragging) createBall(arrowPos.startX, arrowPos.startY, velX, velY)
    isDragging = false
})

canvas.addEventListener("mousedown", (e) => {
    if (!isDragging) {
        arrowPos.startX = e.offsetX
        arrowPos.startY = e.offsetY
    }
    isDragging = true


})

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
borderBox.addEventListener('click', () => {
    const borderBox = document.getElementById('borderBox')
    const borderCross = document.getElementById('borderCross')

    if (borderBox.classList.contains('toggled')) { 
        borderBox.classList.remove('toggled')
        borderCross.classList.add('hidden')
    } else {
            borderBox.classList.add('toggled')
            borderCross.classList.remove('hidden')
    }
    
})


/*
//SPAWN LOADS A BALLSIES
for (let i = 0; i <= 3000; i++)
{
    var ball = {
        x: 250,
        y: 250,
        fillCol: selectedColor.fill,
        borCol: selectedColor.border,
        radius: 10,
        velY: Math.random()*100,
        velX: Math.random()*100
    }
    balls.push(ball)
}*/

//START THE DRAWING STUFF!!

requestAnimationFrame(loop)


function createBall(x, y, velX, velY) {
    var ball = {
        x: x,
        y: y,
        fillCol: selectedColor.fill,
        borCol: selectedColor.border,
        radius: Number(document.getElementById("radiusScale").value),
        velY: velY,
        velX: velX
    }
    balls.push(ball)
}

function drawArrow() {
    const dist = Math.sqrt((mouseX - arrowPos.startX)*(mouseX - arrowPos.startX)+(mouseY - arrowPos.startY)*(mouseY - arrowPos.startY))
    const headLength = Math.min(dist*0.2, 30)
    const headAngle = Math.PI/7

    const angle = Math.atan2((arrowPos.startY - mouseY),(arrowPos.startX - mouseX))

    ctx.beginPath()
    ctx.lineWidth = 10
    ctx.strokeStyle = "yellow"
    ctx.moveTo(mouseX,mouseY)
    ctx.lineTo(arrowPos.startX,arrowPos.startY)
    ctx.lineTo(arrowPos.startX - headLength * Math.cos(angle - headAngle), arrowPos.startY - headLength * Math.sin(angle - headAngle))
    ctx.moveTo(arrowPos.startX,arrowPos.startY)
    ctx.lineTo(arrowPos.startX - headLength * Math.cos(angle + headAngle), arrowPos.startY - headLength * Math.sin(angle + headAngle))
    ctx.stroke()
    ctx.closePath()
}


function placeBall(ball) {
    ctx.beginPath()
    ctx.fillStyle = ball.fillCol
    ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI)
    ctx.fill()
    ctx.lineWidth = ball.radius * 0.15
    ctx.strokeStyle = ball.borCol
    if (document.getElementById('borderBox').classList.contains('toggled')) ctx.stroke()
    ctx.closePath()
}

function loop(currentTime) {

    let dt =(currentTime - lastTime) / 1000
    dt = Math.min(dt, 0.05)
    lastTime = currentTime


    ctx.clearRect(0,0, canvas.width, canvas.height)
    
    if (isDragging) drawArrow()
    
    for (let i = 0; i < balls.length; i++) {
        //BALL POSITION UPDATE
        balls[i].velY += gravity*dt
        balls[i].y += balls[i].velY*dt
        balls[i].velX *= 0.99
        balls[i].x += balls[i].velX*dt
        //CONTAIN THE BALL AND MAKE IT BOUNCE!!
        if (balls[i].y + balls[i].radius >= canvas.height) {
            balls[i].y = canvas.height - balls[i].radius
            balls[i].velY *= -0.9
        }
        if (balls[i].y - balls[i].radius < 0) {
            balls[i].y = balls[i].radius
            balls[i].velY *= -0.9
        }
        if (balls[i].x - balls[i].radius < 0) {
            balls[i].x = balls[i].radius
            balls[i].velX *= -0.9
        }
        if (balls[i].x + balls[i].radius > canvas.width) {
            balls[i].x = canvas.width - balls[i].radius
            balls[i].velX *= -0.9
        }

        //BALL-BALL COLLISIONS!
        for (let j = i+1; j < balls.length; j++) {
            let a = balls[i]
            let b = balls[j]
            let dx = b.x - a.x
            let dy = b.y - a.y
            let dist = Math.sqrt(dx*dx + dy*dy)
            let nx = dx / dist
            let ny = dy / dist

            //WHAT HAPPENS WHEN THEY TOUCHYYY
            if (dist < a.radius + b.radius) {
                let overlap = a.radius + b.radius - dist
                a.x -= (overlap / 2) * nx
                a.y -= (overlap / 2) * ny
                b.x += (overlap / 2) * nx
                b.y += (overlap / 2) * ny

                let aDot = a.velX * nx + a.velY * ny
                let bDot = b.velX * nx + b.velY * ny

                let relVel = bDot - aDot
                if (relVel < 0) {   // only resolve if actually approaching
                    a.velX += (bDot - aDot) * nx
                    a.velY += (bDot - aDot) * ny
                    b.velX += (aDot - bDot) * nx
                    b.velY += (aDot - bDot) * ny
                }
                balls[i].velX *= 0.8
            }
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