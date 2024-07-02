async function fillTable(tableId) {
    const table = document.getElementById(tableId);
    const tableBody = table.getElementsByTagName('tbody')[0];
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Show loading spinner
    loadingSpinner.style.display = 'block';
    tableBody.innerHTML = ''; // Clear existing rows

    try {
        // Fetch 10 random users
        const response = await fetch('https://randomuser.me/api/?results=10');
        const data = await response.json();

        // Hide loading spinner
        loadingSpinner.style.display = 'none';

        data.results.forEach((user, i) => {
            const row = tableBody.insertRow();
            const nameCell = row.insertCell();
            const emailCell = row.insertCell();
            const locationCell = row.insertCell();

            const name = `${user.name.title} ${user.name.first} ${user.name.last}`;
            const email = user.email;
            const location = `${user.location.city}, ${user.location.country}`;

            nameCell.textContent = name;
            emailCell.textContent = email;
            locationCell.textContent = location;
        });
    } catch (error) {
        console.error('Error fetching data: ', error);
        // Hide loading spinner even on error
        loadingSpinner.style.display = 'none';
        alert('Failed to load data');
    }
}