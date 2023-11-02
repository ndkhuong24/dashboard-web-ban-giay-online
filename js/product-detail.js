const anhChinh = document.getElementById("anhChinh");
var anhChinhPreview = document.getElementById("anh-chinh-preview");
const anhPhu = document.getElementById("anhPhu");
var anhPhuPreview = document.getElementById("anh-phu-preview");

var anhChinhData;
var anhPhuData;

anhChinh.addEventListener("change", function (event) {
  anhChinhPreview.innerHTML = "";
  for (var i = 0; i < event.target.files.length; i++) {
    var img = document.createElement("img");
    img.src = URL.createObjectURL(event.target.files[i]);
    img.style.width = "250px";
    anhChinhPreview.appendChild(img);
  }
});

anhPhu.addEventListener("change", function (event) {
  var files = event.target.files;
  if (files.length > 4) {
    alert("Bạn chỉ có thể tải tối đa 4 ảnh");
    event.target.value = "";
    return;
  }

  anhPhuPreview.innerHTML = "";
  for (var i = 0; i < event.target.files.length; i++) {
    var img = document.createElement("img");
    img.src = URL.createObjectURL(event.target.files[i]);
    img.style.width = "250px";
    anhPhuPreview.appendChild(img);
  }
});

document.getElementById("saveChanges").addEventListener("click", function (e) {
  var file = anhChinh.files[0];

  if (file) {
    var formData = new FormData();
    formData.append("file", file);

    fetch("https://192.168.109.128/api/ProductDetail/upload-anh-chinh", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        anhChinhData = data;
        uploadanhPhu();
      })
      .catch((error) => {
        console.log("Lỗi: " + error.message);
        alert("Lỗi khi tải ảnh chính lên");
      });
  } else {
    alert("Vui lòng tải ảnh chính lên");
  }
});

function uploadanhPhu() {
  var files = anhPhu.files;

  if (files.length > 0) {
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    fetch("https://192.168.109.128/api/ProductDetail/upload-anh-phu", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        anhPhuData = data;
        console.log(anhPhuData);
        insertProductDetail();
      })
      .catch((error) => {
        console.log("Lỗi: " + error.message);
        alert("Lỗi khi tải ảnh phụ lên");
      });
  } else {
    alert("Vui lòng tải ảnh phụ lên");
  }
}

function insertProductDetail() {
  var categoryID = document.getElementById("categoryID").value;
  var brandID = document.getElementById("brandID").value;
  var productID = document.getElementById("productID").value;
  var sizeID = document.getElementById("sizeID").value;
  var colorID = document.getElementById("colorID").value;
  var soleID = document.getElementById("soleID").value;
  var materialID = document.getElementById("materialID").value;
  var quantity = document.getElementById("quantity").value;
  var price = document.getElementById("price").value;

  // Kiểm tra xem "quantity" có phải là số nguyên và lớn hơn 0 không
  if (
    anhChinhData &&
    anhPhuData &&
    categoryID &&
    brandID &&
    productID &&
    sizeID &&
    colorID &&
    soleID &&
    materialID &&
    quantity &&
    price
  ) {
    if (!/^\d+$/.test(quantity) || parseInt(quantity) <= 0) {
      alert("Số lượng phải là số nguyên lớn hơn 0.");
      return; // Không tiếp tục thực hiện nếu số lượng không hợp lệ
    }

    if (!/^\d+$/.test(quantity) || parseInt(price) <= 0) {
      alert("Đơn giá phải là số nguyên lớn hơn 0.");
      return; // Không tiếp tục thực hiện nếu số lượng không hợp lệ
    }

    // Nếu số lượng hợp lệ, tiếp tục xử lý và gửi dữ liệu
    var dataToInsert = {
      categoryID: categoryID,
      brandID: brandID,
      productID: productID,
      sizeID: sizeID,
      colorID: colorID,
      soleID: soleID,
      materialID: materialID,
      quantity: quantity,
      price: price,
      anhChinh: anhChinhData,
      anhPhu: anhPhuData,
    };
    var jsonData = JSON.stringify(dataToInsert);

    // Tạo một đối tượng cấu hình cho yêu cầu fetch
    var requestOptions = {
      method: "POST",
      body: jsonData, // Dữ liệu JSON để thêm
      headers: {
        "Content-Type": "application/json", // Đặt tiêu đề Content-Type là "application/json"
      },
    };

    // Gửi yêu cầu HTTP POST sử dụng fetch
    fetch("https://192.168.109.128/api/ProductDetail/insert", requestOptions)
      .then((response) => {
        if (response.ok) {
          alert("Dữ liệu đã được thêm thành công.");
          location.reload();
        } else {
          response.text().then((data) => {
            console.log("Lỗi: " + data);
          });
        }
      })
      .catch((error) => {
        console.log("Lỗi: " + error.message);
      });
  } else {
    alert("Vui lòng điền đầy đủ thông tin và chọn hình ảnh.");
  }
}

const table = document.getElementById("data-table");
const tbody = table.querySelector("tbody");
const perPage = 5;
let currentPage = 1;
let data = [];
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

function renderTable(data, page) {
  tbody.innerHTML = "";

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const item = data[i];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>
        <img src="https://192.168.109.128${item.path}" style="width: 100px;height: 100px;">
      </td>
      <td>${item.productName}</td>
      <td>${item.styleName}</td>
      <td>${item.quantity}</td>
      <td>${item.price}</td>
      <td>${item.status == 1 ? "Hoạt động" : "Không hoạt động"}</td>
      <td>
        <button class="btn btn-secondary">Cập nhật</button>
      </td>
    `;
    tbody.appendChild(row);
  }
}

function fetchDataAndPopulateTable() {
  fetch("https://192.168.109.128/api/ProductDetail/getAll")
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

fetchDataAndPopulateTable();
