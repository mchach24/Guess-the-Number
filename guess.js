//Variables for HTML elements
paragraph = document.getElementById('message');
textField = document.getElementById('text-field');
guessBtn = document.getElementById("guessButton");
resetBtn = document.getElementById("resetButton");
autoGuessBtn = document.getElementById("autoGuessButton");
//Calls reset function
reset();
//Events for DOM objects
textField.onclick = function() { textField.value = ""};
textField.onkeypress = function() { if (event.keyCode == 13) guessBtn.click() };
guessBtn.onclick = function() { guessNumber(textField.value) };
resetBtn.onclick = function() { reset() };
autoGuessBtn.onclick = function() { algorithmGuess(1,10) };

function reset() {
    guessCorrect = false;
    tries = 0;
    number = Math.floor((Math.random() * 10) + 1);
    paragraph.innerHTML = "Guess the Number!";
    textField.value = "Type your guess!"
}

function guessNumber(guess) {
	if (!guessCorrect) {
		tries++;
        if (guess == "") {
            paragraph.innerHTML = "Please enter a guess.";
            tries--;
        }
        else if (guess.match(/[^0-9]/i)) {
            if (guess == "Type your guess!") {
                paragraph.innerHTML = "Please enter a guess."
            }
            else {
                paragraph.innerHTML = guess + " contains characters that are not recognized. Pick a number between 1 and 10.";
            }
            tries--;
        }
        else if (guess > 10 || guess < 1 ) {
			paragraph.innerHTML = guess + " was out of the range! Pick a number between 1 and 10.";
            tries--;
		}
		else if (guess == number) {
			paragraph.innerHTML = guess + " was correct! You win! It took you " + tries + " tries!";
			guessCorrect = true;
		}
		else if (guess < number) {
			paragraph.innerHTML = guess + " was too low! Try again!";
		}
		else {
			paragraph.innerHTML = guess + " was too high! Try again!";
		}
        textField.value = "";
	}
}

function algorithmGuess(from,to) {
    if (from == to) {
        var computerGuess = from; //to works just as well, as they are equal if this line of code is being ran.
    }
    else {
        var computerGuess = to - ((to - (from - 1)) / 2); 
        // Ex: from = 1; to = 10; 10 - ((10 - (1 - 1)) / 2) = 5
        // Ex 2: from = 6; to = 10; 10 - ((10 - (6 - 1)) / 2) = 7.5, rounded to 7 50% of the time, and 8 50% of the time. 7/8
        // Ex 3: from = 1; to = 5; 5 - ((5 - (1 - 1)) / 2) = 2.5, rounded to 2 50% of the time, and 3 50% of the time. 2/3
        if (computerGuess % 1 != 0) {
            var random = Math.random();
            if (random < 0.5) {
                computerGuess = Math.floor(computerGuess);
            }
            else {
                computerGuess = Math.ceil(computerGuess);
            }
        }
    }
    textField.value = computerGuess;
    setTimeout(afterWait,2000);
    function afterWait() {
        guessBtn.click();
        if (paragraph.innerHTML.match(/win/i)) {
            paragraph.innerHTML = "The computer's guess, " + computerGuess + ", was correct. It took the computer " + tries + " tries to guess the number correctly.";
            numberOfTries.push(tries);
            return;
        }
        else if (paragraph.innerHTML.match(/low/i)) {
            paragraph.innerHTML = "The computer's guess, " + computerGuess + ", was too low. It will guess again.";
            setTimeout(returnLow,2000);
        }
        else if (paragraph.innerHTML.match(/high/i)) {
            paragraph.innerHTML = "The computer's guess, " + computerGuess + ", was too high. It will guess again.";
            setTimeout(returnHigh,2000);
        }
        else {
            paragraph.innerHTML = "It seems that an error has occurred. Please try again.";
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

var numberOfTries = [];