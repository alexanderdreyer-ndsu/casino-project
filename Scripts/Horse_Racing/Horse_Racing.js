const playBtn = document.querySelector("#play-btn");
const betMenu = document.querySelector("#bet-menu");
const betInputForm = document.querySelector("#bet-input-form");
const gameWindow = document.querySelector("#game");
const balanceDisplay = document.querySelector("#balance-output");
const timeArr = [
    "5.1", 
    "5.4", 
    "5.5", 
    "5.6", 
    "5.9", 
    "6.1", 
    "6.3", 
    "6.5", 
    "6.7", 
    "6.8", 
    "7.0", 
    "7.3"
];

let balance = 100;
balanceDisplay.textContent = balance.toFixed(2);

playBtn.addEventListener("click", () => betMenu.showModal());

betInputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    betMenu.close();

    const lanes = document.querySelector("#lanes").value;
    const bet = document.querySelector("#bet").value;
    const betLane = document.querySelector("#on-lane").value;

    if (balance - bet < 0) {
        return window.alert("Bet Amount Rejected");
    }

    gameWindow.innerHTML = "";

    const allTimes = [...timeArr];

    for (let i = 0; i < lanes; i++) {
        const thisLane = document.createElement("div");
        thisLane.classList.add("lane");
        thisLane.id = `Lane ${i + 1}`;
        gameWindow.appendChild(thisLane);

        const time = allTimes[Math.floor(Math.random() * allTimes.length)];

        const thisHorse = document.createElement("div");
        thisLane.appendChild(thisHorse);
        thisHorse.id = `Horse ${i + 1}`;
        thisHorse.classList.add("horse");
        thisHorse.style.transition = `${time}s ease-in`;
        thisHorse.dataset.time = `${time}`;
        Promise.resolve();
        thisHorse.style.transform = `translateX(${thisLane.clientWidth}px)`;

        allTimes.splice(allTimes.indexOf(time), 1);
    }

    let slowestTime = 0;
    let fastestTime = 10;
    let fastestHorse;

    document.querySelectorAll(".horse").forEach(horse => {
        const thisHorseTime = parseFloat(horse.dataset.time);

        if (thisHorseTime < fastestTime) {
            fastestTime = thisHorseTime;
            fastestHorse = horse;
        }

        if (thisHorseTime > slowestTime) {
            slowestTime = thisHorseTime;
        }
    });

    if (`Lane ${betLane}` === fastestHorse.parentElement.id) {
        balance += bet * lanes;
    } else {
        balance -= bet;
    }

    setTimeout(() => {
        balanceDisplay.textContent = balance.toFixed(2);
    }, slowestTime * 1000);

});