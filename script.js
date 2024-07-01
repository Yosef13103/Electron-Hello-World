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
    } catch (error) {
        alert('Failed to load HTML content: ' + error);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetch('home-page.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
        })
        .catch(err => {
            console.error('Failed to load home page:', err);
            document.getElementById('main-content').innerHTML = '<p>Failed to load content.</p>';
        });
});

function showHomePage(buttonid) {
    filename = 'home-page.html';
    handleButtonPress(buttonid, filename);
}

function showHelloWorld(buttonid) {
    filename = 'hello-world.html';
    handleButtonPress(buttonid, filename);
}

function handleButtonPress(buttonId, fileName) {
    // Load the HTML content
    loadHtmlContent(fileName);

    // Find all buttons
    const buttons = document.querySelectorAll('button');

    // Enable all buttons and remove the pressed state
    buttons.forEach(button => {
        button.disabled = false;
        button.classList.remove('nav-bar-button-pressed');
    });

    // Disable the pressed button and add the pressed state
    const pressedButton = document.getElementById(buttonId);
    pressedButton.disabled = true;
    pressedButton.classList.add('nav-bar-button-pressed');
}

function displayHelloWorld() {
    const textContainer = document.querySelector('.hello-world-text');
    textContainer.textContent = 'Hello World';
}

function toggleImage() {
    var img = document.getElementById("helloworldimg");
    var btn = document.querySelector('.btn');
    if (img.style.display === "none" || img.style.display === "") {
        img.style.display = "block";
        btn.textContent = "Hide Image";
    } else {
        img.style.display = "none";
        btn.textContent = "Show Image";
    }
}