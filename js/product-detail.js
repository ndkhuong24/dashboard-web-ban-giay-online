const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");

const perPage = 5;
let currentPage = 1;

let data = [];

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

function renderTable(data, page) {
  tbody.innerHTML = "";

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const item = data[i];
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.id}</td>
        <td><img src="https://192.168.109.128/${item.path}" alt="Product Image" style="width: 100px;height: 100px;"></td>
        <td>${item.productName}</td>
        <td>${item.styleName}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td>${item.status == 1 ? "Hoạt động" : "Không hoạt động"}</td>
        <td>
          <button class="btn btn-secondary">Cập nhật</button>
        </td>
      `;
    tbody.appendChild(row);
  }
}

function fetchDataAndPopulateTable() {
  fetch("https://192.168.109.128/api/ProductDetail/getAll")
    .then((response) => response.json())
    .then((apiData) => {
      data = apiData;
      totalPages = Math.ceil(data.length / perPage);
      updatePageInfo();
      renderTable(data, currentPage);
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API:", error);
    });
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(data, currentPage);
    updatePageInfo();
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderTable(data, currentPage);
    updatePageInfo();
  }
});

// Thêm hàm để cập nhật thông tin trang
function updatePageInfo() {
  const currentPageElement = document.getElementById("currentPage");
  currentPageElement.textContent = `${currentPage}/${totalPages}`;
}

fetchDataAndPopulateTable();