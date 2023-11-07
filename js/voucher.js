// URL of the API you want to call
const apiUrl = "http://localhost:8080/api/Voucher";

const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");

const perPage = 5; // Số lượng mục trên mỗi trang
let currentPage = 1; // Trang hiện tại

// Định nghĩa biến data và khởi tạo nó là một mảng trống
let data = [];

function renderTable(data, page) {
  // Xóa toàn bộ dữ liệu trong tbody
  tbody.innerHTML = "";

  // Tính chỉ mục bắt đầu và chỉ mục kết thúc cho trang hiện tại
  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  // Lặp qua các mục dựa trên chỉ mục bắt đầu và kết thúc
  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const item = data[i];
    console.log(item)
    const row = document.createElement("tr");
    row.innerHTML = `
      
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.type == 0 ? "VNĐ" : "%"}</td>
      <td style="color: red;font-weight: 600;">${item.value}</td>
      <td style="color: red;font-weight: 600;">${item.maximum_value}</td>
      <td style="color: red;font-weight: 600;">${item.condition} VNĐ</td>
      <td>${item.quantity}</td>
      <td>${item.start_date}</td>
      <td>${item.end_date}</td>
      <td>${item.status == 1 ? "Còn Hạn" : "Hết Hạn"}</td>
    `;
    tbody.appendChild(row);

  }
}

// Thêm biến totalPages để tính tổng số trang
let totalPages = 1;

// Sửa hàm fetchDataAndPopulateTable để tính totalPages
function fetchDataAndPopulateTable() {
  // Lấy dữ liệu từ API và render trang đầu tiên
  fetch("http://localhost:8080/api/Voucher")
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
      console.error("Lỗi khi gọi API:", error);
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
 

  // Kiểm tra xem trường "name" có giá trị không
  if (name.trim() === "") {
    alert("Vui lòng nhập tên trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (code.trim() === "") {
    alert("Vui lòng nhập mã Voucher trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (value.trim() === "") {
    alert("Vui lòng nhập giá trị voucher trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  // if (maximum_value.trim() === "") {
  //   alert("Vui lòng nhập  trước khi thêm.");
  //   return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  // }
  if (quantity.trim() === "") {
    alert("Vui lòng nhập tên trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (condition.trim() === "") {
    alert("Vui lòng nhập tên trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }if (start_date.trim() === "") {
    alert("Vui lòng nhập ngày bắt đầu trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (end_date.trim() === "") {
    alert("Vui lòng nhập ngày kết thúc trước khi thêm.");
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
        // Nếu thành công, có thể thêm logic hiển thị thông báo hoặc làm mới trang
        alert("Thêm dữ liệu thành công.");
        // Sau đó có thể làm mới trang hoặc tải lại dữ liệu
        location.reload();
      } else {
        alert("Có lỗi xảy ra khi thêm dữ liệu.");
      }
    })
    .catch((error) => {
      console.error("Lỗi: " + error.message);
    });
});