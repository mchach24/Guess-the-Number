// 0: range; 1: guess; 2: algorithm; 3: user clicked on "play again";
var state = 0;
//Variables for HTML elements
//generic elements
var containerDiv = document.getElementById("containerDiv");
var output = document.getElementById("output");
//range elements
var rangeDiv = document.getElementById("rangeDiv");
var minInput = document.getElementById("minInput");
var maxInput = document.getElementById("maxInput");
var rangeBtn = document.getElementById("rangeBtn");
//guess elements
var guessDiv = document.getElementById("guessDiv");
var guessInput = document.getElementById("guessInput");
var guessBtn = document.getElementById("guessBtn");
var resetBtn = document.getElementById("resetBtn");
var autoGuessBtn = document.getElementById("autoBtn");
var editRangeBtn = document.getElementById("editRangeBtn");
//Hides guessDiv
guessDiv.style.display = "none";
//defining range begin and end; default values set
var min = 1;
var max = 10;
//Events for DOM objects
//Events for range input
maxInput.onkeypress = function() { if (event.keyCode == 13) rangeBtn.click() };
rangeBtn.onclick = setUpGuess;
//Events for guess input
guessInput.onkeypress = function() { if (event.keyCode == 13) guessBtn.click() }; //enter key pressed
guessBtn.onclick = function() { guessNumber(guessInput.value) };
resetBtn.onclick = function() { state = 3; reset(); }; 
autoGuessBtn.onclick = function() { reset(); algorithmGuess(min,max); };
editRangeBtn.onclick = function() { guessDiv.style.display = "none"; rangeDiv.style.display = "initial"; };

function setUpGuess() {
    min = parseInt(minInput.value); //minInput.value as int, rather than string
    max = parseInt(maxInput.value); //maxInput.value as int
    if (min < 1) {
        output.innerHTML = "Your first number was a non-positive number. Pick a positive number.";
        return;
    }
    if (max - min < 1) {
        output.innerHTML = "Your range is not accepted. Make sure the first number is less than the second."
        return;
    }
    guessDiv.style.display = "initial";
    rangeDiv.style.display = "none";
    state = 1;
    reset();
}

function reset() {
    guessCorrect = false;
    tries = 0;
    // new way \/ old way --> number = Math.floor((Math.random() * max) + 1); did not work properly if min != 1
    number = Math.floor((Math.random() * (max - min + 1)) + min);
    output.innerHTML = "Guess the Number!"
    guessInput.placeholder = "Type your guess!";
    guessInput.value = "";
    //remove readonly attribute from guessinput if it already has it
    if (guessInput.hasAttribute("readonly")) {
        guessInput.removeAttribute("readonly");
    }
    //Enable guessInput and guessBtn after win
    guessInput.disabled = false;
    guessBtn.disabled = false;
    guessInput.focus();
    state = 1;
}

function guessNumber(guess) {
    if (state != 1) { state = 1 };
    if (!guessCorrect) {
		tries++; // add 1 to tries
        if (guess === "") {
            output.innerHTML = "Please enter a guess.";
            tries--; //subtracts one min tries, which was already increased by 1, so it cancels out.
        }
        else if (guess.match(/[^0-9]/)) {
            if (guess == "Type your guess!") {
                output.innerHTML = "Please enter a guess."
            }
            else {
                output.innerHTML = guess + " contains characters that are not recognized. Pick a number between 1 and 10.";
            }
            tries--; //subtracts 1 from tries, which was already increased by 1, so it cancels out.
        }
        else if (guess > max || guess < min ) {
			output.innerHTML = guess + " was out of the range! Pick a number between " + min + " and " + max;
            tries--; //subtracts 1 from tries, which was already increased by 1, so it cancels out.
		}
		else if (guess == number) {
			output.innerHTML = guess + " was correct! You win! It took you " + tries + " tries!";
            guessInput.disabled = "true";
            guessBtn.disabled = "true";
            resetBtn.focus();
			guessCorrect = true;
		}
		else if (guess < number) {
			output.innerHTML = guess + " was too low! Try again!";
		}
		else {
			output.innerHTML = guess + " was too high! Try again!";
		}
        guessInput.value = "";
        guessInput.focus();
	}
}





