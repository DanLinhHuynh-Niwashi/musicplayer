// === DOM References ===
const audio = document.getElementById("audio");
const songTitle = document.getElementById("song-title");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const resetBtn = document.getElementById("clear");
const addAllBtn = document.getElementById("add");

const progressBar = document.getElementById("progress-bar");
const playlistEl = document.getElementById("playlist");
const songlistEl = document.getElementById("songlist");
const volumeSlider = document.getElementById("volume");

let currentIndex = -1;

const initSongs = [
    { title: "Lá Diêu Bông", src: "music/ladieubong.mp3" },
    { title: "Trống cơm", src: "music/trongcom.wav" },
    { title: "Gặp nhau giữa rừng mơ", src: "music/gapnhaugiuarungmo.mp3" },
];

let songs = initSongs.map(song => ({ ...song }));

// === Core Player Functions ===

function loadSong() {
    if (currentIndex < 0) return;
    const song = songs[currentIndex];
    audio.src = song.src;
    songTitle.textContent = song.title;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
    highlightActive(currentIndex);
}

function updatePlayBtn() {
    playBtn.innerHTML = audio.paused
        ? '<i class="bi bi-play-fill"></i> Play'
        : '<i class="bi bi-pause-fill"></i> Stop';
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60) || 0;
    const s = Math.floor(seconds % 60) || 0;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function highlightActive(index) {
    const items = playlistEl.querySelectorAll("li");
    items.forEach((item, i) =>
        item.classList.toggle("active", i === index)
    );
}

function findIndex(currentSong) {
    currentIndex = songs.findIndex(song => song.src === currentSong.src);
}

function shuffleArray(arr) {
    return arr
        .map(item => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
}

// === Event Handlers ===

playBtn.addEventListener("click", () => {
    if (currentIndex < 0) return;
    audio.paused ? audio.play() : audio.pause();
    updatePlayBtn();
});

nextBtn.addEventListener("click", playNext);

prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong();
    audio.play();
    updatePlayBtn();
});

audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    const percent = (audio.currentTime / audio.duration) * 100 || 0;
    progressBar.value = percent;
    if (typeof updateSlider === "function") updateSlider(progressBar);
});

progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});

audio.addEventListener("ended", playNext);

function playNext() {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong();
    audio.play();
    updatePlayBtn();
}

// === Playlist UI Rendering ===

function renderPlaylist() {
    playlistEl.innerHTML = "";

    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center gap-3";

        li.innerHTML = `
            <span class="drag-handle"><i class="bi bi-list"></i></span>
            <span class="flex-grow-1">${song.title}</span>
            <button class="btn btn-sm btn-danger remove-btn" title="Remove from playlist">
                <i class="bi bi-x-lg"></i>
            </button>
        `;

        li.addEventListener("click", e => {
            if (!e.target.closest(".remove-btn")) {
                currentIndex = index;
                loadSong();
                audio.play();
                updatePlayBtn();
            }
        });

        li.querySelector(".remove-btn").addEventListener("click", e => {
            e.stopPropagation();
            songs.splice(index, 1);

            if (index === currentIndex) {
                currentIndex = Math.min(currentIndex, songs.length - 1);
                loadSong();
                if (songs.length > 0) {
                    audio.play();
                } else {
                    audio.pause();
                    currentIndex = -1;
                    audio.src = "";
                    songTitle.textContent = "";
                    updatePlayBtn();
                }
            } else if (index < currentIndex) {
                currentIndex--;
            }

            renderPlaylist();
            renderSonglist();
            highlightActive(currentIndex);
        });

        playlistEl.appendChild(li);
    });

    new Sortable(playlistEl, {
        handle: ".drag-handle",
        animation: 150,
        onEnd: ({ oldIndex, newIndex }) => {
            const movedItem = songs.splice(oldIndex, 1)[0];
            songs.splice(newIndex, 0, movedItem);

            if (currentIndex === oldIndex) {
                currentIndex = newIndex;
            } else if (oldIndex < currentIndex && newIndex >= currentIndex) {
                currentIndex--;
            } else if (oldIndex > currentIndex && newIndex <= currentIndex) {
                currentIndex++;
            }

            renderPlaylist();
            highlightActive(currentIndex);
        }
    });
}

function renderSonglist() {
    songlistEl.innerHTML = "";

    initSongs.forEach(song => {
        const isInPlaylist = songs.some(s => s.src === song.src);

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center gap-3";

        li.innerHTML = `
            <span class="flex-grow-1">${song.title}</span>
            <button class="btn btn-sm btn-outline-primary add-btn" title="Add to playlist" ${isInPlaylist ? "disabled" : ""}>
                <i class="bi bi-plus-lg"></i>
            </button>
        `;

        if (!isInPlaylist) {
            li.querySelector(".add-btn").addEventListener("click", e => {
                e.stopPropagation();
                songs.push(song);
                renderPlaylist();
                highlightActive(currentIndex);
                renderSonglist();
            });
        }

        songlistEl.appendChild(li);
    });
}

// === Control Buttons ===

shuffleBtn.addEventListener("click", () => {
    const currentSong = songs[currentIndex];
    songs = shuffleArray(songs);
    findIndex(currentSong);
    renderPlaylist();
    highlightActive(currentIndex);
});

resetBtn.addEventListener("click", () => {
    songs = [];
    audio.pause();
    currentIndex = -1;
    audio.src = "";
    songTitle.textContent = "";
    updatePlayBtn();
    renderPlaylist();
    renderSonglist();
});

addAllBtn.addEventListener("click", () => {
    const currentSong = songs[currentIndex];
    songs = initSongs.map(song => ({ ...song }));
    if (currentIndex >= 0) findIndex(currentSong);
    renderPlaylist();
    renderSonglist();
    highlightActive(currentIndex);
});

// === Initial Render ===
renderSonglist();
renderPlaylist();
