const gameBoard = document.getElementById('gameBoard');
const outputRecord = document.getElementById('outputRecord');
const outputResult = document.getElementById('outputResult');
const startOver = document.getElementById('startOver');
const resumeBtn = document.getElementById('resumeBtn');
const gameHeading = document.getElementById('gameHeading');


const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
let array = JSON.parse(localStorage.getItem('array')) || shuffleCardsArray([...numbers, ...numbers]);
let card1 = '';
let card2 = '';
let indexSecondCard = -1;
let indexFirstCard = -1;
let totalFlip = Number(localStorage.getItem('totalFlip')) || 0;
let record = Number(localStorage.getItem('record')) || 0;
let numberOfMatchedCards = Number(localStorage.getItem('numberOfMatchedCards')) || 0;
let selectedCardCount = 0;

outputResult.innerHTML = `Total Flip: ${totalFlip}`;
outputRecord.innerHTML = `Your record: ${record}`;


function shuffleCardsArray(array) {
    for (let i = array.length - 1; i >= 0; i --) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    for (let i = 0; i < array.length; i ++) {
    array[i] = {value: array[i] , state: 'none'};
    }
    return array;
}

function generateCards(array) {
    gameBoard.innerHTML = '';
    array.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('game__card');
        card.dataset.value = item.value;
        card.setAttribute('tabIndex', '0');

        const inner = document.createElement('div');
        inner.classList.add('game__card-inner');


        const front = document.createElement('div');
        front.classList.add('game__card-front');
        front.textContent = '';


        const back = document.createElement('div');
        back.classList.add('game__card-back');
        back.textContent = item.value;


        if (item.state == 'flipped') {
            item.state = 'none';
            card.classList.remove('game__card--flipped');
        }
        else if (item.state == 'matched') {
            card.classList.add('game__card--matched');
            card.textContent = item.value;
        }
        else {
            card.textContent = '';
        }
        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);
        gameBoard.appendChild(card);
        card.addEventListener('click', ()=> {
            if (card.classList.contains('game__card--flipped')) {
                return;
            }
            if (card.classList.contains('game__card--matched')) {
                return;
            }
            if (card1 != '' && card2 !='') {
                return;
            } 
            flipCard(card, item);
            totalFlip ++;
            outputResult.innerHTML = `Total Flip: ${totalFlip}`;
            localStorage.setItem('totalFlip', String(totalFlip)); 
            testTotalFlip(card, item); 
        })
        card.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') card.click();
        })
            
    })
    saveGame();
}

function flipCard(card, item) {
    if (selectedCardCount < 2){
        selectedCardCount += 1;
        localStorage.setItem('selectedCardCount', String(selectedCardCount));
    } 
            card.classList.add('game__card--flipped');
            item.state = 'flipped';
            saveGame();
                   
}

function testTotalFlip(card, item) {
    console.log(selectedCardCount);
     if (selectedCardCount === 2) {
                card2= card;
                indexSecondCard = Number(array.indexOf(item));
                console.log(indexSecondCard);
                testMatch()
            }
            else {
                card1 = card;
                indexFirstCard =Number(array.indexOf(item));
                console.log(indexFirstCard);
    
            } 
}


  function testMatch() {
        setTimeout(() => {
            if (array[indexFirstCard].value == array[indexSecondCard].value) {
                card1.classList.add('game__card--matched');
                card2.classList.add('game__card--matched');
                array[indexFirstCard].state = 'matched';
                array[indexSecondCard].state = 'matched';
                numberOfMatchedCards += 2;
                localStorage.setItem('numberOfMatchedCards', numberOfMatchedCards);
                if (numberOfMatchedCards == array.length) {
                    gameBoard.classList.add('game__board--finish');
                    if (record > totalFlip || record === 0) {
                        record = totalFlip;
                        outputRecord.innerHTML = `Your record: ${record}`;
                        localStorage.setItem('record', record);}
                }
                
            }
            else{
                array[indexFirstCard].state = 'none';
                array[indexSecondCard].state = 'none';
                card1.classList.remove('game__card--flipped');
                card2.classList.remove('game__card--flipped');
                card1.textContent = '';
                card2.textContent = ''; 
            }
            
            card1 = '';
            card2 = '';
            selectedCardCount = 0;
            saveGame();
            generateCards(array);
        }, 500);
    }
    
    function saveGame() {
        localStorage.setItem('array', JSON.stringify(array));
    }

    function loadGame() {
        if (localStorage.getItem('display') === 'hidden') gameBoard.classList.add('hidden');
        checkDisplay();
        generateCards(array);
    }

    function checkDisplay() {
          if (!gameBoard.classList.contains('hidden')) {
            resumeBtn.textContent = 'Save and Quit';
            gameHeading.classList.add('hidden');
            outputResult.classList.remove('hidden');
        }
        else {
            resumeBtn.textContent = 'Resume';
            gameHeading.classList.remove('hidden');
            outputResult.classList.add('hidden');
        }
    }

    startOver.addEventListener('click', () => {
        localStorage.removeItem('array');
        localStorage.removeItem('totalFlip');
        localStorage.removeItem('numberOfMatchedCards');
        localStorage.removeItem('display');
        window.location.reload();
    })

    resumeBtn.addEventListener('click', () => {
        gameBoard.classList.toggle('hidden');
        if (gameBoard.classList.contains('hidden')) localStorage.setItem('display', 'hidden');
        else localStorage.setItem('display', 'visible');
        checkDisplay();
      
    })

    window.addEventListener('load', loadGame);