var audio = document.getElementById("audio");
var songTitle = document.getElementById("song-title");
var currentTimeEl = document.getElementById("current-time");
var durationEl = document.getElementById("duration");

var playBtn = document.getElementById("play");
var nextBtn = document.getElementById("next");
var prevBtn = document.getElementById("prev");
var shuffleBth = document.getElementById("shuffle");
var resetBth = document.getElementById("clear");
var addAll = document.getElementById("add");

var progressBar = document.getElementById("progress-bar");
var playlistEl = document.getElementById("playlist");
var songlistEl = document.getElementById("songlist");
var volumeSlider = document.getElementById("volume");

var currentIndex = -1;

var initSongs = [
    { title: "Lá Diêu Bông", src: "music/ladieubong.mp3" },
    { title: "Trống cơm", src: "music/trongcom.wav" },
    { title: "Gặp nhau giữa rừng mơ", src: "music/gapnhaugiuarungmo.mp3" },
    
];
var songs = initSongs.map(song => ({ ...song }));
function loadSong() {
    var song = songs[currentIndex];
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

function highlightActive(index) {
    if (index < 0) return;
    var items = playlistEl.querySelectorAll("li");
    items.forEach((item, i) => {
        item.classList.toggle("active", i === index);
    });
}

function formatTime(seconds) {
    var m = Math.floor(seconds / 60) || 0;
    var s = Math.floor(seconds % 60) || 0;
    return m + ":" + (s < 10 ? "0" : "") + s;
}


playBtn.addEventListener("click", function () {
    if (audio.scr == null) return;
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    updatePlayBtn();
});

nextBtn.addEventListener("click", function () {
    playNext();
});

prevBtn.addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong();
    audio.play();
    updatePlayBtn();
});

audio.addEventListener("loadedmetadata", function () {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", function () {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    var percent = (audio.currentTime / audio.duration) * 100 || 0;
    progressBar.value = percent;
    if (typeof updateSlider === "function") updateSlider(progressBar);
});

progressBar.addEventListener("input", function () {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

volumeSlider.addEventListener("input", function () {
    audio.volume = volumeSlider.value;
});


audio.addEventListener("ended", function () {
    playNext();
});

function playNext() {
    currentIndex++;
    if (currentIndex >= songs.length) {
        currentIndex = 0;
    }
    loadSong();
    audio.play();
    updatePlayBtn();
}

function renderPlaylist() {
    playlistEl.innerHTML = "";

    songs.forEach(function (song, index) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center gap-3";

        li.innerHTML = `
            <span class="drag-handle"><i class="bi bi-list"></i></span>
            <span class="flex-grow-1">${song.title}</span>
            <button class="btn btn-sm btn-danger remove-btn" title="Remove from playlist">
                <i class="bi bi-x-lg"></i>
            </button>
        `;

        // Play song on click (excluding the remove button)
        li.addEventListener("click", function (e) {
            if (!e.target.closest(".remove-btn")) {
                currentIndex = index;
                loadSong();
                audio.play();
                updatePlayBtn();
            }
        });

        li.querySelector(".remove-btn").addEventListener("click", function (e) {
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
        onEnd: function (evt) {
            const movedItem = songs.splice(evt.oldIndex, 1)[0];
            songs.splice(evt.newIndex, 0, movedItem);

            if (currentIndex === evt.oldIndex) {
                currentIndex = evt.newIndex;
            } else if (evt.oldIndex < currentIndex && evt.newIndex >= currentIndex) {
                currentIndex--;
            } else if (evt.oldIndex > currentIndex && evt.newIndex <= currentIndex) {
                currentIndex++;
            }

            renderPlaylist();
            highlightActive(currentIndex);
        }
    });
}


function renderSonglist() {
    songlistEl.innerHTML = "";
    initSongs.forEach(function (song, index) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center gap-3";

        // Check if song is already in playlist
        const isInPlaylist = songs.some(s => s.src === song.src);

        li.innerHTML = `
            <span class="flex-grow-1">${song.title}</span>
            <button class="btn btn-sm btn-outline-primary add-btn" title="Add to playlist" ${isInPlaylist ? "disabled" : ""}>
                <i class="bi bi-plus-lg"></i>
            </button>
        `;

        if (!isInPlaylist) {
            li.querySelector(".add-btn").addEventListener("click", function (e) {
                e.stopPropagation();
                songs.push(song);
                renderPlaylist();     // Refresh the playlist UI
                highlightActive(currentIndex);
                renderSonglist();     // Refresh the song list to disable the button
            });
        }

        songlistEl.appendChild(li);
    });
}

function shuffleArray(arr) {
    return arr
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
}

function findIndex(currentSong){
    currentIndex = songs.findIndex(
        (song) => song.src === currentSong.src
    );
}
shuffleBth.addEventListener("click", () => {
    const currentSong = songs[currentIndex];
    songs = shuffleArray(songs);
    findIndex(currentSong);
    renderPlaylist();
    highlightActive(currentIndex)

});

resetBth.addEventListener("click", () => {
    songs = []
    audio.pause();
    currentIndex = -1;
    audio.src = "";
    songTitle.textContent = "";
    renderPlaylist();
    renderSonglist();
});

addAll.addEventListener("click", () => {
    const currentSong = songs[currentIndex];
    songs = initSongs.map(song => ({ ...song }));
    findIndex(currentSong);
    renderPlaylist();
    renderSonglist();
    highlightActive(currentIndex);
});


renderSonglist();
renderPlaylist();