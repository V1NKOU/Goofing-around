var validGuessesFile = 'assets/valid_guesses.csv'
var validSolutionsFile = 'assets/valid_solutions.csv'
var currentWord
var validGuesses
var validSolutions
var currentBox = 0
var currentRow = 0
var rowLetters = ["", "", "", "", ""]
var acceptedLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
var keyboardLayout = "QWERTYUIOPASDFGHJKLZXCVBNM"
var gameStarted = false

function setup() {
    validGuesses = loadTable(validGuessesFile, 'csv', 'header', onGuessesLoaded)
    validSolutions = loadTable(validSolutionsFile, 'csv', 'header', onSolutionsLoaded)
    select("#startBtn").mousePressed(function() {
        document.getElementById("intro").style.display = "none"
        document.getElementById("game-container").style.display = "flex"
        gameStarted = true
    })
    Array.from(document.getElementsByClassName("letBox")).map( (e,i)=> {
        e.setAttribute("data-letter", keyboardLayout[i])
        e.setAttribute("onclick",`boxClicked("${keyboardLayout[i]}")`)
        e.textContent = keyboardLayout[i]
    })
}

function onSolutionsLoaded() {

    validSolutions = validSolutions.getColumn("word").map(w => w.toUpperCase())
    currentWord = validSolutions[Math.floor(Math.random()*validSolutions.length)]
    console.log("Correct Word: ",currentWord)
    if(Array.isArray(validGuesses)) combineArrays()
}

function onGuessesLoaded() {
    validGuesses = validGuesses.getColumn("word").map(w => w.toUpperCase())
    if(Array.isArray(validSolutions)) combineArrays()
}
        
function combineArrays() {
    validGuesses = validGuesses.concat(validSolutions)
    console.log("Finished loading valid guesses: ",validGuesses.length)
}


function keyPressed() {
    if(gameStarted) {
        if(acceptedLetters.includes(key.toUpperCase()) && currentBox < 5+5*currentRow) {
            rowLetters[currentBox-5*currentRow] = key.toUpperCase()
            select(`#box${currentBox + 1}`).html(key.toUpperCase())
            document.getElementById("boxes").children[currentRow].children[currentBox-5*currentRow].classList.add("typed")
            currentBox += 1

        }else if(keyCode === BACKSPACE && currentBox > 5*currentRow) {
            backspaceClicked()

        }else if(keyCode === ENTER && currentBox == 5+5*currentRow ) {
            enterClicked()
        }
    }
}

function boxClicked(letter) {
if(currentBox < 5+5*currentRow) {
    key = letter
    keyPressed()
}
}

function backspaceClicked() {
    if(currentBox > 0+5*currentRow) {
    currentBox -= 1
    document.getElementById("boxes").children[currentRow].children[currentBox-5*currentRow].classList.remove("typed")
    rowLetters[currentBox-5*currentRow] = ""
    select(`#box${currentBox + 1}`).html("")
    }
}

function enterClicked() {
    var guessedWord = rowLetters.join("").toUpperCase()
        if(validGuesses.includes(guessedWord)) {

            //FINDER ANTAL BOGSTAVER
            var letterCount = {}
            currentWord.split("").map(c => {
                letterCount[c] = (letterCount[c] || 0) + 1
                

            })
            //FINDER GRØNNE BOGSTAVER
            rowLetters.map( (c,i) => {
                if(c === currentWord[i]) {
                    letterCount[c] -= 1
                    var box = document.getElementById("boxes").children[currentRow].children[i]
                    box.style.animationDelay = `${i * 0.15}s`
                    box.classList.add("correctSpot")
                    document.getElementById("boxes").children[currentRow].children[i].classList.remove("wrongSpot")
                    setTimeout(() => document.querySelector(`[data-letter="${c}"]`).classList.add("correctSpot"), 750)
                }
            })

            //FINDER GULE BOGSTAVER
            rowLetters.map( (c,i) => {
                if(c === currentWord[i]) return
                if(currentWord.includes(c) && letterCount[c] > 0) {
                    letterCount[c] -= 1
                    document.getElementById("boxes").children[currentRow].children[i].style.animationDelay = `${i * 0.15}s`
                    document.getElementById("boxes").children[currentRow].children[i].classList.add("wrongSpot")
                    setTimeout(() => document.querySelector(`[data-letter="${c}"]`).classList.add("wrongSpot"), 750)
                }
            })
            //FINDER GRÅ BOGSTAVER
            rowLetters.map( (c,i) => {
                if(!document.getElementById("boxes").children[currentRow].children[i].classList.contains("correctSpot") && !document.getElementById("boxes").children[currentRow].children[i].classList.contains("wrongSpot")){
                    console.log("letter:", c, "in word:", currentWord.includes(c))
                    document.getElementById("boxes").children[currentRow].children[i].classList.add("wrongLetter")
                    document.getElementById("boxes").children[currentRow].children[i].style.animationDelay = `${i * 0.15}s`
                    if(!document.querySelector(`[data-letter="${c}"]`).classList.contains("correctSpot") && !document.querySelector(`[data-letter="${c}"]`).classList.contains("wrongSpot"))
                    setTimeout( () => document.querySelector(`[data-letter="${c}"]`).classList.add("wrongLetter"), 750)
                }
            })

            console.log("You guessed:", guessedWord)

            if(guessedWord == currentWord) {
                console.log("Word guessed!")
                document.getElementById("boxes").children[currentRow].classList.add("win")
                gameStarted = false
    
            }else if(guessedWord !== currentWord && currentRow < 5){
                console.log(guessedWord,"wasnt the word")
                currentRow += 1
                rowLetters = ["", "", "", "", ""]
            }else{
                console.log("Too bad loser, the word was ",currentWord)
            }
        }else{
            console.log("Not in words list")
        }
}
