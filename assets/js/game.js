'use strict';

var selectableWords =           // Word list
    [
        "WHATABOUTZOIDBERG",
        "GOODNEWSEVERYONE",
        "BENDERRODRIGUEZ",
        "SHINY",
        "METAL",
        "MILLENIUM",
        "ROYALJELLY",
        "FIREWORKS",
        "FARNSWORTH",
        "ALLHAILHYPNOTOAD",
        "SINGLEFEMALELAWYER",
        "AMYWONG",
        "WERNSTROM",
        "FUTURAMA",



    ];

const maxTries = 10;           

var guessedLetters = [];       
var currentWordIndex;          
var guessingWord = [];         
var remainingGuesses = 0;      
var hasFinished = false;            
var wins = 0;                  

// sounds
var keySound = new Audio('./assets/sounds/typewriter-key.wav');
var winSound = new Audio('./assets/sounds/you-win.wav');
var loseSound = new Audio('./assets/sounds/you-lose.wav');


// Reset Game
function resetGame() {
    remainingGuesses = maxTries;

    currentWordIndex = Math.floor(Math.random() * (selectableWords.length));

    // Clear arrays
    guessedLetters = [];
    guessingWord = [];

    //Clear hangman
    document.getElementById("hangmanImage").src = "";

    // Build/clear the word
    for (var i = 0; i < selectableWords[currentWordIndex].length; i++) {
        guessingWord.push("_");
    }   

    // Hide game over/win images
    document.getElementById("pressKeyTryAgain").style.cssText= "display: none";
    document.getElementById("gameover-image").style.cssText = "display: none";
    document.getElementById("youwin-image").style.cssText = "display: none";

    // Show display
    updateDisplay();
};

//  Update
function updateDisplay() {

    document.getElementById("totalWins").innerText = wins;

    // Display guessed letters
    var guessingWordText = "";
    for (var i = 0; i < guessingWord.length; i++) {
        guessingWordText += guessingWord[i];
    }

    document.getElementById("currentWord").innerText = guessingWordText;
    document.getElementById("remainingGuesses").innerText = remainingGuesses;
    document.getElementById("guessedLetters").innerText = guessedLetters;
};


// Updates hangman image
function updateHangmanImage() {
    document.getElementById("hangmanImage").src = "assets/images/" + (maxTries - remainingGuesses) + ".png";
};

// find letters in word
function evaluateGuess(letter) {

    var positions = [];

    for (var i = 0; i < selectableWords[currentWordIndex].length; i++) {
        if(selectableWords[currentWordIndex][i] === letter) {
            positions.push(i);
        }
    }

    // Updates image on fail
    if (positions.length <= 0) {
        remainingGuesses--;
        updateHangmanImage();
    } else {
        // Replace _ with letter
        for(var i = 0; i < positions.length; i++) {
            guessingWord[positions[i]] = letter;
        }
    }
};
// Checks for win
function checkWin() {
    if(guessingWord.indexOf("_") === -1) {
        document.getElementById("youwin-image").style.cssText = "display: block";
        document.getElementById("pressKeyTryAgain").style.cssText= "display: block";
        wins++;
        winSound.play();
        hasFinished = true;
    }
};


// Checks for a loss
function checkLoss()
{
    if(remainingGuesses <= 0) {
        loseSound.play();
        document.getElementById("gameover-image").style.cssText = "display: block";
        document.getElementById("pressKeyTryAgain").style.cssText = "display:block";
        hasFinished = true;
    }
}

function makeGuess(letter) {
    if (remainingGuesses > 0) {
        // checks for duplicate guess
        if (guessedLetters.indexOf(letter) === -1) {
            guessedLetters.push(letter);
            evaluateGuess(letter);
        }
    }
    
};


document.onkeydown = function(event) {
    // reset on game over
    if(hasFinished) {
        resetGame();
        hasFinished = false;
    } else {
        // verify A-Z
        if(event.keyCode >= 65 && event.keyCode <= 90) {
            keySound.play();
            makeGuess(event.key.toUpperCase());
            updateDisplay();
            checkWin();
            checkLoss();
        }
    }
};