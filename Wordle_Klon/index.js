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
var stats

function setup() {
    validGuesses = loadTable(validGuessesFile, 'csv', 'header', onGuessesLoaded)
    validSolutions = loadTable(validSolutionsFile, 'csv', 'header', onSolutionsLoaded)
    stats = JSON.parse(window.localStorage.getItem("stats"))
    if (!stats) {
        stats = {
            totalGames: 0,
            totalWins: 0,
            guessWins: [0, 0, 0, 0, 0, 0]
        }
    }
    document.getElementById("startBtn").addEventListener("click", () => {
        document.getElementById("intro").style.display = "none"
        document.getElementById("game-container").style.display = "flex"
        gameStarted = true
    })
    document.getElementById("restartBtn").addEventListener("click", () => {
        restartGame()
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
                    setTimeout(() =>  { 
                        document.querySelector(`[data-letter="${c}"]`).classList.add("correctSpot")
                        document.querySelector(`[data-letter="${c}"]`).classList.remove("wrongSpot")
                        document.querySelector(`[data-letter="${c}"]`).classList.remove("wrongLetter")
                    }, i * 150)
                }
            })

            //FINDER GULE BOGSTAVER
            rowLetters.map( (c,i) => {
                if(c === currentWord[i]) return
                if(currentWord.includes(c) && letterCount[c] > 0) {
                    letterCount[c] -= 1
                    document.getElementById("boxes").children[currentRow].children[i].style.animationDelay = `${i * 0.15}s`
                    document.getElementById("boxes").children[currentRow].children[i].classList.add("wrongSpot")
                    if(!document.querySelector(`[data-letter="${c}"]`).classList.contains("correctSpot")) {
                    setTimeout(() => document.querySelector(`[data-letter="${c}"]`).classList.add("wrongSpot"), i * 150)
                    }
                }
            })
            //FINDER GRÅ BOGSTAVER
            rowLetters.map( (c,i) => {
                if(!document.getElementById("boxes").children[currentRow].children[i].classList.contains("correctSpot") && !document.getElementById("boxes").children[currentRow].children[i].classList.contains("wrongSpot")){
                    document.getElementById("boxes").children[currentRow].children[i].classList.add("wrongLetter")
                    document.getElementById("boxes").children[currentRow].children[i].style.animationDelay = `${i * 0.15}s`
                    if(!document.querySelector(`[data-letter="${c}"]`).classList.contains("correctSpot") && !document.querySelector(`[data-letter="${c}"]`).classList.contains("wrongSpot")) {
                        setTimeout( () => document.querySelector(`[data-letter="${c}"]`).classList.add("wrongLetter"), i * 150)
                    }
                }
            })

            console.log("You guessed:", guessedWord)

            if(guessedWord == currentWord) {
                console.log("Word guessed!")
                gameStarted = false
                stats.totalGames += 1
                stats.totalWins += 1
                stats.guessWins[currentRow] += 1
                console.log(stats.guessWins)
                window.localStorage.setItem("stats", JSON.stringify(stats))
                showWinStats()
                setTimeout(() => {
                    document.getElementById("end-screen").style.display = "flex"

                }, 2500)
                document.getElementById("end-title").textContent = "You guessed the word!"
    
            }else if(guessedWord !== currentWord && currentRow < 5){
                console.log(guessedWord,"wasnt the word")
                currentRow += 1
                rowLetters = ["", "", "", "", ""]
            }else{
                console.log("Too bad loser, the word was ",currentWord)
                stats.totalGames += 1
                window.localStorage.setItem("stats", JSON.stringify(stats))
                setTimeout(() => {
                    document.getElementById("end-screen").style.display = "flex"
                    document.getElementById("end-title").textContent = "You didn't guess the word."
                    document.getElementById("end-sub-title").textContent = "The word was: " + currentWord
                    showWinStats()
                }, 2500)
            }
        }else{
            console.log("Not in words list")
        }
}

function showWinStats() { 
    Array.from(document.getElementById("stat-pillars").children).map((p, i) => {
        p.querySelector(".pillar").style.width = Math.pow(stats.guessWins[i]/stats.totalWins, 0.7)*24+"vw"
        if (stats.guessWins[i] > 0) {
            p.querySelector(".pillar").textContent = stats.guessWins[i]
        }
        
    })
    document.getElementById("total-games-amount").textContent = stats.totalGames
    document.getElementById("win-percentage-amount").textContent = Math.round(stats.totalWins/stats.totalGames*100)+"%"
}

function restartGame() {
    document.getElementById("end-sub-title").textContent = ""
    gameStarted = true
    currentBox = 0
    currentRow = 0
    rowLetters = ["", "", "", "", ""]
    document.getElementById("end-screen").style.display = "none"
    Array.from(document.getElementsByClassName("box")).forEach( (e) => {
        e.classList.remove("correctSpot", "wrongSpot", "wrongLetter", "typed")
        e.textContent = ""
        e.style.animationDelay = "0s"

    })
    Array.from(document.getElementsByClassName("letBox")).forEach( (e) => {
        e.classList.remove("correctSpot", "wrongSpot", "wrongLetter")
    })
    currentWord = validSolutions[Math.floor(Math.random()*validSolutions.length)]
    console.log("Correct Word: ",currentWord)
}