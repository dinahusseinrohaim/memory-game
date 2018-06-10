/*
 * Create a list that holds all of your cards
 */
let cards = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bomb',
    'fa-bicycle',
];
cards = [...cards, ...cards];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
const deck = document.querySelector('.deck'),
    movesCounter = document.querySelector('.moves'),
    time = document.querySelector('.time'),
    overlay = document.querySelector('#overlay'),
    popup = document.querySelector('#popup-message'),
    message = document.querySelector('.message'),
    stars = document.querySelector('.stars'),
    restart = document.querySelector('.restart');

let moves = 0;
/*
* initGame function use to init game
* */
function initGame() {
    const fragment = document.createDocumentFragment();
    shuffle(cards);
    for (const card of cards) {
        const newCard = generateCard(card);
        fragment.appendChild(newCard);
    }
    deck.appendChild(fragment);
    movesCounter.textContent = moves;
}

/*
* generateCard function use to create card
* @Pram cart symbol cardType
* @return String card
* */
function generateCard(cardType) {
    const card = document.createElement('li');
    card.setAttribute('class', 'card');
    card.setAttribute('data-card', cardType);
    card.innerHTML = `<i class='fa ${cardType}'></i>`;
    return card;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
initGame();
let openCards = [],
    matchedCards = [],
    clickCounter = 0,
    seconds = 0,
    minutes = 0,
    timer = 0,
    starsLost = 0;

// add event listener to deck and target card
deck.addEventListener("click", function (element) {
        if (element.target.nodeName === "LI") {
            let card = element.target;
            if (!card.classList.contains('show') && !card.classList.contains('open') && !card.classList.contains('match')) {
                if (openCards.length < 2)
                {
                    clickCounter++;
                    //check if first click ... start timer
                    if (clickCounter === 1)
                    {
                        startTimer();
                    }
                    openCard(card);
                    addCardToOpenList(card);
                }
                if (openCards.length === 2) {
                    //if cards match Keep cards open
                    if (openCards[0].dataset.card === openCards[1].dataset.card) {
                        for (const card of openCards)
                        {
                            keepCardsOpen(card);
                            matchedCards.push(card);
                        }
                        openCards = [];
                    } else {
                        //if cards don't match Close cards
                        setTimeout(function () {
                            for (const card of openCards)
                            {
                                closeCard(card);
                            }
                            openCards = [];
                        },500);
                    }
                    updateMoves();

                    //A star is lost after a certain number of moves
                    switch (moves) {
                        case 14:
                            stars.removeChild(stars.firstElementChild);
                            starsLost++;
                            break;
                        case 18:
                            stars.removeChild(stars.firstElementChild);
                            starsLost++;
                            break;
                    }

                    //Display message when all cards are matched
                    if (isCompleted()) {
                        clearInterval(timer);
                        message.textContent = `You completed the game in ${time.textContent} with ${moves} moves and ${3 - starsLost} stars remaining`;
                        overlay.style.display = 'block';
                        popup.style.display = 'block';
                    }
                }
            }
        }
    }
);

// add event listener to popup and target anchor link
popup.addEventListener('click', function(element) {
    if (element.target.nodeName === 'A') {
        if (element.target.classList.contains('close')) {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        } else if (element.target.classList.contains('yes')) {
            popup.style.display = 'none';
            overlay.style.display = 'none';
            resetGame();
        } else {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }
    }
});

// add event listener to restart btn
restart.addEventListener('click', resetGame);


/*
* function addCardToOpenList use to add card to open card list
* @Param card
* @return void
* */
function openCard(card) {
    card.classList.add('show', 'open');
}

/*
* function closeCard use to close card
* @Param card
* @return void
* */
function closeCard(card) {
    card.classList.remove('show', 'open');
}

/*
* function addCardToOpenList use to add card to open card list
* @Param card
* @return void
* */
function addCardToOpenList(card) {
    openCards.push(card);
}

/*
* function keepCardsOpen use to keep card open
* @Param card
* @return void
* */
function keepCardsOpen(card) {
    card.classList.add('match');
    card.classList.remove('show', 'open');
}
/*
* function updateMoves use to update user moves
* @return void
* */
function updateMoves() {
    moves++;
    movesCounter.textContent = moves;
}

/*
* function addTime use to increase time and display time in html
* @return void
* */
function addTime() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    time.textContent = `${(minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00')}:${(seconds ? (seconds > 9 ? seconds : '0' + seconds) : '00')}`;
}


/*
* function startTimer use to start time
* @return void
* */
function startTimer() {
    timer = setInterval(addTime, 1000);
}

/*
* function IsCompleted use to start time
* @return bool
* */
function isCompleted() {
    return cards.length === matchedCards.length;
}

/*
* function generateStar use to display stars on html
* @Param starsLost
* @return void
* */
function generateStar(starsLost) {
    for (let i = 0; i < starsLost; i++) {
        const starSymbol = document.createElement('li');
        starSymbol.innerHTML = '<i class="fa fa-star"></i>';
        stars.appendChild(starSymbol);
    }
}

/*
* function resetGame use to reset game
* @return void
* */
function resetGame() {
    deck.innerHTML = '';
    openCards = [];
    matchedCards = [];
    moves = 0;
    clickCounter = 0;
    clearInterval(timer);
    seconds = 0;
    minutes = 0;
    timer = 0;
    time.textContent = '00:00';
    generateStar(starsLost);
    starsLost = 0;
    initGame();
}