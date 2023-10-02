// URL of the API you want to call
const apiUrl = 'http://localhost:8080/api/material';

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
         <td>${item.name}</td>
         <td>${item.status == 1 ? 'Hoạt động' : 'Không hoạt động'}</td>
         <td>
                                                <div class="dropdown no-arrow" style="width: 1px;">
                                                    <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                                        data-toggle="dropdown" aria-haspopup="true"
                                                        aria-expanded="false">
                                                        <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-700"></i>
                                                    </a>
                                                    <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                                        aria-labelledby="dropdownMenuLink">
                                                        <a class="dropdown-item" href="" data-toggle="modal"
                                                            data-target="#hihiModal">Sửa Thông Tin</a>
                                                            <a class="dropdown-item" href="">Xóa</a>
                                                    </div>
                                                </div>
                                            </td>
     `;
            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error while calling the API:', error);
    });
// Hàm thêm dữ liệu từ form vào table
document.getElementById('myForm').addEventListener('submit', function (event) {   
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        status: document.getElementById('status').value
    };

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

});
//Hàm Update từ form vào table:
document.getElementById('myForm2').addEventListener('submit', function (event) {   
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        status: document.getElementById('status').value
    };

    // Gọi API để thêm dữ liệu vào cơ sở dữ liệu
    fetch('http://localhost:8080/api.material/{id}', {
        
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Update dữ liệu thành công!");

        })
        .catch(error => {
            console.error('Error:', error);
        });

});
















