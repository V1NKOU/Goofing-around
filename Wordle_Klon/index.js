const words = []
var currentBox = 0
var currentRow = 0
var rowLetters = ["", "", "", "", ""]
acceptedLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ"
    

function setup() {
    noCanvas()
}

function keyPressed() {
    if(acceptedLetters.includes(key.toUpperCase()) && currentBox < 5) {
        rowLetters[currentBox] = key.toUpperCase()
        select(`#box${currentBox + 1}`).html(key.toUpperCase())
        currentBox += 1
        console.log(rowLetters)
    }else if(keyCode === BACKSPACE && currentBox > 0) {
        currentBox -= 1
        rowLetters[currentBox] = ""
        select(`#box${currentBox + 1}`).html("")
        console.log(rowLetters)
    }
}