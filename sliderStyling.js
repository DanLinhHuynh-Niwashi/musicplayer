const sliders = document.querySelectorAll('input[type="range"]');

sliders.forEach(slider => {
    updateSlider(slider);
    slider.addEventListener('input', () => {
        updateSlider(slider);
    });
});

function updateSlider(slider) {
    const styles = getComputedStyle(document.body);
    const fillColor = styles.getPropertyValue('--secondary-color').trim();
    const bgColor = styles.getPropertyValue('--slider-bg').trim();
    
    const valuePercentage = (slider.value / slider.max) * 100;
    slider.style.background = `linear-gradient(to right,${fillColor} ${valuePercentage}%, ${bgColor} ${valuePercentage}%)`;
}