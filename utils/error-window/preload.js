// On window loaded:
//  1. Bind the Close button to close the error window when clicked
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("close-button").addEventListener("click", () => {
        window.close();
    });
});