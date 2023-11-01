const apiUrl = "https://192.168.109.128/api/Product";

const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");

const perPage = 5;
let currentPage = 1;

let data = [];

let totalPages = 1;

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

function GetStyleNameById(styleId) {
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

function GetStyleIdByName(style_name) {
  const apiUrl = `https://192.168.109.128/api/Style/name/${style_name}`;
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      return data.id;
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API:", error);
      return null;
    });
}

function renderTable(data, page) {
  tbody.innerHTML = "";

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

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
    GetStyleNameById(styleIDNow);

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
      console.error("Lỗi khi gọi API:", error);
    });
}

function updatePageInfo() {
  const currentPageElement = document.getElementById("currentPage");
  currentPageElement.textContent = `${currentPage}/${totalPages}`;
}

fetchDataAndPopulateTable();

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

table.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-secondary")) {
    $("#confirmationModal").modal("show");

    // Xác nhận cập nhật khi người dùng nhấn nút "Xác nhận" trong modal
    document
      .getElementById("confirmUpdate")
      .addEventListener("click", async function () {
        const clickedRow = event.target.closest("tr");
        const cells = clickedRow.querySelectorAll("td");
        const id = parseInt(cells[0].textContent);
        const code = cells[1].textContent;
        const name = cells[2].textContent;
        const style_name = cells[3].textContent;
        const description = cells[4].textContent;
        const create_date = cells[5].textContent;
        const status = cells[6].textContent;
        const newStatus = status === "Hoạt động" ? 0 : 1;
        const style_id = await GetStyleIdByName(style_name);

        var dataToUpdate = {
          id: id,
          code: code,
          name: name,
          style_id: style_id,
          description: description,
          create_date: create_date,
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
