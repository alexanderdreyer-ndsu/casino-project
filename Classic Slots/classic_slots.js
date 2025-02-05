const spinbtn = document.getElementById("spinBtn");
const bettingBtns = document.getElementsByClassName("bettingBtns");
const balanceOutput = document.getElementById("balance-output");
const betDisplay = document.getElementById("betDisplay");
const prevWinDisplay = document.getElementById("prevWinDisplay");
const outputTableContainer = document.getElementById("output-table-container")

let balance = 100;
let bet = 0;

balanceOutput.innerText = balance.toFixed(2);
betDisplay.innerText = bet.toFixed(2);

function generateSpin() {
    const objects = ['🍒', '🍋', '💎', '7️⃣', '🍇'];
    let spunRow = [];

    for (let i = 0; i < 3; i++) {
        let spin = Math.floor(Math.random() * objects.length);

        spunRow.push(objects[spin]);
    }

    return spunRow;
}

function printColumns(i, spunRow) {
    const gameColumn = document.createElement("h1");
    outputTableContainer.appendChild(gameColumn);
    gameColumn.innerText = spunRow[i];
    gameColumn.className = "column slideInTop";
}

function printSpin(spunRow) {
    outputTableContainer.innerText = "";
    const columnDelayInMilliseconds = 625;

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            printColumns(i, spunRow);
        }, i * columnDelayInMilliseconds);
    }
}

function populateTable() {
    const initRow = generateSpin();

    for (let i = 0; i < 3; i++) {
        printColumns(i, initRow);
    }
}

function compareArrays(winningRows, spunRow) {
    const sortFirst = winningRows.sort();
    const sortSecond = spunRow.sort();

    return sortFirst.every((value, index) => value === sortSecond[index]);
}

function payout(spunRow, bet) {
    const allDiamond = ['💎', '💎', '💎'];
    const allCherries = ['🍒', '🍒', '🍒'];
    const allSevens = ['7️⃣', '7️⃣', '7️⃣'];
    const allLemons = ['🍋', '🍋', '🍋'];
    const allGrapes = ['🍇', '🍇', '🍇'];
    const twoSevensDiamond = ['7️⃣', '💎', '7️⃣'];
    const allFruit = ['🍒', '🍋', '🍇'];
    const twoDiamondsSeven = ['💎', '7️⃣', '💎'];

    const winningRows = new Map();
    winningRows.set(allDiamond, 30);
    winningRows.set(allSevens, 7);
    winningRows.set(allCherries, 5);
    winningRows.set(allLemons, 3);
    winningRows.set(allGrapes, 3);
    winningRows.set(twoSevensDiamond, 5);
    winningRows.set(allFruit, 5);
    winningRows.set(twoDiamondsSeven, 7);

    let payoutAmount = 0;

    for (let row of winningRows.keys()) {
        if (compareArrays(row, spunRow)) {
            payoutAmount += bet * winningRows.get(row);
        }
    }

    return payoutAmount;
}

function spin() {
    spinbtn.disabled = true;

    balance -= bet;
    balanceOutput.innerText = balance.toFixed(2);

    const spunObjects = generateSpin();
    const delayUntilNextSpinMilliseconds = 2200;

    setTimeout(() => {
        spinbtn.disabled = false;
    }, delayUntilNextSpinMilliseconds);

    printSpin(spunObjects);

    setTimeout(() => {
        const payoutAmount = payout(spunObjects, bet);
        balance += payoutAmount;

        balanceOutput.innerText = balance.toFixed(2);
        prevWinDisplay.innerText = payoutAmount.toFixed(2);
    }, delayUntilNextSpinMilliseconds);
}

function main() {
    populateTable();

    const maxBet = 25;

    const buttonIncrement = 1;

    for (let btn of bettingBtns) {
        btn.addEventListener("click", () => {
            if (btn.id === "max-bet-btn") {
                bet = maxBet;
            } else {
                btn.id === "add" ? bet += buttonIncrement : bet -= buttonIncrement;
            }
            
            if (bet < 0) bet = 0;
            
            if (bet > maxBet) bet = maxBet;

            betDisplay.innerText = "$" + bet.toFixed(2);
        });
    }

    spinbtn.addEventListener("click", () => {
        if (balance - bet < 0) {
            return window.alert("Insufficient Funds");
        }

        if (bet > 0) spin();
    });
}

main();


//EV calculation - currently ~ 0.90
function calculateExpectedValue(amountOfSpins) {
    let amountWagered = 0;
    let bet = 1;
    let totalPayout = 0;

    for (let i = 0; i < amountOfSpins; i++) {
        amountWagered += bet;
        totalPayout += payout(generateSpin(), bet);
    }

    console.log(`EV: ${totalPayout / amountWagered}`);
}

// calculateExpectedValue(100000);