const qwerty = document.getElementById('qwerty');
const phrase = document.getElementById('phrase');
const overlay = document.getElementById('overlay');
const ul = phrase.firstElementChild;
let missed = 0;

const startButton = document.querySelector('#overlay a');

//Function that resets keyboard when "Play Again?" button clicked
function resetKeyboard() {
    const keyRows = document.querySelectorAll('.keyrow')
    // Loop through rows
    for (let r = 0; r < keyRows.length; r++) {
        let row = keyRows[r];
        // Loop through keyboard keys
        let keys = row.children;
        for (let k = 0; k < keys.length; k++) {
            let key = keys[k];
            if (key.className === 'chosen') {
                key.classList.remove('chosen');
            }
        };
    }
}

//Function that resets 'missed' variable and heart icons when "Play Again?" button clicked
function resetMisses() {
    // Reset Misses to Zero
    missed = 0;
    const lives = document.getElementsByClassName('tries');
    for (var l = 0; l < lives.length; l++) {
        lives[l].firstElementChild.src = 'images/liveHeart.png'
    };
}

// START | RESET Button Click Event
startButton.addEventListener('click', (e) => {

    const buttonText = e.target.textContent;

    // Specify Function by Button Text Content
    const buttonActions = {

        start: () => {
            overlay.style.display = 'none';
            addPhraseToDisplay(phrases)
        },

        reset: () => {
            // Recreate Keyboard Buttons
            resetKeyboard()

            // Reset Misses to Zero
            resetMisses()

            // Remove Old Phrase
            ul.innerHTML = '';
            // Generate New Phrase
            addPhraseToDisplay(phrases)

            // Close Overlay
            overlay.style.display = 'none';
        }
    }

    if (buttonText === 'Start Game') {
        buttonActions.start();
    } else if (buttonText === 'Play Again?') {
        buttonActions.reset();
    }
});

const phrases = ["Joy to the World",
    "Merry Christmas",
    "Happy Hollidays",
    "Jingle Bells",
    "Rockin Around the Christmas Tree"];

/*
Function to choose a random phrase from array
@param {array}
*/

function getRandomPhraseAsArray(arr) {

    //Choose a Random Phrase
    const randomNum = Math.floor(Math.random() * 5)
    const randomPhrase = arr[randomNum];

    //Split Phrase into an new array of characters
    const characterArray = randomPhrase.split('');

    //Return the Character Array
    return characterArray;
};

/*
Function 
- Accept Array of phrases
- Pass Array to getRandomPhraseAsArray function
- Create List Items from characters
- Add list items to UL display

@param {array}
*/

function addPhraseToDisplay(arr) {

    const characterArray = getRandomPhraseAsArray(arr);
    for (var i = 0; i < characterArray.length; i++) {

        let character = characterArray[i];
        let listItem = document.createElement('li');
        listItem.textContent = character;
        ul.appendChild(listItem);

        if (character !== ' ') {
            listItem.classList.add("letter");
        } else {
            listItem.classList.add("space");
        }
    };
};

/*
Function 
- Accept event.target as buttonClicked 
- Get letter associated with clicked button
- Loop through letters in phrase
- Compare text of selected button to phrase for matches
- Return matched letter value or null

@param {event.target}
*/

function checkLetter(buttonClicked) {

    const letterSelected = buttonClicked.textContent; // Get Letter from button clicked
    const letters = document.getElementsByClassName("letter");
    let matchedLetter = '';

    for (let i = 0; i < letters.length; i++) { // Loop through letters in phrase
        let letter = letters[i];
        let letterValue = letter.textContent;

        if (letterSelected === letterValue.toLowerCase()) { // Compare selected key for phrase match

            letter.classList.add('show')
            matchedLetter = letterValue;
        }; //End Match if Statement
    }; // End Loop

    if (matchedLetter === '') { return null }

    return matchedLetter
}


// Keyboard - Click Event
qwerty.addEventListener('click', (e) => {
    const buttonClicked = e.target;
    const keyValue = buttonClicked.textContent;
    const buttonClass = buttonClicked.className;

    if (buttonClicked.tagName === 'BUTTON' &&
        buttonClass !== 'chosen') {

        buttonClicked.className = 'chosen';

        const letterFound = checkLetter(buttonClicked);

        if (letterFound === null) {
            const scoreboard = document.getElementById('scoreboard');
            const ol = scoreboard.firstElementChild.children; //Get all heart icons
            ol[missed].firstElementChild.src = 'images/lostHeart.png' // Change heart icon on Scoreboard based on miss number
            missed += 1; // Update missed variable
        };
    };

    checkWin() // Check for Win or Loss
});

/*
Function 
- Change Overlay Title
- Change Button Text
- Display Overlay

@param {string} New class name for overlay
@param {string} New headline text for Win/Loss Page
@param {string} New button text for Win/Loss Page
*/

function winOrLossOverlay(newClass, headline, buttonText) {

    overlay.className = newClass;
    const title = document.querySelector('#overlay h2');
    title.textContent = headline;
    const button = document.querySelector('#overlay a');
    button.textContent = buttonText;
    overlay.style.display = '';

}

/*
Function 
- Checks for win or loss
*/

function checkWin() {

    // Number of Letters w/ Show Class
    const showClass = document.getElementsByClassName('show').length;

    // Number of Letters w/ the Letters Class
    const letterClass = document.getElementsByClassName('letter').length;

    const ul = phrase.firstElementChild;
    const ulListLength = ul.children.length;

    // Are they equal?
    if (showClass === letterClass) { // Show Win Overlay
        winOrLossOverlay('win', 'Congratulations!', 'Play Again?')
    } else if (missed >= 5) { //Show Loss Overlay
        winOrLossOverlay('lose', 'Better Luck Next Time...', 'Play Again?')
    }
}

