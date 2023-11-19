const apiUrl = "http://localhost:8080/api/Voucher";

const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");

const perPage = 5;
let currentPage = 1;

let data = [];
var notification = document.getElementById("notification");
var notificationText = document.getElementById("notification-text");

function showNotification(message) {
  notificationText.textContent = message;
  notification.style.display = "block";
  setTimeout(function () {
    notification.style.display = "none";
  }, 3000);
}

function renderTable(data, page) {
  tbody.innerHTML = "";

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const item = data[i];
    const row = document.createElement("tr");

    const startDate = new Date(item.start_date);
    const addLeadingZero = (number) => (number < 10 ? `0${number}` : number);
    const formattedStartDate = `${addLeadingZero(
      startDate.getDate()
    )}/${addLeadingZero(
      startDate.getMonth() + 1
    )}/${startDate.getFullYear()} ${addLeadingZero(
      startDate.getHours()
    )}:${addLeadingZero(startDate.getMinutes())}:${addLeadingZero(
      startDate.getSeconds()
    )}`;

    const endDate = new Date(item.end_date);
    const addLeadingZero1 = (number) => (number < 10 ? `0${number}` : number);
    const formattedEndDate = `${addLeadingZero1(
      endDate.getDate()
    )}/${addLeadingZero1(
      endDate.getMonth() + 1
    )}/${endDate.getFullYear()} ${addLeadingZero1(
      endDate.getHours()
    )}:${addLeadingZero1(endDate.getMinutes())}:${addLeadingZero1(
      endDate.getSeconds()
    )}`;

    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.code}</td>
      <td>${item.type == 0 ? "VNĐ" : "%"}</td>
      <td style="color: red;font-weight: 600;">${item.value}</td>
      <td style="color: red;font-weight: 600;">${item.maximum_value !== null ? item.maximum_value : ''}</td>
      <td style="color: red;font-weight: 600;">${item.condition_value}</td>
      <td>${item.quantity}</td>
      <td>${formattedStartDate}</td>
      <td>${formattedEndDate}</td>
      <td>
        <button id="capNhat" class="btn btn-primary" ${
          item.status == 1 ? "disabled" : ""
        }>Cập nhật</button>
      </td>
    `;
    tbody.appendChild(row);
  }
}

let totalPages = 1;

function fetchDataAndPopulateTable() {
  fetch("http://localhost:8080/api/Voucher/getAll")
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

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

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

function updatePageInfo() {
  const currentPageElement = document.getElementById("currentPage");
  currentPageElement.textContent = `${currentPage}/${totalPages}`;
}

fetchDataAndPopulateTable();

document.getElementById("saveChanges").addEventListener("click", function () {
  const name = document.getElementById("name").value;
  const code = document.getElementById("code").value;
  const quantity = document.getElementById("quantity").value;
  const value = document.getElementById("value").value;
  const maximum_value = document.getElementById("maximum_value").value;
  const condition = document.getElementById("condition").value;
  const start_date = document.getElementById("start_date").value;
  const end_date = document.getElementById("end_date").value;
  const type = parseInt(
    document.querySelector('input[name="type"]:checked').value
  );

  if (name.trim() === "") {
    showNotification("Vui lòng nhập tên Voucher trước khi thêm.");
    return;
  }
  if (isNameExists(name)) {
    showNotification("Tên đã tồn tại. Vui lòng nhập tên khác.");
    return;
  }
  if (code.trim() === "") {
    showNotification("Vui lòng nhập mã Voucher trước khi thêm.");
    return;
  }
  if (isCodeExists(code)) {
    showNotification("Code đã tồn tại. Vui lòng nhập Code khác.");
    return;
  }
  if (value.trim() === "") {
    showNotification("Vui lòng nhập giá trị Voucher trước khi thêm.");
    return;
  }

  if (type === 1) {
    if (maximum_value.trim() === "") {
      showNotification("Vui lòng nhập giá trị tối đa trước khi thêm.");
      return;
    }
  }

  if (quantity.trim() === "") {
    showNotification("Vui lòng nhập Số lượng trước khi thêm.");
    return;
  }
  if (condition.trim() === "") {
    showNotification("Vui lòng nhập Điều kiện sử dụng trước khi thêm.");
    return;
  }
  if (start_date.trim() === "") {
    showNotification("Vui lòng nhập ngày bắt đầu trước khi thêm.");
    return;
  }
  if (end_date.trim() === "") {
    showNotification("Vui lòng nhập ngày kết thúc trước khi thêm.");
    return;
  }

  const dataToAdd = {
    name: name,
    code: code,
    quantity: quantity,
    type: type,
    value: value,
    maximum_value: maximum_value,
    condition_value: condition,
    start_date: start_date,
    end_date: end_date,
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
        showNotification("Thêm dữ liệu thành công");
        fetchDataAndPopulateTable();
        document.getElementById("name").value = "";
        document.getElementById("code").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("value").value = "";
        document.getElementById("maximum_value").value = "";
        document.getElementById("start_date").value = "";
        document.getElementById("end_date").value = "";
        document.getElementById("condition").value = "";
      } else {
        showNotification("Có lỗi xảy ra khi thêm dữ liệu");
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

table.addEventListener("click", function (event) {
  if (event.target.id === "capNhat") {
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
      const Voucherid = clickedRow.querySelector("td:first-child").textContent;
      document.getElementById("modalVoucherId").value = Voucherid;
      fetch(`http://localhost:8080/api/Voucher/id/${Voucherid}`)
        .then((response) => response.json())
        .then((VoucherData) => {
          const UpdateDiv = document.getElementById("updateVoucher");

          let isActiveChecked2 = "";
          let isInactiveChecked2 = "";
          let trangThai = "";

          if (VoucherData.type === 0) {
            trangThai = "disabled";
          }

          if (VoucherData.type === 1) {
            isActiveChecked2 = "checked";
          } else if (VoucherData.type === 0) {
            isInactiveChecked2 = "checked";
          }
          let VoucherHTML = `<form class="row g-10" style="font-size: small;">
          <div class="col-md-6">
              <label class="form-label">Tên Voucher</label>
              <input class="form-control" id="newName" value="${VoucherData.name}" placeholder="">
          </div><br>
          <div class="col-md-6">
              <label class="form-label">Mã Voucher</label>
              <input type="text" class="form-control" id="newCode" value="${VoucherData.code}" placeholder="">
          </div><br>
          <div class="col-2">
              <label class="form-label">Số Lượng</label>
              <div class="buttons_added">
                  <input
                      style="height: 38px;width:120px;border: 1px solid;border-color: rgb(201, 199, 213);border-radius: 5px;"
                      quantity" class="input-qty" max="Số tối đa" min="Số tối thiểu" type="number"
                      value="${VoucherData.quantity}" id="newQuantity">
              </div>
          </div>
          <div class="col-4">
              <label class="form-label">Giá trị</label>
              <input type="text" style="color: crimson;" class="form-control" value="${VoucherData.value}" id="newValue"
                  placeholder="% hoặc VNĐ">
          </div>
          <div style="margin-top: 10px;margin-left: 15px;">
              <fieldset>
                  <legend style="font-size: small;">Hình thức giảm</legend>
                  <label>
                      <input type="radio" name="newType" id="disableInputUpdate" value="0" ${isInactiveChecked2}>
                      VNĐ
                  </label>
                  <label>
                      <input type="radio" name="newType" id="enableInputUpdate" value="1" ${isActiveChecked2}>
                      %
                  </label>
              </fieldset>
          </div>
      
          <div class="col-md-6" style="margin-top: 10px;">
              <label class="form-label">Giá trị tối đa (Áp dụng cho voucher %)</label>
              <input type="email" class="form-control" id="newMaximum_value" value="${VoucherData.maximum_value}" ${trangThai}>
          </div><br>
          <div class="col-md-6" style="margin-top: 10px;">
              <label class="form-label">Điều kiện sử dụng</label>
              <input type="text" class="form-control" id="newCondition" value="${VoucherData.condition_value}"
                  placeholder="Cho đơn hàng từ :">
          </div><br>
          <div class="col-6" style="margin-top: 10px;">
              <label class="form-label">Ngày bắt đầu</label>
              <input type="datetime-local" class="form-control" id="newStart_date" value="${VoucherData.start_date}">
          </div>
          <div class="col-6" style="margin-top: 10px;">
              <label class="form-label">Ngày kết thúc</label>
              <input type="datetime-local" class="form-control" id="newEnd_date" value="${VoucherData.end_date}">
          </div>
        </form>`;
          UpdateDiv.innerHTML = VoucherHTML;

          var enableInputUpdate = document.getElementById("enableInputUpdate");
          var disableInputUpdate =
            document.getElementById("disableInputUpdate");
          var newMaximum_value = document.getElementById("newMaximum_value");

          enableInputUpdate.addEventListener("change", function () {
            newMaximum_value.disabled = false;
          });

          disableInputUpdate.addEventListener("change", function () {
            newMaximum_value.disabled = true;
            newMaximum_value.value = "";
          });
        });
      $("#confirmationModal").modal("show");
    }
  }
});
function fetchVoucherById(Voucherid, callback) {
  const apiUrl = `http://localhost:8080/api/Voucher/id/${Voucherid}`;

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
  const VoucherIdFromModal = document.getElementById("modalVoucherId").value;

  fetchVoucherById(VoucherIdFromModal, function (VoucherData) {
    const newId = VoucherData.id;
    const newName = document.getElementById("newName").value;
    const newType = document.querySelector(
      'input[name="newType"]:checked'
    ).value;
    const newCode = document.getElementById("newCode").value;
    const newValue = document.getElementById("newValue").value;
    const newMaximum_value = document.getElementById("newMaximum_value").value;
    const newCondition = document.getElementById("newCondition").value;
    const newQuantity = document.getElementById("newQuantity").value;
    const newStart_date = document.getElementById("newStart_date").value;
    const newEnd_date = document.getElementById("newEnd_date").value;

    dataToUpdate = {
      id: newId,
      name: newName,
      code: newCode,
      quantity: newQuantity,
      type: newType,
      value: newValue,
      maximum_value: newMaximum_value,
      condition_value: newCondition,
      start_date: newStart_date,
      end_date: newEnd_date,
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
          showNotification("Đã xảy ra lỗi");
        }
      })
      .catch((error) => {
        showNotification("Đã xảy ra lỗi");
        console.error(error);
      });
    $("#confirmationModal").modal("hide");
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
  fetch(`http://localhost:8080/api/Voucher/${searchPattern}`)
    .then((response) => response.json())
    .then((searchData) => {
      currentPage = 1;
      data = searchData;
      totalPages = Math.ceil(data.length / perPage);
      updatePageInfo();
      renderTable(data, currentPage);
    })
    .catch((error) => {
      console.log(error);
      showNotification("Xảy ra lỗi");
    });
}

var enableInput = document.getElementById("enableInput");
var disableInput = document.getElementById("disableInput");
var textInput = document.getElementById("maximum_value");

enableInput.addEventListener("change", function () {
  textInput.disabled = false;
});

disableInput.addEventListener("change", function () {
  textInput.disabled = true;
  textInput.value = "";
});
