let audioMotion;
let currentMode = 'mirror';

const visualizerElement = document.getElementById('visualizer');
const audioElement = document.getElementById('audio');

const modeConfig = {
    mirror: { mode: 3, radial: false, showPeaks: true, reflexRatio: 0.3  },
    radial: { mode: 5, radial: true, showPeaks: true, radius: 0.7, spinSpeed: 3 },
    oscilloscope: { mode: 10, radial: false, showPeaks: false, reflexRatio: 0.3, },
    radialOscilloscope: { mode: 10, radial: true, showPeaks: false, radius: 0.7, spinSpeed: 3 }
};

function initVisualizer() {
    if (!audioMotion) {
        audioMotion = new AudioMotionAnalyzer(visualizerElement, {
            source: audioElement,
            ...modeConfig[currentMode],
            weightingFilter: 'D',
            linearAmplitude: true,
            linearBoost: 1.8,
            gradient: 'rainbow',
            showScaleX: false,
            showScaleY: false,
            bgAlpha: 1,
            outlineBars: true,
            barSpace: 0.2,
            overlay: false,
        });
    } else {
        Object.entries(modeConfig[currentMode]).forEach(([key, value]) => {
            audioMotion[key] = value;
        });
    }
}

function setVisualizerMode(mode) {
    if (!modeConfig[mode]) return;
    currentMode = mode;
    initVisualizer();
}

initVisualizer();

audioElement.addEventListener('play', () => {
    if (audioElement.context && audioElement.context.state === 'suspended') {
        audioElement.context.resume();
    }
});
