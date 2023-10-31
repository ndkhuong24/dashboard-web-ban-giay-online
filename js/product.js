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
  fetch(`https://192.168.109.128/api/Style/id/${styleId}`)
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
    var styleIDNow = parseInt(item.style_id);
    getStyleName(styleIDNow);

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

document.getElementById("saveChanges").addEventListener("click", function () {
  // Lấy giá trị từ input tên và radio button
  const code = document.getElementById("code").value;
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const status = parseInt(
    document.querySelector('input[name="status"]:checked').value
  );
  const selectElement = document.getElementById("style_id");
  const selectedValue = parseInt(selectElement.value);

  // Kiểm tra xem trường "name" có giá trị không
  if (code.trim() === "") {
    alert("Vui lòng nhập code của sản phẩm trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (name.trim() === "") {
    alert("Vui lòng nhập tên trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }
  if (description.trim() === "") {
    alert("Vui lòng nhập miêu tả trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
  }

  // Tạo dữ liệu để gửi lên API
  const dataToAdd = {
    id: 0,
    code: code,
    name: name,
    style_id: selectedValue,
    description: description,
    create_date: "2023-10-30T09:42:15.652Z",
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

// Hàm để lấy style_id từ API style dựa trên name
function getStyleIdByName(name) {
  // Xây dựng URL API style để lấy style_id dựa trên name
  const apiUrl = `https://192.168.109.128/api/Style/name/${name}`;

  // Thực hiện cuộc gọi API
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Trả về style_id
      return data.id;
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API:", error);
      return null;
    });
}

table.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-secondary")) {
    // Hiển thị modal
    $("#confirmationModal").modal("show");

    // Xác nhận cập nhật khi người dùng nhấn nút "Xác nhận" trong modal
    document
      .getElementById("confirmUpdate")
      .addEventListener("click", async function () {
        const clickedRow = event.target.closest("tr");
        const cells = clickedRow.querySelectorAll("td");
        const id = parseInt(cells[0].textContent, 10);
        const code = cells[1].textContent;
        const name = cells[2].textContent;
        const styleName = cells[3].textContent;
        const description = cells[4].textContent;
        const createDATE = cells[5].textContent;
        const status = cells[6].textContent;
        const newStatus = status === "Hoạt động" ? 0 : 1;

        // Gọi hàm để lấy style_id từ name
        const styleID = await getStyleIdByName(styleName);

        var dataToUpdate = {
          id: id,
          code: code,
          name: name,
          style_id: styleID,
          description: description,
          create_date: createDATE,
          status: newStatus,
        };

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

        $("#confirmationModal").modal("hide");
      });
  }
});
