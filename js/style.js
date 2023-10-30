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
