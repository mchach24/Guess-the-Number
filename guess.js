//range as default, variable is "guess" once range is submitted and guess
var state = "range";
//Variables for HTML elements
var output = document.getElementById("output");
//generic elements
var containerDiv = document.getElementById("containerDiv");
//range elements
var rangeForm = document.getElementById("rangeForm");
var fromInput = document.getElementById("fromIntInput");
var toInput = document.getElementById("toIntInput");
var rangeBtn = document.getElementById("rangeButton")
//guess elements
var guessForm = document.getElementById("guessForm");
var guessInput = document.getElementById("guessInput");
var guessBtn = document.getElementById("guessButton");
var resetBtn = document.getElementById("resetButton");
var autoGuessBtn = document.getElementById("autoGuessButton");
//Hides guessForm
guessForm.style.display = "none";
//defining range begin and end; default values set
var from = 1;
var to = 10;
//Events for DOM objects
//Events for range input
toInput.onkeypress = function() { if (event.keyCode == 13) rangeBtn.click() };
rangeBtn.onclick = setUpGuess;
//Events for guess input
guessInput.onkeypress = function() { if (event.keyCode == 13) guessBtn.click() }; //enter key pressed
guessBtn.onclick = function() { guessNumber(guessInput.value) };
resetBtn.onclick = function() { reset() }; //CHANGE                              !!!!!!!!!!!!!!
autoGuessBtn.onclick = function() { reset(); algorithmGuess(from,to); };

function setUpGuess() {
    from = parseInt(fromInput.value); //fromInput.value as int, rather than string
    to = parseInt(toInput.value); //toInput.value as int
    if (from < 1) {
        output.innerHTML = "Your first number was a non-positive number. Pick a positive number.";
        return;
    }
    if (to - from < 1) {
        output.innerHTML ="Your range is not accepted. Make sure the first number is less than the second."
        return;
    }
    guessForm.style.display = "initial";
    rangeForm.style.display = "none";
    state = "guess";
    reset();
}

function reset() {
    guessCorrect = false;
    tries = 0;
    number = Math.floor((Math.random() * to) + 1);
    output.innerHTML = "Guess the Number!"
    guessInput.placeholder = "Type your guess!";
    guessInput.value = "";
    //Enable guessInput and guessBtn after win
    guessInput.disabled = false;
    guessBtn.disabled = false;
    guessInput.focus();
}

function guessNumber(guess) {
    if (!guessCorrect) {
		tries++; // add 1 to tries
        if (guess == "") {
            output.innerHTML = "Please enter a guess.";
            tries--; //subtracts one from tries, which was already increased by 1, so it cancels out.
        }
        else if (guess.match(/[^0-9]/i)) {
            if (guess == "Type your guess!") {
                output.innerHTML = "Please enter a guess."
            }
            else {
                output.innerHTML = guess + " contains characters that are not recognized. Pick a number between 1 and 10.";
            }
            tries--; //subtracts one from tries, which was already increased by 1, so it cancels out.
        }
        else if (guess > to || guess < from ) {
			output.innerHTML = guess + " was out of the range! Pick a number between 1 and 10.";
            tries--; //subtracts one from tries, which was already increased by 1, so it cancels out.
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





function algorithmGuess(from,to,rapid,loops) {
    rapid = rapid || false;
    loops = loops || 1;
    for (current = 0; current < loops; current++) {
        if (from == to) {
            var computerGuess = from; //"to" works just as well as "from", as they are equal if this line of code is being ran.
        }
        else {
            var computerGuess = to - ((to - (from - 1)) / 2); 
            // Ex: from = 1; to = 10; 10 - ((10 - (1 - 1)) / 2) = 5
            // Ex 2: from = 6; to = 10; 10 - ((10 - (6 - 1)) / 2) = 7.5, rounded to 7 50% of the time, and 8 50% of the time. 7/8
            // Ex 3: from = 1; to = 5; 5 - ((5 - (1 - 1)) / 2) = 2.5, rounded to 2 50% of the time, and 3 50% of the time. 2/3
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
                numberOfTries.push(tries);
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
            var updatedFrom = computerGuess + 1;
            return algorithmGuess(updatedFrom,to); 
        }
        function returnHigh() {
            var updatedTo = computerGuess;
            return algorithmGuess(from,updatedTo);
        }
    }
}





//Super secret elements
var secretInputGroup = document.getElementById("secretInputGroup");
var rapidNumInput = document.getElementById("rapidNumberInput");
var rapidAutoGuessBtn = document.getElementById("rapidAutoGuessButton");
var showMoreSecrets = document.getElementById("showMoreSecrets");
//Hides all secret elements
secretInputGroup.style.display = "none";
//Click event variables
var clicks = 0;
var firstClickTime = 0;
var clicksNeeded = 5;
var timeSpan = 2500; //in milliseconds
//function to display secret elements
function displayElements() {
    if (state == "guess") {
        secretInputGroup.style.display = "initial";
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
rapidAutoGuessBtn.onclick = function() { algorithmGuess(from,to,true,rapidNumInput.value) };
  
    
var numberOfTries = [];