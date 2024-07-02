document.addEventListener('DOMContentLoaded', (event) => {
    // Combine initialization tasks into a single listener
    loadHomePage();
});

function quitApp() {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('quit-app'); // Signal the main process to quit the app
}

async function loadHtmlContent(html) {
    try {
        const response = await fetch(html);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            throw new Error("Failed to find the main-content element.");
        }
        mainContent.innerHTML = htmlContent;
        mainContent.style.paddingTop = '50px';
        restorePageState(); // Ensure this is called after content is loaded
        if (html === 'json-page.html') {
        fillTable('userTable')
        }
    } catch (error) {
        alert('Failed to load HTML content: ' + error);
    }
}

function restorePageState() {
    // Restore visibility and text for elements with a saved display state
    document.querySelectorAll('[data-state-key]').forEach(el => {
        const elDisplayState = localStorage.getItem(el.getAttribute('data-state-key') + '_display');
        if (elDisplayState !== null) { // Check for null to ensure a value was retrieved
            el.style.display = elDisplayState;
            updateButtonState(el); // Update button text based on the element's state
        }
    });

    // Restore input and textarea values
    document.querySelectorAll('input[data-state-key], textarea[data-state-key]').forEach(input => {
        const savedValue = localStorage.getItem(input.getAttribute('data-state-key'));
        if (savedValue !== null) {
            input.value = savedValue;
        }
    });

    // Restore selected options in select elements
    document.querySelectorAll('select[data-state-key]').forEach(select => {
        const savedValue = localStorage.getItem(select.getAttribute('data-state-key'));
        if (savedValue !== null) {
            select.value = savedValue;
        }
    });
}

function updateButtonState(el) {
    const btn = document.querySelector(`button[data-for='${el.id}']`);
    if (btn) {
        let actionWord = el.style.display === "none" ? "Show" : "Hide";
        let elementType = el.tagName.toLowerCase();
        switch (elementType) {
            case 'img':
                btn.textContent = `${actionWord} Image`;
                break;
            case 'div':
                btn.textContent = `${actionWord} Text`;
                break;
            default:
                btn.textContent = `${actionWord} Content`;
        }
    }
}

function loadHomePage() {
    fetch('home-page.html')
        .then(response => response.text())
        .then(html => {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = html;
            handleButtonPress('homePageButton', 'home-page.html');
        })
        .catch(err => {
            console.error('Failed to load home page:', err);
            document.getElementById('main-content').innerHTML = '<p>Failed to load content.</p>';
        });
}

function getPage(buttonid) {
    let filename;
    switch (buttonid) {
        case "homePageButton":
            filename = 'home-page.html';
            break;
        case "helloWorldButton":
            filename = 'hello-world.html';
            break;
        case "JSONButton":
            filename = 'json-page.html';
            break;
        default:
            console.error('Unknown button ID:', buttonid);
            return; // Exit the function if button ID is unknown
    }
    handleButtonPress(buttonid, filename);
}

function handleButtonPress(buttonId, fileName) {
    loadHtmlContent(fileName);
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = false;
        button.classList.remove('nav-bar-button-pressed');
    });
    const pressedButton = document.getElementById(buttonId);
    pressedButton.disabled = true;
    pressedButton.classList.add('nav-bar-button-pressed');
}

function displayText(btn, text) {
    // Find the text container element immediately preceding the button
    const textContainer = btn.previousElementSibling;

    // Check if the container already displays the text
    if (textContainer.textContent === text) {
        // If yes, clear the container and update the button to indicate text can be shown
        textContainer.textContent = '';
        btn.textContent = 'Show Text';
    } else {
        // If no, display the text in the container and update the button to indicate text can be hidden
        textContainer.textContent = text;
        btn.textContent = 'Hide Text';
    }

    // Save the current state of the text container and button to localStorage for persistence
    localStorage.setItem(textContainer.id, textContainer.textContent);
    localStorage.setItem(btn.id, btn.textContent);
}

// Ensure that toggleImage and other functions that alter state save those changes to localStorage
function toggleImage(id) {
    var img = document.getElementById(id);
    var btn = document.querySelector(`button[data-for='${id}']`);
    if (img.style.display === "none" || img.style.display === "") {
        img.style.display = "block";
        btn.textContent = "Hide Image";
    } else {
        img.style.display = "none";
        btn.textContent = "Show Image";
    }
    localStorage.setItem(id + '_display', img.style.display); // Save state
    localStorage.setItem(btn.id, btn.textContent); // Save button state
}