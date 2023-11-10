// URL of the API you want to call
const apiUrl = "http://localhost:8080/api/Voucher";

const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");

const perPage = 5; // Số lượng mục trên mỗi trang
let currentPage = 1; // Trang hiện tại

// Định nghĩa biến data và khởi tạo nó là một mảng trống
let data = [];
var notification = document.getElementById("notification");
var notificationText = document.getElementById("notification-text");

//show mess thông báo
function showNotification(message) {
  notificationText.textContent = message;
  notification.style.display = "block";

  setTimeout(function () {
    notification.style.display = "none";
  }, 3000);
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
    // console.log(item)
    const row = document.createElement("tr");
    row.innerHTML = `
      
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.code}</td>
      <td>${item.type == 0 ? "VNĐ" : "%"}</td>
      <td style="color: red;font-weight: 600;">${item.value}</td>
      <td style="color: red;font-weight: 600;">${item.maximum_value}</td>
      <td style="color: red;font-weight: 600;">${item.condition} VNĐ</td>
      <td>${item.quantity}</td>
      <td>${item.start_date}</td>
      <td>${item.end_date}</td>
      <td>${item.status == 1 ? "Còn Hạn" : "Hết Hạn"}</td>
      <td>
        <button id="capNhat" class="btn btn-primary">Cập nhật</button>
      </td>
    `;
    tbody.appendChild(row);

  }
}

// Thêm biến totalPages để tính tổng số trang
let totalPages = 1;

// Sửa hàm fetchDataAndPopulateTable để tính totalPages
function fetchDataAndPopulateTable() {
  // Lấy dữ liệu từ API và render trang đầu tiên
  fetch("http://localhost:8080/api/Voucher/getAll")
    .then((response) => response.json())
    .then((apiData) => {
      // Gán giá trị của apiData cho biến data
      data = apiData;

      // Tính totalPages dựa trên số mục và số mục trên mỗi trang
      totalPages = Math.ceil(data.length / perPage);
      // Hiển thị thông tin trang hiện tại và tổng số trang
      updatePageInfo();

      // Render trang đầu tiên
      renderTable(data, currentPage);
    })
    .catch((error) => {
      showNotification("Đã xảy ra lỗi");
    });
}

// Thêm nút điều hướng phân trang
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

// Thêm hàm để cập nhật thông tin trang
function updatePageInfo() {
  const currentPageElement = document.getElementById("currentPage");
  currentPageElement.textContent = `${currentPage}/${totalPages}`;
}

// Gọi hàm fetchDataAndPopulateTable để khởi tạo và render dữ liệu
fetchDataAndPopulateTable();

