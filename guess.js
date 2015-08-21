function initialize() {
    guessCorrect = false;
    number = Math.floor((Math.random() * 10) + 1);
    paragraph = document.getElementById("message");
}

initialize();


function guessNumber(guess) {
	if (!guessCorrect) {
		if (guess.match(/[a-z]/i)) {
            paragraph.innerHTML = guess + " contains letters or characters that are not recognized. Pick a number between 1 and 10.";
            return;
        }
        if (guess > 10 || guess < 1 ) {
			paragraph.innerHTML = guess + " was out of the range! Pick a number between 1 and 10.";
            return;
		}
		if (guess == number) {
			paragraph.innerHTML = guess + " was correct! You win!"
			guessCorrect = true;
            initialize();
		}
		else if (guess < number) {
			paragraph.innerHTML = guess + " was too low! Try again!";
		}
		else {
			paragraph.innerHTML = guess + " was too high! Try again!";
		}
        document.getElementById('text-field').value = "";
	}
}

function testRandom() {
    var array = [];
    for (i=0; i < 1000; i++) {
        number = Math.floor((Math.random() * 10) + 1);
        array.sort(function(a,b) { return a-b });
        array.push(number); 
    }
    alert(array.indexOf(0) + " " + array.indexOf(11))
    paragraph.innerHTML = paragraph.innerHTML + " " + array;
}

//testRandom();