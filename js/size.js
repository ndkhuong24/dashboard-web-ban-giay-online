// URL of the API you want to call
const apiUrl = "http://localhost:8080/api/Size";

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
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.status == 1 ? "Hoạt động" : "Không hoạt động"}</td>
      <td>
        <button class="btn btn-secondary">Cập nhật</button>
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
  fetch("http://localhost:8080/api/Size/getAll")
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


// Hàm thêm dữ liệu từ form vào table
document.getElementById("saveChanges").addEventListener("click", function () {
  // Lấy giá trị từ input tên và radio button
  const name = document.getElementById("name").value;
  const status = parseInt(
    document.querySelector('input[name="status"]:checked').value
  );

  // Kiểm tra xem trường "name" có giá trị không
  if (name.trim() === "") {
    showNotification("Vui lòng nhập tên trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (isNameExists(name)) {
    showNotification("Tên đã tồn tại. Vui lòng chọn tên khác.");
    return; // Dừng việc gửi yêu cầu nếu tên đã tồn tại
  }

  // Tạo dữ liệu để gửi lên API
  const dataToAdd = {
    name: name,
    status: status,
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
        alert("Có lỗi xảy ra khi thêm dữ liệu.");
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

table.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-secondary")) {
    // Hỏi người dùng xác nhận
    const confirmation = confirm("Bạn có chắc chắn muốn cập nhật dữ liệu?");

    if (confirmation) {
      // Người dùng đã xác nhận
      // Thực hiện cập nhật dữ liệu
      const clickedRow = event.target.closest("tr");
      const cells = clickedRow.querySelectorAll("td");
      const id = parseInt(cells[0].textContent, 10);
      const name = cells[1].textContent;
      const status = cells[2].textContent;

      const newStatus = status === "Hoạt động" ? 0 : 1;

      var dataToUpdate = {
        id: id,
        name: name,
        status: newStatus,
      };

      // Tùy chọn yêu cầu PUT
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToUpdate),
      };

      fetch(apiUrl, requestOptions)
        .then((response) => {
          if (response.ok) {
            alert("Dữ liệu đã được cập nhật thành công.");
            // Xóa dữ liệu cũ và cập nhật bảng
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
    }
  }
});

//search
document.getElementById("searchButton").addEventListener("click", function () {
  // Lấy giá trị tìm kiếm từ trường input
  const searchPattern = document.getElementById("searchInput").value;
  if (searchPattern.trim() === "") {
    fetchDataAndPopulateTable();
  } else {
    searchByName(searchPattern);
  }
});
function searchByName(searchPattern) {
  // Lấy dữ liệu từ API và render trang đầu tiên
  fetch(`http://localhost:8080/api/Size/${searchPattern}`)
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

