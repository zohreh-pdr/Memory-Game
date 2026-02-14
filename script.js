export class MemoryGame {
    #cards;
    #numbers;
    #values;
    
    constructor ({restartBtn, resumeBtn}) {
        this.restartBtn = restartBtn;
        this.resumeBtn = resumeBtn;
        this.gameBoard = document.getElementById('gameBoard');
        this.recordDisplay = document.getElementById('recordDisplay');
        this.resultDisplay = document.getElementById('resultDisplay');
        this.#numbers = [1, 2, 3, 4, 5, 6, 7, 8];
        this.#values = [...this.#numbers, ...this.#numbers];
        this.#cards = JSON.parse(localStorage.getItem('cards')) || [];
        this.firstIndex = null;
        this.secondIndex = null;
        this.movements = Number(localStorage.getItem('totalMoves')) || 0;
        this.isTesting = false;
        this.matchedPairs = Number(localStorage.getItem('matchedPairs')) || 0;
        this.record = Number(localStorage.getItem('record')) || 0;
        this.isGameHidden = JSON.parse(localStorage.getItem('isGameHidden')) || false;
    }

    shuffleCards(values) {
        for (let i = values.length - 1; i > 0; i --) {
            const j = Math.floor(Math.random() * (i + 1));
            [values[i], values[j]] = [values[j], values[i]];   
        }
        return values;
    }

    initCards() {
        const values = this.shuffleCards(this.#values);
        this.#cards = values.map(value => ({
           value,
          state: 'none'
          }));
        this.saveCards();
    }

    renderCards() {
        this.gameBoard.innerHTML = '';
        if (this.#cards.length === 0) this.initCards();
        console.log(this.#cards);
        this.#cards.forEach((value, index) => {
            const card = document.createElement('button');
            card.dataset.index = index;
            card.value = value.value;
            card.classList.add('game__card');
            card.textContent = '';

            const innerCard = document.createElement('div');
            innerCard.classList.add('card--inner');

            const frontCard = document.createElement('div');
            frontCard.classList.add('card--front');


            const backCard = document.createElement('div');
            backCard.classList.add('card--back');
            backCard.textContent = value.value;

            if (value.state === 'matched') {
                card.classList.add('game__card--matched');
                card.setAttribute('tabIndex', '-1');
            }

            this.gameBoard.appendChild(card);
            card.appendChild(innerCard);
            innerCard.appendChild(frontCard);
            innerCard.appendChild(backCard);

            card.addEventListener('click', () => {
                if (this.isTesting) return;
                this.flipCard(index)
            })
            card.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') card.click();
            })
            card.style.opacity = 0;
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease';
                card.style.opacity = 1;
            }, index * 50); 

        });
    }

    flipCard(index) {
        if (this.#cards[index].state === 'flipped') return;
        if (this.#cards[index].state === 'matched') return;
        this.#cards[index].state = 'flipped';
        const cardBtn = document.querySelector(`[data-index ='${index}']`);
        cardBtn.classList.add('game__card--flipped');
        this.movements += 1;
        this.resultDisplay.innerHTML = `Your Moves: ${this.movements}`;
        this.saveDisplay();
        if (this.firstIndex === null) this.firstIndex = index;
        else if (this.secondIndex === null) {
            this.secondIndex = index;
            this.testMatch();
        }
    }

    testMatch() {
        this.isTesting = true;
        const firstCard = document.querySelector(`[data-index='${this.firstIndex}']`);
        const secondCard = document.querySelector(`[data-index='${this.secondIndex}']`);
        setTimeout( ()=> {
            if (this.#cards[this.firstIndex].value === this.#cards[this.secondIndex].value) {
                console.log('matched');
                firstCard.classList.remove('game__card--flipped');
                secondCard.classList.remove('game__card--flipped');
                firstCard.classList.add('game__card--matched');
                secondCard.classList.add('game__card--matched');
                firstCard.setAttribute('tabIndex', '-1');
                secondCard.setAttribute('tabIndex', '-1');
                this.#cards[this.firstIndex].state = 'matched';
                this.#cards[this.secondIndex].state = 'matched';
                this.matchedPairs += 1;
                localStorage.setItem('matchedPairs', String(this.matchedPairs));
                this.checkGameOver();
                this.saveCards();
            }
            else {
                firstCard.classList.remove('game__card--flipped');
                secondCard.classList.remove('game__card--flipped');
                this.#cards[this.firstIndex].state = 'none';
                this.#cards[this.secondIndex].state = 'none';
            }
    
            this.firstIndex = null;
            this.secondIndex = null;
            this.isTesting = false;
    
        }, 600)
          }


    checkGameOver() {
        if (this.matchedPairs == this.#numbers.length) {
            const gameDiv = document.querySelector('#game');
             gameDiv.classList.add('game--finished');
             this.resumeBtn.disabled = true;
             this.recordSet();
        }

    }   
    
    
    recordSet() {
        if (this.movements <= this.record || this.record == 0) {
            this.record = this.movements;
            localStorage.setItem('record', this.record);
        }
        this.recordDisplay.innerHTML = `Your Record: ${this.record}`;
    }


    saveCards() {
        localStorage.setItem('cards', JSON.stringify(this.#cards));
    }

    saveDisplay() {
        localStorage.setItem('totalMoves', JSON.stringify(this.movements));
    }

    loadGame() {
        this.renderCards();
        this.resultDisplay.innerHTML = `Your Moves: ${this.movements}`;
        this.recordDisplay.innerHTML = `Your Record: ${this.record}`;
        this.checkGameOver();
        if(this.isGameHidden) this.gameBoard.classList.add('hidden');
        this.manageDisplay();
    }

    restartGame() {
        localStorage.removeItem('cards');
        localStorage.removeItem('matchedPairs');
        localStorage.removeItem('totalMoves');
        localStorage.removeItem('isGameHidden');
        this.resumeBtn.disabled = false;
        window.location.reload();
    }

    resumeGame() {
        this.isGameHidden = this.gameBoard.classList.toggle('hidden');
        this.manageDisplay();
        localStorage.setItem('isGameHidden', JSON.stringify(this.isGameHidden));

    }

    manageDisplay() {
        const gameHeading = document.querySelector('#gameHeading');
        const gameSkeleton = document.querySelectorAll('.skeleton-item');
        if (this.isGameHidden) {
            gameHeading.classList.remove('hidden');
            gameSkeleton.forEach(item => {
                item.classList.remove('hidden');
            })
            this.resumeBtn.textContent = 'Resume';
        }

        else {
            gameHeading.classList.add('hidden');
            gameSkeleton.forEach(item => {
                item.classList.add('hidden');
            })
            this.resumeBtn.textContent = 'Save and quit';
        }
    }

    
}
