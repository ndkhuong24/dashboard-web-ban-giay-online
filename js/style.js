// URL of the API you want to call
const apiUrl = "https://192.168.109.128/api/Style";

// Get a reference to the table
const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");

// Make the API request using fetch
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Loop through the data from the API and add it to the table
    data.forEach((item) => {
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
    });
  })
  .catch((error) => {
    console.error("Error while calling the API:", error);
  });

// Hàm để lấy dữ liệu từ API và cập nhật bảng
function fetchDataAndPopulateTable() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Clear any existing data in the table body
      tbody.innerHTML = "";

      data.forEach((item) => {
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
      });
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API:", error);
    });
}

table.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-secondary")) {
    // Hiển thị modal
    $("#confirmationModal").modal("show");

    // Xác nhận cập nhật khi người dùng nhấn nút "Xác nhận" trong modal
    document
      .getElementById("confirmUpdate")
      .addEventListener("click", function () {
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

document.getElementById("saveChanges").addEventListener("click", function () {
  // Lấy giá trị từ input tên và radio button
  const name = document.getElementById("name").value;
  const status = parseInt(
    document.querySelector('input[name="status"]:checked').value
  );

  // Kiểm tra xem trường "name" có giá trị không
  if (name.trim() === "") {
    alert("Vui lòng nhập tên trước khi thêm.");
    return; // Dừng việc gửi yêu cầu nếu trường "name" trống
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

  // Đường dẫn của API
  const apiUrl = "https://192.168.109.128/api/Style"; // Thay thế bằng đường dẫn thực tế của API

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
