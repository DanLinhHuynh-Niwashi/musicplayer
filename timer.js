var timerHour = document.getElementById('timerHour');
var timerMinute = document.getElementById('timerMinute');
var timerSecond = document.getElementById('timerSecond');
var setTimerBtn = document.getElementById('setTimerBtn');

let timerId = null;
let countdownInterval = null;
let timerRunning = false;

function createOptions(selectElement, start, end) {
    for (let i = start; i <= end; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i.toString().padStart(2, '0');
        selectElement.appendChild(option);
    }
}

createOptions(timerHour, 0, 23);
createOptions(timerMinute, 0, 59);
createOptions(timerSecond, 0, 59);

function setInputsDisabled(disabled) {
    timerHour.disabled = disabled;
    timerMinute.disabled = disabled;
    timerSecond.disabled = disabled;
}

function resetTimer() {
    if (timerId) clearTimeout(timerId);
    if (countdownInterval) clearInterval(countdownInterval);
    timerId = null;
    countdownInterval = null;
    timerRunning = false;

    setInputsDisabled(false);
    setTimerBtn.textContent = 'Set Timer';
}

setTimerBtn.addEventListener('click', () => {
    if (timerRunning) {
        resetTimer();
        return;
    }

    const h = parseInt(timerHour.value, 10);
    const m = parseInt(timerMinute.value, 10);
    const s = parseInt(timerSecond.value, 10);

    const totalSeconds = h * 3600 + m * 60 + s;

    if (isNaN(totalSeconds) || totalSeconds <= 0) {
        alert('Time must > 0');
        return;
    }

    resetTimer();

    let remainingTime = totalSeconds;
    timerRunning = true;
    setInputsDisabled(true);
    setTimerBtn.textContent = 'Cancel Timer';

    function updateStatus() {
        const hrs = Math.floor(remainingTime / 3600);
        const mins = Math.floor((remainingTime % 3600) / 60);
        const secs = remainingTime % 60;

        timerHour.value = hrs.toString();
        timerMinute.value = mins.toString();
        timerSecond.value = secs.toString();
    }

    updateStatus();

    countdownInterval = setInterval(() => {
        remainingTime--;
        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
        }
        updateStatus();
    }, 1000);

    timerId = setTimeout(() => {
        const audio = document.getElementById('audio');
        audio.pause();
        alert('Music stopped!');
        resetTimer();
        updatePlayBtn();
    }, totalSeconds * 1000);
});
