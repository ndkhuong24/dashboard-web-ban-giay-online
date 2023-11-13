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
      console.log(error);
      showNotification("Đã xảy ra lỗi");
    });
});

let styles = [];

fetch("https://192.168.109.128/api/Style")
  .then((response) => response.json())
  .then((StylesData) => {
    styles = StylesData;
  })
  .catch((error) => {
    console.error("Lỗi khi tải danh sách style từ API:", error);
  });

function renderTable(data, page) {
  tbody.innerHTML = "";

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const item = data[i];
    const row = document.createElement("tr");

    const createDate = new Date(item.create_date);

    // Tìm tên của style tương ứng với style_id
    const style = styles.find((style) => style.id === item.style_id);
    const styleName = style ? style.name : "Không tìm thấy";

    const addLeadingZero = (number) => (number < 10 ? `0${number}` : number);

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
        <td>${styleName}</td>
        <td>${item.description}</td>
        <td>${formattedCreateDate}</td>
        <td>${item.status == 1 ? "Hoạt động" : "Không hoạt động"}</td>
        <td>
          <button id="capNhat" class="btn btn-secondary">Cập nhật</button>
        </td>
      `;

    tbody.appendChild(row);
  }
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
      showNotification("Đã xảy ra lỗi");
    });
}

table.addEventListener("click", function (event) {
  if (event.target.id === "capNhat") {
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
      const ProductID = clickedRow.querySelector("td:first-child").textContent;
      document.getElementById("modalProductId").value = ProductID;

      fetch(`https://192.168.109.128/api/Product/${ProductID}`)
        .then((response) => response.json())
        .then((ProductDetailData) => {
          const UpdateDiv = document.getElementById("updateProduct");

          let isActiveChecked = "";
          let isInactiveChecked = "";

          if (ProductDetailData.status === 1) {
            isActiveChecked = "checked";
          } else if (ProductDetailData.status === 0) {
            isInactiveChecked = "checked";
          }

          let ProductHTML = `
          <form>
            <div class="row">
              <div class="form-group col">
                  <label>Code:</label>
                  <input type="text" class="form-control" id="newCode" value="${ProductDetailData.code}">
              </div>
              <div class="form-group col">
                  <label>Tên:</label>
                  <input type="text" class="form-control" id="newName" value="${ProductDetailData.name}">
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                  <label>Mô tả:</label>
                  <input type="text" class="form-control" id="newDescription" value="${ProductDetailData.description}">
              </div>
              <div class="form-group col">
                  <label>Style:</label>
                  <select class="form-control" id="newStyleId">

                  </select>
              </div>
            </div>
            <fieldset>
              <legend>Trạng thái</legend>
              <label>
                  <input type="radio" id="active" name="newStatus" value="1" ${isActiveChecked}>
                  Hoạt động
              </label>
              <label>
                  <input type="radio" id="inactive" name="newStatus" value="0" ${isInactiveChecked}>
                  Không hoạt động
              </label>
            </fieldset>
          </form>
          `;

          fetch(`https://192.168.109.128/api/Style/active`)
            .then((response) => response.json())
            .then((StyleActiveData) => {
              const styleSelect = document.getElementById("newStyleId");
              // styleSelect.innerHTML = "";
              StyleActiveData.forEach((style) => {
                const option = document.createElement("option");
                option.value = style.id;
                option.textContent = style.name;
                styleSelect.appendChild(option);
              });
              const selectedValue = ProductDetailData.style_id;
              styleSelect.value = selectedValue;
            });

          UpdateDiv.innerHTML = ProductHTML;
        });
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
      console.log(error);
      showNotification("Đã xảy ra lỗi");
    });
}

var dataToUpdate;

document.getElementById("confirmUpdate").addEventListener("click", function () {
  const productIdModal = document.getElementById("modalProductId").value;

  fetchProductById(productIdModal, function (productData) {
    const newId = productData.id;

    const newCode = document.getElementById("newCode").value;
    if (newCode.trim() === "") {
      showNotification("Vui lòng viết mã của sản phẩm");
      return;
    }

    const newName = document.getElementById("newName").value;
    if (newName.trim() === "") {
      showNotification("Vui lòng viết tên của sản phẩm");
      return;
    }

    const newDescription = document.getElementById("newDescription").value;
    if (newDescription.trim() === "") {
      showNotification("Vui lòng viết mô tả của sản phầm");
      return;
    }

    const newStatus = document.querySelector(
      'input[name="newStatus"]:checked'
    ).value;

    dataToUpdate = {
      id: newId,
      code: newCode,
      name: newName,
      create_date: productData.create_date,
      description: newDescription,
      style_id: document.getElementById("newStyleId").value,
      status: newStatus,
    };

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
        console.log(error);
        showNotification("Đã xảy ra lỗi");
      });
    $("#confirmationModal").modal("hide");
  });
});
