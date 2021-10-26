window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        let element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        } 
    };

    for (let dependency of ["chrome", "node", "electron"]) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});