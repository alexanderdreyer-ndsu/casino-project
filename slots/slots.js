const spinbtn = document.getElementById("spinBtn");
const bettingBtns = document.getElementsByClassName("bettingBtns");
const balanceOutput = document.getElementById("balance-output");
const betDisplay = document.getElementById("betDisplay");
const prevWinDisplay = document.getElementById("prevWinDisplay");
const outputTable = document.getElementById("outputTable").getElementsByTagName('tbody')[0];

let balance = 500;
let bet = 0;

balanceOutput.innerText = balance;
betDisplay.innerText = bet;

function generateSpin() {
    const objects = ['🏆', '💰', '🍊', '🍒', '💎', '🔔', '👑', '💸', '🧨', '🍉', '🍌', '🍀', '🍇', '🍎', '💲', '🥝', '❤️', '🎰', '🎲'];
    let spunObjects = [];

    for (let i = 0; i < 15; i++) {
        let spin = Math.floor(Math.random() * objects.length);

        spunObjects.push(objects[spin]);
    }

    return spunObjects;
}

function printColumn(iterator, listOfSpunObjects) {
    let firstOutputRow = outputTable.rows[0] || outputTable.insertRow();
    let secondOutputRow = outputTable.rows[1] || outputTable.insertRow();
    let thirdOutputRow = outputTable.rows[2] || outputTable.insertRow();

    const newCell = firstOutputRow.insertCell(iterator);
    const newCell2 = secondOutputRow.insertCell(iterator);
    const newCell3 = thirdOutputRow.insertCell(iterator);

    newCell.className = "outputCells slideInTop";
    newCell2.className = "outputCells slideInTop";
    newCell3.className = "outputCells slideInTop";

    newCell.innerText = listOfSpunObjects[iterator];
    newCell2.innerText = listOfSpunObjects[iterator + 5];
    newCell3.innerText = listOfSpunObjects[iterator + 10];
}

function printSpin(spunObjects) {
    outputTable.innerText = "";

    const columnDelayInMilliseconds = 750;

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            printColumn(i, spunObjects);
        }, i * columnDelayInMilliseconds);
    }
}

function populateTable() {
    const defaultItems = generateSpin();

    for (let i = 0; i < 5; i++) {
        printColumn(i, defaultItems);
    }
}

function payout(spunObjects, bet) {
    const cells = document.getElementsByClassName("outputCells");

    let payoutAmount = 0;
    let multiplier = 0.3;
    const amountOfOccurrancesToWin = 3;
    const occurrances = new Map();
    
    for (let item of spunObjects) {
        occurrances.has(item) ? occurrances.set(item, occurrances.get(item) + 1) : occurrances.set(item, 1);
    }

    for (let [item, count] of occurrances.entries()) {
        if (count >= amountOfOccurrancesToWin) payoutAmount += bet * (count * multiplier);
    }

    for (let cell of cells) {
        if (occurrances.get(cell.innerHTML.trim()) >= amountOfOccurrancesToWin) {
            cell.className = "outputCells flashForWin";
        }
    }

    return payoutAmount;
}

function spin() {
    spinbtn.disabled = true;

    balance -= bet;
    balanceOutput.innerText = balance.toFixed(2);

    const spunObjects = generateSpin();

    if ((balance - bet) < 0) {
        bet = 0;

        betDisplay.innerText = bet.toString();

        window.alert("Insufficient Funds");
    }

    setTimeout(() => {
        spinbtn.disabled = false;
    }, 4000);

    printSpin(spunObjects);

    setTimeout(() => {
        const payoutAmount = payout(spunObjects, bet);
        balance += payoutAmount;

        balanceOutput.innerText = balance.toFixed(2);
        prevWinDisplay.innerText = payoutAmount.toFixed(2);
    }, 4000);
}

function main() {
    populateTable();

    const maxBet = 50;

    const buttonIncrement = 5;

    for (let btn of bettingBtns) {
        btn.addEventListener("click", () => {
            if (btn.id === "max-bet-btn") {
                bet = maxBet;
            } else {
                btn.id === "add" ? bet += buttonIncrement : bet -= buttonIncrement;
            }
            
            if (bet < 0) bet = 0;
            
            if (bet > maxBet) bet = maxBet;

            betDisplay.innerText = "$" + bet;
        });
    }

    spinbtn.addEventListener("click", () => {
        if (bet > 0) spin();
    });
}

main();