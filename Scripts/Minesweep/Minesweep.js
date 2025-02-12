"use strict";
const balanceDisplay = document.querySelector("#balance-output");
let balance = 100;
balanceDisplay.textContent = balance.toFixed(2);
cashout.disabled = true;

document.querySelector("#game-controlls").addEventListener("submit", (event) => {
    event.preventDefault();
    const submit = document.querySelector("#submit-btn");
    const cashout = document.querySelector("#cashout");
    const bet = document.querySelector("#input").value;
    const bombs = document.querySelector("#bomb-count").value;
    const cells = document.querySelectorAll(".cell");
    const multiplierHeader = document.querySelector("#multiplier-header");
    submit.disabled = true;
    balance -= bet;
    balanceDisplay.textContent = balance.toFixed(2);
    multiplierHeader.textContent = "Multiplier 0x";
    let payoutMultiplier = 0;
    let j = 1;

    cells.forEach(cell => {
        cell.dataset.containsBomb = "0";
        cell.textContent = "";
        cell.className = "cell";
    });

    const openBoxes = [];
    for (let i = 0; i < 25; i++) openBoxes.push(i);

    for (let i = 0; i < bombs; i++) {
        const index = Math.floor(Math.random() * openBoxes.length);
        cells[openBoxes[index]].dataset.containsBomb = "1";
        openBoxes.splice(index, 1);
    }

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (cell.dataset.containsBomb === "1") {
                multiplierHeader.textContent = "Multiplier 0x";
                return gameOver();
            }

            cashout.disabled = false;
            cell.classList.add("flipped-safe");
            payoutMultiplier = j++ * (bombs / 25);
            multiplierHeader.textContent = `Multiplier ${payoutMultiplier.toFixed(2)}x`;
        });
    });

    cashout.addEventListener("click", () => {
        balance += bet * payoutMultiplier;
        gameOver();
    });

    function gameOver() {
        cells.forEach(cell => {
            cell.classList.add(`${cell.dataset.containsBomb === "1" ? "flipped-bomb" : "flipped-safe"}`);
            if (cell.classList.contains("flipped-bomb")) cell.textContent = "💣";
        });

        balanceDisplay.textContent = balance.toFixed(2);
        submit.disabled = false;
        cashout.disabled = true;
    }
});