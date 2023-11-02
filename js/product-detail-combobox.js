//categoryID
document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('categoryID');

    fetch('http://192.168.109.128:8080/api/Category') // Thay URL_API_CUA_BAN bằng URL API thực tế
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                var option = document.createElement('option');
                option.value = item.id; // Thay value và text bằng trường thực tế của dữ liệu API
                option.text = item.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu từ API: ' + error);
        });
});
//brandID
document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('brandID');

    fetch('http://192.168.109.128:8080/api/Brand') // Thay URL_API_CUA_BAN bằng URL API thực tế
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                var option = document.createElement('option');
                option.value = item.id; // Thay value và text bằng trường thực tế của dữ liệu API
                option.text = item.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu từ API: ' + error);
        });
});
//sizeID
document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('sizeID');

    fetch('http://192.168.109.128:8080/api/Size') // Thay URL_API_CUA_BAN bằng URL API thực tế
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                var option = document.createElement('option');
                option.value = item.id; // Thay value và text bằng trường thực tế của dữ liệu API
                option.text = item.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu từ API: ' + error);
        });
});
//colorID
document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('colorID');

    fetch('http://192.168.109.128:8080/api/Color') // Thay URL_API_CUA_BAN bằng URL API thực tế
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                var option = document.createElement('option');
                option.value = item.id; // Thay value và text bằng trường thực tế của dữ liệu API
                option.text = item.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu từ API: ' + error);
        });
});
//soleID
document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('soleID');

    fetch('http://192.168.109.128:8080/api/Sole') // Thay URL_API_CUA_BAN bằng URL API thực tế
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                var option = document.createElement('option');
                option.value = item.id; // Thay value và text bằng trường thực tế của dữ liệu API
                option.text = item.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu từ API: ' + error);
        });
});
//materialID
document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('materialID');

    fetch('http://192.168.109.128:8080/api/Material') // Thay URL_API_CUA_BAN bằng URL API thực tế
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                var option = document.createElement('option');
                option.value = item.id; // Thay value và text bằng trường thực tế của dữ liệu API
                option.text = item.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu từ API: ' + error);
        });
});
document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('productID');

    // Hàm để tải danh sách Style từ API
    function loadStyles(styleId) {
        return fetch('https://192.168.109.128/api/Style/id/' + styleId)
            .then(response => response.json())
            .then(styleData => styleData.name)
            .catch(error => {
                console.error('Lỗi khi tải dữ liệu Style từ API: ' + error);
            });
    }

    fetch('https://192.168.109.128/api/Product') // Thay URL_API_CUA_BAN bằng URL API thực tế
        .then(response => response.json())
        .then(data => {
            data.forEach(async item => {
                var option = document.createElement('option');
                option.value = item.id; // Thay value và text bằng trường thực tế của dữ liệu API

                // Sử dụng hàm loadStyles để lấy tên Style
                const styleName = await loadStyles(item.style_id);
                option.text = item.name + " - " + styleName;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu từ API: ' + error);
        });
});