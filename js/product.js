const apiUrl = "https://192.168.109.128/api/Product";

const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");

const perPage = 5;
let currentPage = 1;

let data = [];

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

var notification = document.getElementById("notification");
var notificationText = document.getElementById("notification-text");

function showNotification(message) {
  notificationText.textContent = message;
  notification.style.display = "block";

  setTimeout(function () {
    notification.style.display = "none";
  }, 3000);
}

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
      showNotification("Đã xảy ra lỗi");
    });
});

function renderTable(data, page) {
  tbody.innerHTML = "";

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const item = data[i];
    const row = document.createElement("tr");

    // Parse the create_date string to a Date object
    const createDate = new Date(item.create_date);

    // Hàm để thêm số 0 đứng đầu nếu số đó nhỏ hơn 10
    const addLeadingZero = (number) => (number < 10 ? `0${number}` : number);

    // Format the date with full date and time
    const formattedCreateDate = `${addLeadingZero(
      createDate.getDate()
    )}/${addLeadingZero(
      createDate.getMonth() + 1
    )}/${createDate.getFullYear()} ${addLeadingZero(
      createDate.getHours()
    )}:${addLeadingZero(createDate.getMinutes())}:${addLeadingZero(
      createDate.getSeconds()
    )}`;

    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td id="style-name-${item.style_id}"></td>
      <td>${item.description}</td>
      <td>${formattedCreateDate}</td>
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
      showNotification("Đã xảy ra lỗi");
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
      showNotification("Đã xảy ra lỗi");
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
    showNotification("Vui lòng nhập code của sản phẩm trước khi thêm.");
    return;
  }
  if (name.trim() === "") {
    showNotification("Vui lòng nhập tên trước khi thêm.");
    return;
  }
  if (description.trim() === "") {
    showNotification("Vui lòng nhập miêu tả trước khi thêm.");
    return;
  }

  if (isNameExists(name)) {
    showNotification("Tên đã tồn tại. Vui lòng chọn tên khác.");
    return;
  }

  if (isCodeExists(code)) {
    showNotification("Mã sản phẩm đã tồn tại. Vui lòng chọn mã khác");
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
        tbody.innerHTML = "";
        $("#AddModal").modal("hide");
        fetchDataAndPopulateTable();
        showNotification("Thêm dữ liệu thành công");
        document.getElementById("code").value = "";
        document.getElementById("name").value = "";
        document.getElementById("description").value = "";
      } else {
        showNotification("Có lỗi xảy ra khi thêm dữ liệu.");
      }
    })
    .catch((error) => {
      showNotification("Đã xảy ra lỗi");
    });
});

function isNameExists(name) {
  return data.some((item) => item.name === name);
}

function isCodeExists(code) {
  return data.some((item) => item.code === code);
}

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
      showNotification("Đã xảy ra lỗi");
    });
}

table.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-secondary")) {
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
      const ProductId = clickedRow.querySelector("td:first-child").textContent;
      document.getElementById("modalProductId").value = ProductId;
      $("#confirmationModal").modal("show");
    }
  }
});

function fetchProductById(ProductId, callback) {
  const apiUrl = `https://192.168.109.128/api/Product/${ProductId}`;
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
      showNotification("Đã xảy ra lỗi");
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
    console.log(dataToUpdate);
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
          showNotification("Thành công");
        } else {
          response.text().then((data) => {
            showNotification("Đã xảy ra lỗi");
          });
        }
      })
      .catch((error) => {
        showNotification("Đã xảy ra lỗi");
      });
    $("#confirmationModal").modal("hide");
  });
});
