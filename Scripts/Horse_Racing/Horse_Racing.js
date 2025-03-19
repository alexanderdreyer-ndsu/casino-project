const playBtn = document.querySelector("#play-btn");
const betMenu = document.querySelector("#bet-menu");
const betInputForm = document.querySelector("#bet-input-form");
const gameWindow = document.querySelector("#game");

const timeArr = ["5", "5.4", "5.6", "5.9", "6.3", "6.7", "6.8", "7", "7.3"];

playBtn.addEventListener("click", () => betMenu.showModal());

betInputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    betMenu.close();

    gameWindow.innerHTML = "";

    const lanes = document.querySelector("#lanes").value;
    const bet = document.querySelector("#bet").value;
    const betLane = document.querySelector("#on-lane").value;
    const allTimes = [...timeArr];

    for (let i = 0; i < lanes; i++) {
        const thisLane = document.createElement("div");
        thisLane.classList.add("lane");
        thisLane.id = `Lane ${i}`;
        gameWindow.appendChild(thisLane);

        const index = Math.floor(Math.random() * allTimes.length);

        const thisHorse = document.createElement("div");
        thisLane.appendChild(thisHorse);
        thisHorse.id = `Horse ${i}`;
        thisHorse.classList.add("horse");
        thisHorse.style.transition = `${allTimes[index]}s ease-in`;
        Promise.resolve();
        thisHorse.style.transform = `translateX(${thisLane.clientWidth}px)`;

        allTimes.splice(index, 1);
    }
});