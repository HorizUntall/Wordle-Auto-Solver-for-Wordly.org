
var word_list;
var tries;
var maxTries;
var word_ans;
var word_length;

var correctLetters = {};
var misplacedLetters = {};
var incorrectLetters = [];


// Frequency is based from https://wordsrated.com/wordle-words/
var letterFrequences = {
    'A' : 39.2,
    'B' : 11.5,
    'C' : 19.3,
    'D' : 16.0,
    'E' : 45.6,
    'F' : 8.9,
    'G' : 12.9,
    'H' : 16.3,
    'I' : 28.0,
    'J' : 1.2,
    'K' : 8.7,
    'L' : 27.9,
    'M' : 12.9,
    'N' : 23.7,
    'O' : 29.1,
    'P' : 14.9,
    'Q' : 1.3,
    'R' : 36.2,
    'S' : 26.7,
    'T' : 28.9,
    'U' : 19.7,
    'V' : 6.4,
    'W' : 8.4,
    'X' : 1.6,
    'Y' : 18.0,
    'Z' : 1.5
}

async function main() {
    tries = getNumOfTries();
    word_length = getWordLength();
    maxTries = tries;

    // Fetches the JSON File
    // await fetchJSON(`${word_length}_letter_words.json`);
    await fetchJSON('5_letter_words.json');

    while (tries > 0) {

        if (tries > 1 && word_list.length > 2) {
            word_ans = findStrategicWord();
        } else {
            // Desperate Mode
            console.log("Using letter frequency strategy for the guess...");
            word_ans = findStrategicWord_desperate();
        }

        console.log("Current Guessed Word:", word_ans);

        // Ensure that word_list is populated
        if (!word_list || word_list.length === 0) {
            console.error("Word_list is empty or undefined");
            alert("Ran Out of Words. Please proceed answering manually. I would like to apologize 🥹")
            return;
        }
        console.log("Words List:", word_list);
        console.log("Incorrect Letters:", incorrectLetters);

        // Enters the letters in the website
        inputWord(word_ans);

        if (await compare(word_ans) == true) {
            console.log(`word ${word_ans} is correct!!!`)
            break;
        } else {
            filter();
        }

        tries--;
    }
}

// Adjust for the website
function getNumOfTries() {
    let allRows = document.querySelectorAll('.Row').length;
    return allRows;
}

// Adjust for the website
function getWordLength() {
    
    let firstRow = document.querySelector('.Row');
    let numberOfBoxes = firstRow ? firstRow.querySelectorAll('.Row-letter').length : 0;

    return numberOfBoxes;

}

function compare(answer) {
    return new Promise((resolve) => {
        let isCorrect = true;
        
        setTimeout(() => {
            let comparison = getLetterFeedback();
            console.log(`Feedback: ${comparison}`);
            
            for (let i = 0; i < word_length; i++) {
                let answer_letter = answer[i];
                let letter_comparison = comparison[i];
                
                switch (letter_comparison) {
                    case 'c':
                        correctLetters[i] = answer_letter;
                        break;
                    case 'm':
                        if (!misplacedLetters[i]) {
                            misplacedLetters[i] = [];
                        }
                        misplacedLetters[i].push(answer_letter);
                        isCorrect = false;
                        break;
                    case 'x':
                        if (Object.values(misplacedLetters).some(lettersArray => lettersArray.includes(answer_letter))) {
                            if (!misplacedLetters[i]) {
                                misplacedLetters[i] = [];
                            }
                            misplacedLetters[i].push(answer_letter);
                        } else if (!incorrectLetters.includes(answer_letter) && !Object.values(misplacedLetters).some(lettersArray => lettersArray.includes(answer_letter))) { 
                            incorrectLetters.push(answer_letter); 
                        }
                        isCorrect = false;
                }
            }
            
            // Resolve the promise with the result
            resolve(isCorrect);
        }, 1000);
    });
}

function findStrategicWord_desperate() {
    let bestWord = '';
    let highestTotalFrequency = -1;
    for (const word of word_list) {
        let totalFrequency = 0;
        for (const letter of word) {
            totalFrequency += letterFrequences[letter];
        }
        if (totalFrequency > highestTotalFrequency) {
            highestTotalFrequency = totalFrequency;
            bestWord = word;
        }
    }
    return bestWord;
}

function findStrategicWord() {
    
    let bestWord = '';
    let highestEntropy = -1;

    for (const word of word_list) {
        const entropy = calculateEntropy(word, word_list);
        if (entropy > highestEntropy) {
            bestWord = word;
            highestEntropy = entropy;
        }
    }

    return bestWord;

}