document.getElementById("saveChanges").addEventListener("click", function () {
  // Lấy giá trị từ input tên và radio button
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
  const status = parseInt(
    document.querySelector('input[name="status"]:checked').value
  );
 

  // Kiểm tra xem trường "name" có giá trị không
  if (name.trim() === "") {
    showNotification("Vui lòng nhập tên Voucher trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if(isNameExists(name)){
    showNotification("Tên đã tồn tại. Vui lòng nhập tên khác.");
    return; // Dừng việc gửi yêu cầu nếu tên đã tồn tại
  }
  if (code.trim() === "") {
    showNotification("Vui lòng nhập mã Voucher trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if(isCodeExists(code)){
    showNotification("Code đã tồn tại. Vui lòng nhập Code khác.");
    return; // Dừng việc gửi yêu cầu nếu tên đã tồn tại
  }
  if (value.trim() === "") {
    showNotification("Vui lòng nhập giá trị Voucher trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (maximum_value.trim() === "") {
    showNotification("Vui lòng nhập giá trị tối đa trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (quantity.trim() === "") {
    showNotification("Vui lòng nhập Số lượng trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (condition.trim() === "") {
    showNotification("Vui lòng nhập Điều kiện sử dụng trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }if (start_date.trim() === "") {
    showNotification("Vui lòng nhập ngày bắt đầu trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (end_date.trim() === "") {
    showNotification("Vui lòng nhập ngày kết thúc trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }

  // Tạo dữ liệu để gửi lên API
  const dataToAdd = {
    name: name,
    code:code,
    quantity:quantity,
    type:type,
    value:value,
    maximum_value:maximum_value,
    condition:condition,
    start_date:start_date,
    end_date:end_date,
    status:status,
  };
  console.log(dataToAdd);

  // Tùy chọn yêu cầu POST
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Định dạng dữ liệu là JSON
    },
    body: JSON.stringify(dataToAdd), // Chuyển đổi dữ liệu thành chuỗi JSON
  };

  // Thực hiện yêu cầu POST bằng fetch
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (response.ok) {
        tbody.innerHTML = "";
        $("#AddModal").modal("hide");
        showNotification("Thêm dữ liệu thành công");
        fetchDataAndPopulateTable();
        document.getElementById("name").value = "";
      } else {
        showNotification("Có lỗi xảy ra khi thêm dữ liệu");
      }
    })
    .catch((error) => {
      showNotification("Đã xảy ra lỗi");
    });
});
// Hàm kiểm tra xem tên đã tồn tại trong danh sách data
function isNameExists(name) {
  return data.some((item) => item.name === name);
}
// Hàm kiểm tra xem code đã tồn tại trong danh sách data
function isCodeExists(code) {
  return data.some((item) => item.code === code);
}

// Thêm sự kiện "click" cho toàn bộ bảng
table.addEventListener("click", function (event) {
  if (event.target.id === "capNhat") {
    // Xác định phần tử gần nhất có thẻ tr (dòng)
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
      // Lấy giá trị id từ dòng
      const Voucherid = clickedRow.querySelector("td:first-child").textContent;
      // Gán giá trị id vào thẻ ẩn trong modal
      document.getElementById("modalVoucherId").value = Voucherid;
      fetch(`http://localhost:8080/api/Voucher/id/${Voucherid}`)
      .then((response)=>response.json())
      .then((VoucherData)=>{
        const UpdateDiv = document.getElementById("updateVoucher")

        let isActiveChecked = "";
        let isInactiveChecked = "";

        let isActiveChecked2 = "";
        let isInactiveChecked2 = "";

          if (VoucherData.status === 1) {
            isActiveChecked = "checked";
          } else if (VoucherData.status === 0) {
            isInactiveChecked = "checked";
          }

          if(VoucherData.type===1){
            isActiveChecked2="checked";
          }else if(VoucherData.type===0){
            isInactiveChecked2="checked";
          }
          let VoucherHTML=`
          <form class="row g-10" style="font-size: small;">
                        <div class="col-md-6">
                          <label for="inputEmail4" class="form-label">Tên Voucher</label>
                          <input class="form-control" id="newName" value="${VoucherData.name}" placeholder="">
                        </div><br>
                        <div class="col-md-6">
                          <label for="inputPassword4" class="form-label">Mã Voucher</label>
                          <input type="text" class="form-control" id="newCode" value="${VoucherData.code}" placeholder="">
                        </div><br>
                        <div class="col-2">
                          <label for="inputAddress" class="form-label">Số Lượng</label>
                          <div class="buttons_added">
                            <input style="height: 38px;width:120px;border: 1px solid;border-color: rgb(201, 199, 213);border-radius: 5px;"quantity" class="input-qty" max="Số tối đa" min="Số tối thiểu" type="number" value="${VoucherData.quantity}" id="newQuantity">
                          </div>
                        </div>
                        <div class="col-4">
                          <label for="inputAddress2" class="form-label">Giá trị</label>
                          <input type="text" style="color: crimson;" class="form-control" value="${VoucherData.value}" id="newValue" placeholder="% hoặc VNĐ">
                        </div>
                        <div style="margin-top: 10px;margin-left: 15px;">
                            <fieldset>
                                <legend style="font-size: small;">Hình thức giảm</legend>
                                <label>
                                    <input type="radio" name="newType" value="0" ${isInactiveChecked2}>
                                    VNĐ
                                </label>
                                <label>
                                    <input type="radio" name="newType" value="1" ${isActiveChecked2}>
                                    %
                                </label>
                            </fieldset>
                        </div>
                        
                        <div class="col-md-6" style="margin-top: 10px;">
                            <label for="inputEmail4" class="form-label">Giá trị tối đa (Áp dụng cho voucher %)</label>
                            <input type="email" class="form-control" id="newMaximum_value" value="${VoucherData.maximum_value}" placeholder="">
                          </div><br>
                          <div class="col-md-6" style="margin-top: 10px;">
                            <label for="inputPassword4" class="form-label">Điều kiện sử dụng</label>
                            <input type="text" class="form-control" id="newCondition" value="${VoucherData.condition}" placeholder="Cho đơn hàng từ :">
                          </div><br>
                          <div class="col-6"  style="margin-top: 10px;">
                            <label for="inputCity" class="form-label">Ngày bắt đầu</label>
                            <input type="text" class="form-control" id="newStart_date" value="${VoucherData.start_date}">
                          </div>
                          <div class="col-6"  style="margin-top: 10px;">
                            <label for="inputCity" class="form-label">Ngày kết thúc</label>
                            <input type="text" class="form-control" id="newEnd_date" value="${VoucherData.end_date}" >
                          </div>
                          <div style="margin-top: 10px;margin-left: 15px;">
                            <fieldset>
                                <legend style="font-size: small;">Trạng Thái</legend>
                                <label>
                                    <input type="radio" name="newStatus" value="1" ${isActiveChecked}>
                                    Còn hạn
                                </label>
                                <label>
                                    <input type="radio" name="newStatus" value="0" ${isInactiveChecked}>
                                    Hết hạn
                                </label>
                            </fieldset>
                        </div>
                      </form>
          `;
          UpdateDiv.innerHTML=VoucherHTML;
      });
      // Hiển thị modal
      $("#confirmationModal").modal("show");
    }
  }
});
function fetchVoucherById(Voucherid, callback) {
  // Đường dẫn API với ID
  const apiUrl = `http://localhost:8080/api/Voucher/id/${Voucherid}`;

  // Thực hiện yêu cầu GET đến API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }
      return response.json();
    })
    .then((data) => {
      // Gọi hàm callback với dữ liệu Brand
      callback(data);
    })
    .catch((error) => {
      showNotification("Đã xảy ra lỗi");
    });
}

var dataToUpdate;

// Sự kiện "click" cho nút "Xác nhận" trong modal
document.getElementById("confirmUpdate").addEventListener("click", function () {
  // Lấy giá trị id từ thẻ ẩn trong modal
  const VoucherIdFromModal = document.getElementById("modalVoucherId").value;
 
  // Gọi hàm để lấy dữ liệu Style bằng ID
  fetchVoucherById(VoucherIdFromModal, function (VoucherData) {
    
    const newId = VoucherData.id;
    const newName = document.getElementById("newName").value;
    const newStatus = document.querySelector(
      'input[name="newStatus"]:checked').value;
    const newType = document.querySelector(
      'input[name="newType"]:checked').value;
    const newCode = document.getElementById("newCode").value;
    const newValue =document.getElementById("newValue").value;
    const newMaximum_value = document.getElementById("newMaximum_value").value;
    const newCondition= document.getElementById("newCondition").value;
    const newQuantity = document.getElementById("newQuantity").value;
    const newStart_date=document.getElementById("newStart_date").value;
    const newEnd_date=document.getElementById("newEnd_date").value;
    
    dataToUpdate = {
      id:newId,
      name: newName,
      code:newCode,
      quantity:newQuantity,
      type:newType,
      value:newValue,
      maximum_value:newMaximum_value,
      condition:newCondition,
      start_date:newStart_date,
      end_date:newEnd_date,
      status:newStatus,
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
        console.error(error);
      });
    $("#confirmationModal").modal("hide");
  });
});

// Tìm kiếm 
document.getElementById("searchButton").addEventListener("click", function (){
  //Lấy giá trị trong ô input
  const searchPattern = document.getElementById("searchInput").value;
  if(searchPattern.trim() === "") {
    fetchDataAndPopulateTable();
  } else {
    searchByName(searchPattern);
  }
});

function searchByName(searchPattern) {
  // Lấy dữ liệu từ API và hiển thị ở trang đầu tiên
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
      showNotification("Xảy ra lỗi");
    });
}