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

        // Dynamically adjust the top padding or margin of the main-content
        // to account for the navbar height. Adjust the '50px' as needed.
        mainContent.style.paddingTop = '50px';
    } catch (error) {
        alert('Failed to load HTML content: ' + error);
    }
}

/* Set home-page.html as the first screen to be shown*/
document.addEventListener('DOMContentLoaded', (event) => {
    fetch('home-page.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
            // Simulate the "Home Page" button press
            handleButtonPress('homePageButton', 'home-page.html');
        })
        .catch(err => {
            console.error('Failed to load home page:', err);
            document.getElementById('main-content').innerHTML = '<p>Failed to load content.</p>';
        });
});

function getPage(buttonid) {
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
    }
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

function displayText(btn, text) {
    const textContainer = btn.previousElementSibling; // Directly get the preceding div
    if (textContainer.textContent === text) {
        textContainer.textContent = '';
        btn.textContent = 'Show Text';
    } else {
        textContainer.textContent = text;
        btn.textContent = 'Hide Text';
    }
}

function toggleImage(id) {
    var img = document.getElementById(id);
    var btn = document.querySelector('.btn');
    if (img.style.display === "none" || img.style.display === "") {
        img.style.display = "block";
        btn.textContent = "Hide Image";
    } else {
        img.style.display = "none";
        btn.textContent = "Show Image";
    }
}