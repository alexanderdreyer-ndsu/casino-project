const cells = document.getElementsByTagName("td");
const chips = document.getElementsByClassName("chips");
const spinButton = document.getElementById("spin");
const balanceDisplay = document.getElementById("balance-output");
const clearBetButton = document.getElementById("clear-bet");
const spinOutput = document.getElementById("spinOutput");
const spinOutputDiv = document.getElementById("spinOutputDiv");
let previousNumbersDisplay = document.getElementById("previous-numbers");
let currentBets = document.getElementById("current-bets-paragraph");
let timer = document.getElementById("timer");
let betsAvailableLabel = document.getElementById("bets-available-label");

const validStrings = ["first12", "second12", "third12", "evens", "odds", "red", "black", "high", "low"];

let chipSize = 0;
let thisBet = 0;
let balance = 100;
let userBets = new Map();
let timeUntilSpin = 25;
let betsClosed;

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
        } else if (item === "first12" && spin >= 1 && spin <= 12) {
            payout += inputMap.get(item) * 3;
        } else if (item === "second12" && spin >= 13 && spin <= 24) {
            payout += inputMap.get(item) * 3;
        } else if (item === "third12" && spin >= 25 && spin <= 36) {
            payout += inputMap.get(item) * 3;
        } else if (item === "evens" && spin % 2 === 0) {
            payout += inputMap.get(item) * 2;
        } else if (item === "odds" && spin % 2 !== 0) {
            payout += inputMap.get(item) * 2;
        } else if (item === "red" && color == "Red") {
            payout += inputMap.get(item) * 2;
        } else if (item === "black" && color == "Black") {
            payout += inputMap.get(item) * 2;
        } else if (item === "high" && spin > 18) {
            payout += inputMap.get(item) * 2;
        } else if (item === "low" && spin <= 18) {
            payout += inputMap.get(item) * 2;
        }
    }

    return payout;
}

function spin() {
    let spinNumberAndColor = generateSpin();

    for (let cell of cells) {
        if (parseInt(cell.id) === spinNumberAndColor[0]) {
            cell.style.animation = "none";
            void cell.offsetWidth;
            cell.style.animation = "flash 1.5s ease-in-out";
        } else if (cell.id === "zero" && spinNumberAndColor[0] === 0) {
            cell.style.animation = "none";
            void cell.offsetWidth;
            cell.style.animation = "flash 1.5s ease-in-out";
        }
    }

    let winnings = payout(userBets, spinNumberAndColor[0], spinNumberAndColor[1]);
    balance += winnings;
    userBets.clear();
    balanceDisplay.innerText = balance;
    thisBet = 0;
    currentBets.innerText = "";
}

function updateTimer() {
    if (timeUntilSpin === 0) {
        spin();
        timeUntilSpin = 24;
    } else {
        timeUntilSpin--;
    }

    betsClosed = timeUntilSpin <= 10;
    const statusText = betsClosed ? "Bets Closed" : "Bets Open";
    betsAvailableLabel.innerText = statusText;
    timer.innerText = timeUntilSpin;
}

function clearBet() {
    userBets.clear();

    balance += thisBet;
    balanceDisplay.innerText = balance;

    thisBet = 0;

    currentBets.innerText = "";
}

function addBet(cell) {
    const balanceLessThanChipSize = balance < chipSize;

    if (balanceLessThanChipSize) {
        window.alert("Insufficient funds!");
    } else if (userBets.has(cell.id)) {
        let currentBet = userBets.get(cell.id);
        userBets.set(cell.id, currentBet + chipSize);

        balance -= chipSize;
        thisBet += chipSize;
    } else if (!userBets.has(cell.id)) {
        userBets.set(cell.id, chipSize);

        balance -= chipSize;
        thisBet += chipSize;
    }

    if (chipSize !== 0 && !balanceLessThanChipSize) currentBets.innerText += "\n" + cell.id + " x $" + chipSize.toString();

    balanceDisplay.innerText = balance;
}

function selectChip(chip) {
    for (let chipResetColor of chips) {
        chipResetColor.style.border = "none";
    }

    chipSize = parseInt(chip.id);
    chip.style.border = "3px solid";
}

function main() {
    balanceDisplay.innerText = balance;

    for (let i = 0; i < 37; i++) {
        validStrings.push(i.toString());
        
        if (i < 10) generateSpin();
    }

    for (let cell of cells) {
        cell.addEventListener("click", () => {
            if(!betsClosed) addBet(cell);
        });
    }

    for (let chip of chips) {
        chip.addEventListener("click", () => {
            selectChip(chip);
        });
    }

    clearBetButton.addEventListener("click", clearBet);

    setInterval(updateTimer, 1000);
}

main();