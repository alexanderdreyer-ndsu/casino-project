const spinbtn = document.getElementById("spinBtn");
const bettingBtns = document.getElementsByClassName("bettingBtns");
const balanceOutput = document.getElementById("balance-output");
const betDisplay = document.getElementById("betDisplay");
const prevWinDisplay = document.getElementById("prevWinDisplay");
const outputTable = document.getElementById("outputTable").getElementsByTagName('tbody')[0];

let balance = 500;
let bet = 0;
let biggestWin = 0;

balanceOutput.innerText = balance;
betDisplay.innerText = bet;
prevWinDisplay.innerText = biggestWin;

function generateSpin() {
    const objects = ['🏆', '💰', '🍊', '🍒', '💎', '🔔', '👑', '💸', '🧨', '🍉', '🍌', '🍀', '🍇', '♥', '🍎', '💤', '💲'];
    let spunObjects = [];

    for (let i = 0; i < 15; i++) {
        let spin = Math.floor(Math.random() * 17);

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

    newCell.className = "outputCells";
    newCell2.className = "outputCells";
    newCell3.className = "outputCells";

    newCell.innerText = listOfSpunObjects[iterator];
    newCell2.innerText = listOfSpunObjects[iterator + 5];
    newCell3.innerText = listOfSpunObjects[iterator + 10];
}

function printSpin(spunObjects) {
    outputTable.innerText = "";

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            printColumn(i, spunObjects);
        }, i * 1000);
    }
}

function populateTable() {
    const defaultItems = generateSpin();

    for (let i = 0; i < 5; i++) {
        printColumn(i, defaultItems);
    }
}

function payout(spunObjects, bet) {
    let payoutAmount = 0;

    const multiplier = 1.75;
    const amountOfOccurrancesToWin = 4;

    const occurrances = new Map();
    
    for (let item of spunObjects) {
        occurrances.has(item) ? occurrances.set(item, occurrances.get(item) + 1) : occurrances.set(item, 1);
    }

    for (let [item, count] of occurrances.entries()) {
        if (count >= amountOfOccurrancesToWin) payoutAmount += bet * (count * multiplier);
    }
    
    return { payoutAmount, occurranceMap: occurrances };
}

function spin() {
    spinbtn.disabled = true;

    balance -= bet;
    balanceOutput.innerText = balance.toString();

    const spunObjects = generateSpin();

    const { payoutAmount, occurranceMap: occurrances } = payout(spunObjects, bet);

    if ((balance - bet) < 0) {
        bet = 0;

        betDisplay.innerText = bet.toString();

        window.alert("Insufficient Funds");
    }

    if (payoutAmount > biggestWin) biggestWin = payoutAmount;

    setTimeout(() => {
        spinbtn.disabled = false;
    }, 5500);

    printSpin(spunObjects);

    setTimeout(() => {
        balance += payoutAmount;
        console.log(balance)
        console.log(payoutAmount)
        balanceOutput.innerText = balance.toString();
        prevWinDisplay.innerText = biggestWin.toString();
    }, 5500);
} 

function main() {
    populateTable();

    for (let btn of bettingBtns) {
        btn.addEventListener("click", () => {
            if (btn.id === "maxBetBtn") {
                bet = 50;
            } else {
                btn.id === "add" ? bet += 5 : bet -= 5;
            }
            
            if (bet < 0) bet = 0;
            
            if (bet > 100) bet = 100;

            betDisplay.innerText = bet;
        });
    }

    spinbtn.addEventListener("click", () => {
        if (bet > 0) spin();
    });
}

main();