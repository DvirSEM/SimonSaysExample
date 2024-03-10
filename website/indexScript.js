let scoreDiv = document.getElementsByClassName("score")[0];
let bestDiv = document.getElementsByClassName("best")[0];
let light = document.getElementsByClassName("light")[0];
let startButton = document.getElementsByClassName("startButton")[0];
let nameInput = document.getElementsByClassName("nameInput")[0];

let panelsHistory = [];
let historyI = 0;
let isRoundOngoing = false;
let score = 0;
let best = 0;

function startGame() {
  updateScore(0);
  startButton.disabled = true;
  startRound();
}

async function startRound() {
  panelsHistory.push(Math.floor(Math.random() * 4));
  historyI = 0;

  for (let i = 0; i < panelsHistory.length; i++) {
    await flash(panelsHistory[i], 200);
    await wait(100);
  }
}

async function flash(panel, ms) {
  light.style.display = "block";

  if (panel == 0) {
    light.style.left = "30%";
    light.style.top = "30%";
  }
  else if (panel == 1) {
    light.style.left = "70%";
    light.style.top = "30%";
  }
  else if (panel == 2) {
    light.style.left = "30%";
    light.style.top = "70%";
  }
  else if (panel == 3) {
    light.style.left = "70%";
    light.style.top = "70%";
  }

  await wait(ms);

  light.style.display = "none";
}

async function handlePanelClick(index) {
  if (isRoundOngoing) return;
  isRoundOngoing = true;

  if (index == panelsHistory[historyI]) {
    historyI++;
    await flash(index, 200);

    if (historyI == panelsHistory.length) {
      updateScore(score + 1);

      await wait(500);

      await startRound();
    }
  }
  else {

    let name = nameInput.value;
    if (name == null || name == "") {
      name = "Unknown";
    }

    let record = {
      Name: name,
      Score: score,
    };

    let recordJson = JSON.stringify(record);

    await fetch("/addRecord", {
      method: "POST",
      body: recordJson
    });

    historyI = 0;
    panelsHistory = [];
    for (let i = 0; i < 3; i++) {
      await flash(0, 50);
      await flash(1, 50);
      await flash(2, 50);
      await flash(3, 50);
    }
    startButton.disabled = false;
  }

  isRoundOngoing = false;
}

function updateScore(newScore) {
  score = newScore;
  scoreDiv.innerText = "Score: " + newScore;

  if (best < newScore) {
    best = newScore;
    bestDiv.innerText = "Best: " + best;
  }
}

async function wait(ms) {
  return await new Promise((resolve) => setTimeout(() => resolve(), ms));
}
