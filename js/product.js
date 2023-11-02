const apiUrl = "https://192.168.109.128/api/Product";

const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");

const perPage = 5;
let currentPage = 1;

let data = [];

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

document.addEventListener("DOMContentLoaded", function () {
  var selectElement = document.getElementById("style_id");
  fetch("https://192.168.109.128/api/Style/active")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu từ API: " + error);
    });
});

function renderTable(data, page) {
  tbody.innerHTML = "";

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

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

    var styleIDNow = parseInt(item.style_id);
    GetStyleNameById(styleIDNow);
    tbody.appendChild(row);
  }
}

function GetStyleNameById(styleId) {
  fetch(`https://192.168.109.128/api/Style/id/${styleId}`)
    .then((response) => response.json())
    .then((styleData) => {
      const styleNameCell = document.getElementById(`style-name-${styleId}`);
      styleNameCell.textContent = styleData.name;
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API Style:", error);
    });
}

function fetchDataAndPopulateTable() {
  fetch(apiUrl)
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

function updatePageInfo() {
  const currentPageElement = document.getElementById("currentPage");
  currentPageElement.textContent = `${currentPage}/${totalPages}`;
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

fetchDataAndPopulateTable();

document.getElementById("saveChanges").addEventListener("click", function () {
  const code = document.getElementById("code").value;
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const status = parseInt(
    document.querySelector('input[name="status"]:checked').value
  );
  const selectElement = document.getElementById("style_id");
  const selectedValue = parseInt(selectElement.value);

  if (code.trim() === "") {
    alert("Vui lòng nhập code của sản phẩm trước khi thêm.");
    return;
  }
  if (name.trim() === "") {
    alert("Vui lòng nhập tên trước khi thêm.");
    return;
  }
  if (description.trim() === "") {
    alert("Vui lòng nhập miêu tả trước khi thêm.");
    return;
  }

  const dataToAdd = {
    id: 0,
    code: code,
    name: name,
    style_id: selectedValue,
    description: description,
    create_date: "2023-10-30T09:42:15.652Z",
    status: status,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToAdd),
  };
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (response.ok) {
        alert("Thêm dữ liệu thành công.");
        location.reload();
      } else {
        alert("Có lỗi xảy ra khi thêm dữ liệu.");
      }
    })
    .catch((error) => {
      console.error("Lỗi: " + error.message);
    });
});

document.getElementById("searchButton").addEventListener("click", function () {
  const searchPattern = document.getElementById("searchInput").value;
  if (searchPattern.trim() === "") {
    fetchDataAndPopulateTable();
  } else {
    searchByName(searchPattern);
  }
});

function searchByName(searchPattern) {
  fetch(`https://192.168.109.128/api/Product/searchName/${searchPattern}`)
    .then((response) => response.json())
    .then((searhData) => {
      currentPage = 1;
      data = searhData;
      totalPages = Math.ceil(data.length / perPage);
      updatePageInfo();
      renderTable(data, currentPage);
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API:", error);
    });
}

table.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-secondary")) {
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
      const Styleid = clickedRow.querySelector("td:first-child").textContent;
      document.getElementById("modalProductId").value = Styleid;
      $("#confirmationModal").modal("show");
    }
  }
});

function fetchProductById(styleId, callback) {
  const apiUrl = `https://192.168.109.128/api/Product/${styleId}`;
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error("Lỗi: " + error);
    });
}

var dataToUpdate;

document.getElementById("confirmUpdate").addEventListener("click", function () {
  const productIdModal = document.getElementById("modalProductId").value;
  fetchProductById(productIdModal, function (productData) {
    dataToUpdate = {
      id: productData.id,
      code: productData.code,
      name: productData.name,
      style_id: productData.style_id,
      description: productData.description,
      create_date: productData.create_date,
      status: productData.status === 1 ? 0 : 1,
    };
    console.log(dataToUpdate)
    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToUpdate),
    })
      .then((response) => {
        if (response.ok) {
          tbody.innerHTML = "";
          fetchDataAndPopulateTable();
        } else {
          response.text().then((data) => {
            console.log("Lỗi: " + data);
          });
        }
      })
      .catch((error) => {
        console.log("Lỗi: " + error.message);
      });
    $("#confirmationModal").modal("hide");
  });
});