function algorithmGuess(min,max,rapid,loops) {
    guessInput.setAttribute("readonly","readonly");
    var timeDelay = 2000;
    if (state == 3) return;
    state = 2;
    rapid = rapid || false;
    loops = loops || 1;
    if (rapid) timeDelay = 0;
    for (current = 0; current < loops; current++) {
        if (min == max) {
            var computerGuess = min; //"max" works just as well as "min", as they are equal if this line of code is being run
        }
        else {
            var computerGuess = max - ((max - (min - 1)) / 2); 
            // Ex: min = 1; max = 10; 10 - ((10 - (1 - 1)) / 2) = 5
            // Ex 2: min = 6; max = 10; 10 - ((10 - (6 - 1)) / 2) = 7.5, rounded to 7 50% of the time, and 8 50% of the time. 7/8
            // Ex 3: min = 1; max = 5; 5 - ((5 - (1 - 1)) / 2) = 2.5, rounded to 2 50% of the time, and 3 50% of the time. 2/3
            if (computerGuess % 1 != 0) { //Condition is true if computerGuess is not divisible by 1. Essentially float or int.
                var random = Math.random();
                if (random < 0.5) { //Half the time
                    computerGuess = Math.floor(computerGuess);
                }
                else { //The other half
                    computerGuess = Math.ceil(computerGuess);
                }
            }
        }
        guessInput.value = computerGuess;
        setTimeout(afterWait,2000); //Waits 2000 milliseconds until the rest of the code (below) is called.
        function afterWait() {
            guessBtn.click();
            if (output.innerHTML.match(/win/i)) {
                output.innerHTML = "The computer's guess, " + computerGuess + ", was correct. It took the computer " + tries + " tries to guess the number correctly.";
                return;
            }
            else if (output.innerHTML.match(/low/i)) {
                output.innerHTML = "The computer's guess, " + computerGuess + ", was too low. It will guess again.";
                setTimeout(returnLow,2000); //Another wait.
            }
            else if (output.innerHTML.match(/high/i)) {
                output.innerHTML = "The computer's guess, " + computerGuess + ", was too high. It will guess again.";
                setTimeout(returnHigh,2000); //Another wait.
            }
            else {
                output.innerHTML = "It seems that an error has occurred. Please try again.";
                return;
            }
        }
        function returnLow() {
            var updatedMin = computerGuess + 1;
            return algorithmGuess(updatedMin,max); 
        }
        function returnHigh() {
            var updatedMax = computerGuess;
            return algorithmGuess(min,updatedMax);
        }
    }
}




/*
//Extra elements
var advancedDiv = document.getElementById("advancedDiv");
var rapidNumInput = document.getElementById("rapidNumberInput");
var rapidAutoBtn = document.getElementById("rapidAutoBtn");
var showMore = document.getElementById("showMoreBtn");

var statisticsDiv = document.getElementById("statisticsDiv");
//Hides all secret elements
advancedDiv.style.display = "none";
statisticsDiv.style.display = "none";
//Click event variables
var clicks = 0;
var firstClickTime = 0;
var clicksNeeded = 5;
var timeSpan = 2500; //in milliseconds
var visible = false;
//function to display secret elements
function displayElements() {
    if (state == 1) {
        if (!visible) {
            advancedDiv.style.display = "initial";
            visible = true;
        }
        else {
            advancedDiv.style.display = "none";
            visible = false;
        }
    }
    else {
        return;
    }
}
//Extra events
containerDiv.onclick = function() {
    var dt = Date.now() - firstClickTime;
    if (dt > timeSpan) {
        firstClickTime = Date.now();
        clicks = 0;
    }
    if (++clicks >= clicksNeeded) {
        firstClickTime = 0;
        clicks = 0;
        displayElements();
    }
}
rapidNumInput.onkeypress = function() { if (keyCode == 13) rapidAutoGuessBtn.click() };
rapidAutoBtn.onclick = function() { algorithmGuess(min,max,true,rapidNumInput.value) };
showMore.onclick = function() { extraInputGroup.style.display = "initial" };
// Rename variables, functions for more consistency and readability; complete rewrite once features are completely developed.
//!!!!!!!!!!!!!
 */

resize();

window.onresize = resize;
    
function resize() {
    var width = window.innerWidth;
    var divs = document.getElementsByClassName("container");
    var array = [].slice.call(divs);
    if (width < 1295) {
        for (i = 0; i < array.length; i++) {
            array[i].style.width = "95%";
        }
    }
    else {
        for (i = 0; i < array.length; i++) {
            array[i].style.width = "60%";
        }
    }
}
