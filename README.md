# LAB 3 - SE334: PROGRAMMING PARADIGMS - UIT, VNUHCM

### Project Information

* **Name**: MUSIC PLAYER
* **Author**: Huynh Le Dan Linh - 22520759
* **Instructor**: PhD. Nguyen Duy Khanh

### Submission

* **GitHub Repository**: [musicplayer](https://github.com/DanLinhHuynh-Niwashi/musicplayer)
* **Demo**: [Demo video](https://youtu.be/SO0PCxF6g4M)
* **Acknowledgement**: The project utilized ChatGPT to support code cleaning, documentation, and UI enhancements.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Usage Guidelines](#usage-guidelines)
4. [Handling Extra Features](#handling-extra-features)
5. [Application Screen Captures](#application-screen-captures)

## OVERVIEW

The **Music Player** is a browser-based web application that allows users to play audio files, visualize sound, create and manage playlists, control volume, and set playback timers.

* **Technologies**:

  * [Bootstrap](https://getbootstrap.com/) – responsive styling
  * [Bootstrap Icons](https://icons.getbootstrap.com/) – UI icons
  * [SortableJS](https://sortablejs.github.io/Sortable/) – drag-and-drop for playlist
  * [AudioMotion Analyzer](https://github.com/hvianna/audioMotion-analyzer) – visualization
  * JavaScript, HTML, CSS

## FEATURES
* The features with (*) is extra features.

| **Feature**         | **Description**                                                          |
| ------------------- | ------------------------------------------------------------------------ |
| Audio Playback      | Play, pause, skip forward/back, and control playback via a media player. The player will switch to the next song upon ending the current song.|
| Volume Control      | Real-time slider for controlling audio volume.                           |
| Playlist Management | Add, reorder (drag-and-drop/shuffle), or remove songs from the playlist.         |
| Audio Visualization (*) | Visual modes: Spectrum, Radial, Oscilloscope, Radial-Oscilloscope.       |
| Dark Mode (*)          | Toggle UI appearance for better viewing comfort.                         |
| Sleep Timer (*)        | Automatically stops playback after a user-defined time (HH\:MM\:SS).     |

## USAGE GUIDELINES

> ⚠️ **NOTES**
>
> * Ensure all media files used are in supported formats (e.g., `.mp3`, `.wav`).
> * All user interaction is performed directly on the UI (no backend or server required).
> * For custom visualizations, modify `visualizer.js`.
> * For custom song list, modify `initSongs` in `playlist.js`, ensure your sources are unique and are supported.

1. Clone or download the repository.
2. Open `index.html` in your browser.
3. An initial playlist will be created with all the songs in the storage. You can modify the playlist.
4. Customize visualization mode, volume, and timer.
5. Enjoy the music player!

---

## HANDLING EXTRA FEATURES
**1. Visualizer Handling:**

* Use [AudioMotion Analyzer](https://github.com/hvianna/audioMotion-analyzer) library for visualization.
* Users can switch between visualizer mode, and the visualizer setting will change accordingly based on a config map.

```
const modeConfig = {
    mirror: { mode: 3, radial: false, showPeaks: true, reflexRatio: 0.3  },
    radial: { mode: 5, radial: true, showPeaks: true, radius: 0.7, spinSpeed: 3 },
    oscilloscope: { mode: 10, radial: false, showPeaks: false, reflexRatio: 0.3, },
    radialOscilloscope: { mode: 10, radial: true, showPeaks: false, radius: 0.7, spinSpeed: 3 }
};
```

**2. Dark Mode Handling:**
* Use global color variables for css that can be overidden with "dark-mode" tag.
* Save the UI mode to localStorage to maintain the state on next load.
* Use `requestAnimationFrame()` for smooth updates.
```
:root {
    /* Light mode */
    --main-color: #8758ff;
    --secondary-color: rgb(255, 145, 196);

    --bg-color: #f8f9fa;
    --card-bg-color: #ffffff;
    --text-color: #000000;

    --slider-bg: #ebe9e7;
}

body.dark-mode {
    /* Dark mode colors */
    --main-color: rgb(195, 0, 255);
    --secondary-color: rgb(255, 0, 212);

    --bg-color: #121212;
    --card-bg-color: #1e1e1e;
    --text-color: #f0f0f0;

    --slider-bg: #2c2c2c;
}
```

**3. Timer Handling:**

* Time is set using `<select>` dropdowns.
* A countdown timer pauses playback when time runs out.
* Use `setTimeout ()` to know when to stop the playback.
```
timerId = setTimeout(() => {
        const audio = document.getElementById('audio');
        audio.pause();
        alert('Music stopped!');
        resetTimer();
        updatePlayBtn();
    }, totalSeconds * 1000);
```

## APPLICATION SCREEN CAPTURES
#### *Light Mode*
<p align="center">
  <img src="https://github.com/user-attachments/assets/88a57822-76fa-4bdc-8054-df6cc51d0437" alt="Light mode" width="800"/>
</p>

#### *Dark Mode*
<p align="center">
  <img src="https://github.com/user-attachments/assets/bdcab156-62c1-4122-86e5-b26f982aec9e" alt="Dark Mode" width="800"/>
</p>
