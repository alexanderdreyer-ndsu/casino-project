const spinbtn = document.querySelector("#spinBtn");
const bettingBtns = document.querySelectorAll(".bettingBtns");
const balanceOutput = document.querySelector("#balance-output");
const betDisplay = document.querySelector("#betDisplay");
const prevWinDisplay = document.querySelector("#prevWinDisplay");
const doors = document.querySelectorAll(".door");

let balance = 100;
let bet = 0;

balanceOutput.textContent = balance.toFixed(2);
betDisplay.textContent = bet.toFixed(2);

function generateSpin() {
    const objects = ['🍍', '💰', '🍊', '🍒', '💎', '🍓', '👑', '🔪', '🌴', '🍉', '🍌', '🏺', '🍇', '🍎', '🧊', '🥝', '❤️', '🐱‍👤'];
    let spunObjects = [];

    for (let i = 0; i < 15; i++) {
        let spin = Math.floor(Math.random() * objects.length);

        spunObjects.push(objects[spin]);
    }

    return spunObjects;
}

async function printSpin(listOfSpunObjects) {
    let i = 0;
    let j = 0;

    for (const door of doors) {
        if (door.children.length !== 0) {
            const currentBoxes = door.children[0];
            currentBoxes.style.transform = `translateY(${door.clientHeight + 100}px)`;
            currentBoxes.addEventListener("transitionend", () => {
                door.removeChild(currentBoxes);
            });
            await new Promise((resolve) => setTimeout(resolve, j + 550));
        }

        const boxes = document.createElement("div");
        boxes.style.transition = "0.5s ease-in-out";
        boxes.className = "boxes slideInTop";

        for (let n = 0; n < 3; n++) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.textContent = listOfSpunObjects[i++];
            boxes.appendChild(box);
        }

        door.appendChild(boxes);
    }
}

function payout(spunObjects, bet) {
    let payoutAmount = 0;
    let multiplier = 0.334;
    const amountOfOccurrancesToWin = 3;
    const occurrances = new Map();

    for (let item of spunObjects) {
        occurrances.has(item) ? occurrances.set(item, occurrances.get(item) + 1) : occurrances.set(item, 1);
    }

    for (let [item, count] of occurrances.entries()) {
        if (item === '💎' && count >= amountOfOccurrancesToWin) multiplier = 0.5;
        if (count >= amountOfOccurrancesToWin) payoutAmount += bet * (count * multiplier);
    }

    const boxes = document.querySelectorAll(".box");
    for (let box of boxes) {
        if (occurrances.get(box.textContent) >= amountOfOccurrancesToWin) {
            box.classList.add("flashForWin");
        }
    }

    return payoutAmount;
}

async function spin() {
    spinbtn.disabled = true;
    balance -= bet;
    balanceOutput.textContent = balance.toFixed(2);
    const spunObjects = generateSpin();
    printSpin(spunObjects);
    await new Promise((resolve) => setTimeout(resolve, 3800));
    spinbtn.disabled = false;
    const payoutAmount = payout(spunObjects, bet);
    balance += payoutAmount;
    balanceOutput.textContent = balance.toFixed(2);
    prevWinDisplay.textContent = payoutAmount.toFixed(2);
}

async function main() {
    const initRow = generateSpin();
    printSpin(initRow);
    const maxBet = 50;
    const buttonIncrement = 2;

    for (let btn of bettingBtns) {
        btn.addEventListener("click", () => {
            if (btn.id === "max-bet-btn") {
                bet = maxBet;
            } else {
                btn.id === "add" ? bet += buttonIncrement : bet -= buttonIncrement;
            }

            if (bet < 0) bet = 0;

            if (bet > maxBet) bet = maxBet;

            betDisplay.textContent = "$" + bet.toFixed(2);
        });
    }

    await new Promise ((resolve) => setTimeout(resolve, 1000));
    spinbtn.addEventListener("click", () => {
        if (bet > 0 && balance - bet >= 0) spin();
    });
}

main();

//EV calculation - currently ~ 0.93
function calculateExpectedValue(amountOfSpins) {
    let amountWagered = 0;
    let bet = 5;
    let totalPayout = 0;

    for (let i = 0; i < amountOfSpins; i++) {
        amountWagered += bet;
        totalPayout += payout(generateSpin(), bet);
    }

    console.log(`EV: ${totalPayout / amountWagered}`);
}

// calculateExpectedValue(100000);