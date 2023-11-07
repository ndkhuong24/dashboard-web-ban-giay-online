// URL of the API you want to call
const apiUrl = "https://192.168.109.128/api/Style";

// Get a reference to the table
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
  fetch(apiUrl)
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
  const status = parseInt(
    document.querySelector('input[name="status"]:checked').value
  );

  // Kiểm tra xem trường "name" có giá trị không
  if (name.trim() === "") {
    showNotification("Vui lòng nhập tên trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }

  // Tạo dữ liệu để gửi lên API
  const dataToAdd = {
    name: name,
    status: status,
  };

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
        // Sau đó có thể làm mới trang hoặc tải lại dữ liệu
        $("#AddModal").modal("hide");
        // Nếu thành công, có thể thêm logic hiển thị thông báo hoặc làm mới trang
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
  fetch(`https://192.168.109.128/api/Style/searchName/${searchPattern}`)
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

// Thêm sự kiện "click" cho toàn bộ bảng
table.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-secondary")) {
    // Xác định phần tử gần nhất có thẻ tr (dòng)
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
      // Lấy giá trị id từ dòng
      const Styleid = clickedRow.querySelector("td:first-child").textContent;

      // Gán giá trị id vào thẻ ẩn trong modal
      document.getElementById("modalStyleId").value = Styleid;

      // Hiển thị modal
      $("#confirmationModal").modal("show");
    }
  }
});

// Function để lấy dữ liệu Style bằng ID
function fetchStyleById(styleId, callback) {
  // Đường dẫn API với ID
  const apiUrl = `https://192.168.109.128/api/Style/id/${styleId}`;

  // Thực hiện yêu cầu GET đến API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }
      return response.json();
    })
    .then((data) => {
      // Gọi hàm callback với dữ liệu Style
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
  const styleIdFromModal = document.getElementById("modalStyleId").value;

  // Gọi hàm để lấy dữ liệu Style bằng ID
  fetchStyleById(styleIdFromModal, function (styleData) {
    dataToUpdate = {
      id: styleData.id,
      name: styleData.name,
      status: styleData.status === 1 ? 0 : 1,
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
        showNotification("Đã xảy ra lỗi");
      });
    $("#confirmationModal").modal("hide");
  });
});
