const apiUrl = "https://192.168.109.128/api/Product";
const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");

const perPage = 5; // Số lượng mục trên mỗi trang
let currentPage = 1; // Trang hiện tại

// Định nghĩa biến data và khởi tạo nó là một mảng trống
let data = [];

document.addEventListener("DOMContentLoaded", function () {
  var selectElement = document.getElementById("style_id");

  fetch("https://192.168.109.128/api/Style/active") // Thay URL_API_CUA_BAN bằng URL API thực tế
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.id; // Thay value và text bằng trường thực tế của dữ liệu API
        option.text = item.name;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu từ API: " + error);
    });
});

function getStyleName(styleId) {
  // Thực hiện yêu cầu GET để lấy thông tin Style từ API Style dựa trên style_id
  fetch(`https://192.168.109.128/api/Style/${styleId}`)
    .then((response) => response.json())
    .then((styleData) => {
      // Hiển thị tên Style trong cột tương ứng của bảng
      const styleNameCell = document.getElementById(`style-name-${styleId}`);
      styleNameCell.textContent = styleData.name;
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API Style:", error);
    });
}

function renderTable(data, page) {
  // Xóa toàn bộ dữ liệu trong tbody
  tbody.innerHTML = "";

  // Tính chỉ mục bắt đầu và chỉ mục kết thúc cho trang hiện tại
  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  // Lặp qua các mục dựa trên chỉ mục bắt đầu và kết thúc
  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const item = data[i];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td id="style-name-${item.style_id}"></td>
      <td>${item.description}</td>
      <td>${item.create_date}</td>
      <td>${item.status == 1 ? "Hoạt động" : "Không hoạt động"}</td>
      <td>
        <button class="btn btn-secondary">Cập nhật</button>
      </td>
    `;

    getStyleName(item.style_id);

    tbody.appendChild(row);
  }
}

let totalPages = 1;
function fetchDataAndPopulateTable() {
  // Lấy dữ liệu từ API và render trang đầu tiên
  fetch(apiUrl)
    .then((response) => response.json())
    .then((apiData) => {
      data = apiData;
      totalPages = Math.ceil(data.length / perPage);

      renderTable(data, currentPage);
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API:", error);
    });
}

fetchDataAndPopulateTable();
