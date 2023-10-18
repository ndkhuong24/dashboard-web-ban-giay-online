// URL of the API you want to call
const apiUrl = 'http://localhost:8080/api/Image';

// Get a reference to the table
const table = document.getElementById('data-table');
const tbody = table.querySelector('tbody');

// Make the API request using fetch
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Clear any existing data in the table body
        tbody.innerHTML = '';

        // Loop through the data from the API and add it to the table
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
         <td>${item.id}</td>
         <td><img src="${item.url}"></td>
         <td>${item.status}</td>
     `;
            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error while calling the API:', error);
    });
// Hàm thêm dữ liệu từ form vào table


    // Gọi API để thêm dữ liệu vào cơ sở dữ liệu
    fetch(apiUrl, {
        
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Thêm dữ liệu thành công!");

        })
        .catch(error => {
            console.error('Error:', error);
        });



















