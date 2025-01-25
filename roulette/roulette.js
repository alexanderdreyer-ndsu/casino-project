const cells = document.getElementsByTagName("td");
const chips = document.getElementsByClassName("chips");
const spinButton = document.getElementById("spin");
const balanceDisplay = document.getElementById("balance-output");
const clearBetButton = document.getElementById("clear-bet");
const spinOutput = document.getElementById("spinOutput");
const spinOutputDiv = document.getElementById("spinOutputDiv");
let previousNumbersDisplay = document.getElementById("previous-numbers");
let timer = document.getElementById("timer");
let betsAvailableLabel = document.getElementById("bets-available-label");

const validStrings = ["1/12", "2/12", "3/12", "Evens", "Odds", "Red", "Black", "High", "Low"];

let chipSize = 0;
let thisBet = 0;
let balance = 100;
let timeUntilSpin = 30;
let betsClosed;
let userBets = new Map();

function generateSpin() {
    const spin = Math.floor(Math.random() * 37);
    let color;

    if (spin === 0) {
        color = "limegreen";
    } else if (spin % 2 === 0) {
        color = (spin >= 1 && spin <= 10) || (spin >= 19 && spin <= 28) ? "Black" : "Red";
    } else if (spin % 2 === 1) {
        color = (spin >= 11 && spin <= 18) || (spin >= 29 && spin <= 36) ? "Black" : "Red";
    }

    addToPreviousSpins(spin, color);

    return [spin, color];
}

function addToPreviousSpins(num, color) {
    const newNumber = document.createElement("div");
    const newNumberText = document.createElement("h1");

    const numberOfElements = previousNumbersDisplay.children.length;

    if (numberOfElements === 10) {
        previousNumbersDisplay.removeChild(previousNumbersDisplay.lastChild);
    }

    newNumber.classList.add("spin-output");
    newNumber.appendChild(newNumberText);

    newNumberText.innerText = num;

    newNumber.style.backgroundColor = color.toLowerCase().toString();

    previousNumbersDisplay.insertBefore(newNumber, previousNumbersDisplay.firstChild);
}

function payout(inputMap, spin, color) {
    let payout = 0;

    for (let item of inputMap.keys()) {
        if (item === spin.toString()) {
            payout += inputMap.get(item) * 36;
        } else if (item === "1/12" && spin >= 1 && spin <= 12) {
            payout += inputMap.get(item) * 3;
        } else if (item === "2/12" && spin >= 13 && spin <= 24) {
            payout += inputMap.get(item) * 3;
        } else if (item === "3/12" && spin >= 25 && spin <= 36) {
            payout += inputMap.get(item) * 3;
        } else if (item === "Evens" && spin % 2 === 0) {
            payout += inputMap.get(item) * 2;
        } else if (item === "Odds" && spin % 2 !== 0) {
            payout += inputMap.get(item) * 2;
        } else if (item === "19 to 36" && spin <= 18) {
            payout += inputMap.get(item) * 2;
        } else if (item === color) {
            payout += inputMap.get(item) * 2;
        }
    }

    return payout;
}

function spin() {
    let spinNumberAndColor = generateSpin();

    const gameCells = document.getElementsByClassName("game-cell")

    for (let cell of gameCells) {
        if (parseInt(cell.id) === spinNumberAndColor[0]) {
            cell.style.animation = "none";
            void cell.offsetWidth;
            cell.style.animation = "flash 1.5s linear";
        }
    }

    let winnings = payout(userBets, spinNumberAndColor[0], spinNumberAndColor[1]);
    balance += winnings;
    userBets.clear();
    balanceDisplay.innerText = balance;
    thisBet = 0;

    clearBet();
}

function updateTimer() {
    if (timeUntilSpin === 0) {
        spin();
        timeUntilSpin = 29;
    } else {
        timeUntilSpin--;
    }

    betsClosed = timeUntilSpin <= 10;
    betsAvailableLabel.innerText = betsClosed ? "Bets Closed" : "Bets Open";

    timer.innerText = timeUntilSpin;
}

function clearBet() {
    userBets.clear();

    balance += thisBet;
    balanceDisplay.innerText = balance;

    thisBet = 0;

    for (let cell of cells) {
        while (cell.hasChildNodes()) {
            cell.removeChild(cell.firstChild);
        }
        
        cell.innerText = cell.id;
    }
}

function addBet(cell) {
    if (balance < chipSize) {
        return window.alert("Insufficient funds");
    }

    const isCellAlreadyInUserBets = userBets.has(cell.id);

    const chipToBeDisplayed = document.createElement("button");
    chipToBeDisplayed.className = "chips-on-board";

    if (isCellAlreadyInUserBets) {
        const currentBetOnThisCell = userBets.get(cell.id);

        const updatedChip = document.createElement("button");
        updatedChip.className = "chips-on-board";
        updatedChip.innerText = currentBetOnThisCell + chipSize;

        userBets.set(cell.id, currentBetOnThisCell + chipSize);

        balance -= chipSize;
        thisBet += chipSize;

        cell.innerHTML = "";
        cell.appendChild(updatedChip);
    } else {
        userBets.set(cell.id, chipSize);

        balance -= chipSize;
        thisBet += chipSize;

        cell.innerHTML = "";
        chipToBeDisplayed.innerText = chipSize;
        cell.appendChild(chipToBeDisplayed);
    }

    balanceDisplay.innerText = balance;
}

function main() {
    balanceDisplay.innerText = balance;

    for (let i = 0; i < 37; i++) {
        validStrings.push(i.toString());
        
        if (i < 10) generateSpin();
    }

    for (let cell of cells) {
        cell.addEventListener("click", () => {
            if (!betsClosed && chipSize > 0) addBet(cell);
        });
    }

    for (let chip of chips) {
        chip.addEventListener("click", () => {
            for (let chipResetColor of chips) chipResetColor.style.border = "none";
            
            chipSize = parseInt(chip.id);
            chip.style.border = "3px solid";
        });
    }

    clearBetButton.addEventListener("click", clearBet);

    setInterval(updateTimer, 1000);
}

main();