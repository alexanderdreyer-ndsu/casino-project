function spin() {
    const objects = ['🏆', '💰', '🍊', '🍒', '💎', '🔔', '👑', '💸', '🧨', '🍉'];
    let spunObjects = [];

    for (let i = 0; i < 5; i++) {
        let spin = Math.floor(Math.random() * 10);
        spunObjects.push(objects[spin]);
    }

    return spunObjects;
}

function printSpin(spunObjects) {
    const outputTable = document.getElementById("outputTable").getElementsByTagName('tbody')[0];
    outputTable.innerText = "";

    let outputRow = outputTable.insertRow();

    for (let i = 0; i < spunObjects.length; i++) {
        const newCell = outputRow.insertCell(i);
        newCell.className = "outputCells";

        setTimeout( () => {
            newCell.innerText = spunObjects[i];
        }, 1000);
    }
}

function payout(spunObjects, bet) {
    let payoutAmount = 0;

    const occurrances = new Map();
    
    for (let item of spunObjects) {
        if (occurrances.has(item)) {
            occurrances.set(item, occurrances.get(item) + 1);
        }
        else {
            occurrances.set(item, 1);
        }
    }

    for (let [item, count] of occurrances.entries()) {
        if (count > 2) {
            payoutAmount += bet * (count * 3);
        }
    }
    
    return { payoutAmount, occurranceMap: occurrances };
}

function main() {
    const spinbtn = document.getElementById("spinBtn");
    const bettingBtns = document.getElementsByClassName("bettingBtns");
    const balanceOutput = document.getElementById("balanceOutput");
    const betDisplay = document.getElementById("betDisplay");
    const prevWinDisplay = document.getElementById("prevWinDisplay");

    let balance = 500;
    let bet = 0;
    let biggestWin = 0;

    balanceOutput.innerText = balance;
    betDisplay.innerText = bet;
    prevWinDisplay.innerText = biggestWin;

    for (let btn of bettingBtns) {
        btn.addEventListener("click", () => {
            bet += parseInt(btn.id);

            if (btn.id === "maxBetBtn") {
                bet = 100;
            } else if (bet < 0) {
                bet = 0;
            } else if (bet > 100) {
                bet = 100;
            }

            betDisplay.innerText = bet;
        });
    }

    spinbtn.addEventListener("click", () => {
        const cells = document.getElementsByClassName("outputCells");
        spinbtn.disabled = true;
        const spunObjects = spin();

        if ((balance - bet) < 0) {
            bet = 0;
            betDisplay.innerText = bet.toString();
            window.alert("Insufficient Funds");
        }

        const { payoutAmount, occurranceMap: occurrances } = payout(spunObjects, bet);

        if (payoutAmount > biggestWin) {
            biggestWin = payoutAmount;
        }

        setTimeout(() => {
            spinbtn.disabled = false;
        }, 1500);

        balance -= bet;
        printSpin(spunObjects);

        setTimeout(() => {
            balance += payoutAmount;
            balanceOutput.innerText = balance.toString();
            prevWinDisplay.innerText = biggestWin.toString();
        }, 1000);
    });
}

main();