function calculateEntropy(word, possibleWords) {

    const outcomes = {};

    for (const candidate of possibleWords) {
         const result = getComparisonResult(word, candidate); 
         if (!outcomes[result]) {
            outcomes[result] = [];
         }
         outcomes[result].push(candidate);
    }

    let entropy = 0;
    const total = possibleWords.length;
    
    for (const group in outcomes) {
        const probability = outcomes[group].length / total;
        entropy -= probability * Math.log2(probability);
    }

    return entropy;

}

function getComparisonResult(word, candidate) {
    // Create a comparison result based on the word and candidate
    let result = '';
    for (let i = 0; i < word_length; i++) {
        if (candidate[i] === word[i]) {
            result += 'c';
        } else if (word.includes(candidate[i])) {
            result += 'm';
        } else {
            result += 'x';
        }
    }
    return result;
}

function filter() {
    word_list = word_list.filter(word => {

        // Condition 1: Check for incorrect letters
        for (let i = 0; i < word_length; i++) {
            if (incorrectLetters.includes(word[i]) && correctLetters[i] != word[i]) {
                return false;
            }
        }

        // Condition 2: Check correct letters at specified indices
        for (const [index, letter] of Object.entries(correctLetters)) {
            if (word[index] !== letter) {
                return false;
            }
        }

        // Condition 3: Check misplaced letters
        for (const [index, letters] of Object.entries(misplacedLetters)) {
            
            // Check if word[index] is in the misplaced letters array
            if (letters.includes(word[index])) {
                return false; // Letter is in the wrong place
            }

            let validMisplaced = false;
            // Check if every letter in letters exist somewhere else in the word
            for (const letter of letters) {
                if (word.includes(letter) && word.indexOf(letter) !== parseInt(index)) {
                    validMisplaced = true;
                }
            }
            if (!validMisplaced) {
                return false;
            }
        }

        // If all conditions pass, keep the word
        return true;

    });
}


async function fetchJSON(file) {
    try {
        // Use chrome.runtime.getURL to get the correct URL for the JSON file
        const jsonUrl = chrome.runtime.getURL(file);
        const response = await fetch(jsonUrl);
        word_list = await response.json();
        console.log("Successfully fetched JSON:", word_list);
    } catch (error) {
        console.error("Error fetching JSON: ", error);
    }
}

// Website-specific code: https://wordly.org/

function inputWord(word) {
    function simulateKeyPress(letter) {
        const keydownEvent = new KeyboardEvent('keydown', {
            key: letter,
            code: `Key${letter.toUpperCase()}`,
            keyCode: letter.charCodeAt(0),
            which: letter.charCodeAt(0),
            bubbles: true,
            cancelable: true,
        });
        const keyupEvent = new KeyboardEvent('keyup', {
            key: letter,
            code: `Key${letter.toUpperCase()}`,
            keyCode: letter.charCodeAt(0),
            which: letter.charCodeAt(0),
            bubbles: true,
            cancelable: true,
        });

        document.dispatchEvent(keydownEvent);
        document.dispatchEvent(keyupEvent);
    }

    // Input each letter of the word
    for (const letter of word) {
        simulateKeyPress(letter.toLowerCase()); // Send each letter as a lowercase keypress
    }

    // Simulate pressing "Enter" at the end of the word input
    const keydownEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
    });
    const keyupEvent = new KeyboardEvent('keyup', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
    });

    document.dispatchEvent(keydownEvent);
    document.dispatchEvent(keyupEvent);

}


function getLetterFeedback(){

    // Select all rows that are locked in (submitted guesses)
    let allLockedRows = document.querySelectorAll('.Row.Row-locked-in');

    // Select the most recent row (last locked-in row)
    let currentRow = allLockedRows[allLockedRows.length - 1];

    // If there are no locked rows, return an empty array
    if (!currentRow) return [];

    let letterDivs = currentRow.querySelectorAll('.Row-letter');
    let feedback = "";

    // Loop through each letter and check its feedback class
    letterDivs.forEach((div, index) => {
        let status;

        // Check for feedback class (absent, correct, elsewhere)
        if (div.classList.contains('letter-correct')) {
            status = 'c'; // Correct letter and position (green)
        } else if (div.classList.contains('letter-elsewhere')) {
            status = 'm'; // Correct letter but misplaced (yellow)
        } else if (div.classList.contains('letter-absent')) {
            status = 'x'; // Incorrect Letter (gray)
        }
        feedback += status;
    });

    return feedback;

}

