const toggle = document.getElementById('darkModeToggle');

const savedMode = localStorage.getItem('darkMode');
if (savedMode === 'enabled') {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
} else {
    document.body.classList.remove('dark-mode');
    toggle.checked = false;
}

toggle.addEventListener('change', () => {
    if (toggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }

    sliders.forEach(slider => updateSlider(slider));
});
