const apiUrl = "http://localhost:8080/api/Category";

// Get a reference to the table
const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");

const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");
const currentPageSpan = document.getElementById("currentPage");
const itemsPerPage = 5; // Số lượng mục hiển thị trên mỗi trang
let currentPage = 1; // Trang hiện tại
let totalItems = 0; // Tổng số mục dữ liệu
let totalPages = 0; // Tổng số trang

// Hàm để lấy dữ liệu từ API và cập nhật bảng
function fetchDataAndPopulateTable() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
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
function fetchData(page) {
  const url = `${apiUrl}?page=${page}&limit=${itemsPerPage}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      tbody.innerHTML = "";

      data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${
                      item.status == 1 ? "Hoạt động" : "Không hoạt động"
                    }</td>
                    <td>
                        <button class="btn btn-secondary">Update</button> 
                    </td>
                `;
        tbody.appendChild(row);
        
      });
      totalItems = data.length; // Cập nhật tổng số mục dữ liệu
      totalPages = Math.ceil(totalItems / itemsPerPage); // Tính toán tổng số tran
      updatePagination();
    })
    .catch((error) => {
      console.error("Error while calling the API:", error);
    });
}

// Hàm để cập nhật trạng thái phân trang
function updatePagination() {
  currentPageSpan.textContent = currentPage;

  const totalPagesSpan = document.getElementById("totalPages");
  totalPagesSpan.textContent = totalPages+1;
}

function updateNextPrev(){
  currentPageSpan.textContent = currentPage;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage===totalPages+1;

}

// Xử lý sự kiện khi nhấn nút "Previous"
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
  currentPage--;
  fetchData(currentPage);
  updateNextPrev();
  }
  });
  
  // Xử lý sự kiện khi nhấn nút "Next"
  nextButton.addEventListener('click', () => {
  if (tbody.children.length === itemsPerPage) {
  currentPage++;
  fetchData(currentPage);
  updateNextPrev();
  }
});
// Hàm thêm dữ liệu từ form vào table
document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = {
    name: document.getElementById("name").value,
    status: document.querySelector('input[name="status"]:checked').value,
  };

  // Gọi API để thêm dữ liệu vào cơ sở dữ liệu
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert("Thêm dữ liệu thành công!");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
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

// Gọi hàm fetchData để lấy dữ liệu ban đầu
fetchData(currentPage);