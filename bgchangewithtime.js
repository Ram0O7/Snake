const currentTime = new Date().getHours();
// Get the root element
let r = document.documentElement;

// Create a function for setting a variable value
function setBgToBlack() {
    r.style.setProperty('--bg-color', '#000');
}
function setBgToWhite() {
    r.style.setProperty('--bg-color', 'gold');   
}

function changeBg() {
    if (currentTime > 17 || currentTime < 6) {
        setBgToBlack();
    } else {
        setBgToWhite();
    }
}
changeBg();
