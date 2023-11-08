const anhChinh = document.getElementById("anhChinh");
var anhChinhPreview = document.getElementById("anh-chinh-preview");
const anhPhu = document.getElementById("anhPhu");
var anhPhuPreview = document.getElementById("anh-phu-preview");
var notification = document.getElementById("notification");
var notificationText = document.getElementById("notification-text");
var anhChinhData;
var anhPhuData;

function showNotification(message) {
  notificationText.textContent = message;
  notification.style.display = "block";
  setTimeout(function () {
    notification.style.display = "none";
  }, 3000);
}

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
    showNotification("Bạn chỉ có thể tải tối đa 4 ảnh");
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
        showNotification("Lỗi khi tải ảnh chính lên");
      });
  } else {
    showNotification("Vui lòng tải ảnh chính lên");
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
        insertProductDetail();
      })
      .catch((error) => {
        console.log("Lỗi: " + error.message);
        showNotification("Lỗi khi tải ảnh phụ lên");
      });
  } else {
    showNotification("Vui lòng tải ảnh phụ lên");
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
    if (
      !/^\d+$/.test(quantity) ||
      parseInt(quantity) <= 0 ||
      parseInt(quantity) >= 2000000000
    ) {
      showNotification("Số lượng phải là số nguyên lớn hơn 0 và nhỏ hơn 2 tỷ.");
      return;
    }

    if (
      !/^\d+$/.test(price) ||
      parseInt(price) <= 0 ||
      parseInt(price) >= 2000000000
    ) {
      showNotification("Đơn giá phải là số nguyên lớn hơn 0 và nhỏ hơn 2 tỷ.");
      return;
    }

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

    var requestOptions = {
      method: "POST",
      body: jsonData,
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("https://192.168.109.128/api/ProductDetail/insert", requestOptions)
      .then((response) => {
        if (response.ok) {
          tbody.innerHTML = "";
          $("#AddModal").modal("hide");
          fetchDataAndPopulateTable();
          showNotification("Thêm dữ liệu thành công");
          document.getElementById("categoryID").selectedIndex = 0;
          document.getElementById("brandID").selectedIndex = 0;
          document.getElementById("productID").selectedIndex = 0;
          document.getElementById("sizeID").selectedIndex = 0;
          document.getElementById("colorID").selectedIndex = 0;
          document.getElementById("soleID").selectedIndex = 0;
          document.getElementById("materialID").selectedIndex = 0;
          document.getElementById("quantity").value = "";
          document.getElementById("price").value = "";
        } else {
          response.text().then((data) => {
            console.log("Lỗi: " + data);
            showNotification("Đã xảy ra lỗi");
          });
        }
      })
      .catch((error) => {
        console.log("Lỗi: " + error.message);
        showNotification("Đã xảy ra lỗi");
      });
  } else {
    showNotification("Vui lòng điền đầy đủ thông tin và chọn hình ảnh.");
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
        <img src="https://192.168.109.128${
          item.path
        }" style="width: 100px;height: 100px;">
      </td>
      <td>${item.productName}</td>
      <td>${item.styleName}</td>
      <td>${item.quantity}</td>
      <td>${item.price}</td>
      <td>${item.status == 1 ? "Hoạt động" : "Không hoạt động"}</td>
      <td>
        <button id="capNhat" class="btn btn-secondary">Cập nhật</button>
        <button id="chiTiet" class="btn btn-secondary">Chi tiết</button>
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
      showNotification("Đã xảy ra lỗi");
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

document.getElementById("searchButton").addEventListener("click", function () {
  const searchPattern = document.getElementById("searchInput").value;
  if (searchPattern.trim() === "") {
    fetchDataAndPopulateTable();
  } else {
    searchByName(searchPattern);
  }
});

function searchByName(searchPattern) {
  fetch(`https://192.168.109.128/api/ProductDetail/searchName/${searchPattern}`)
    .then((response) => response.json())
    .then((searhData) => {
      currentPage = 1;
      data = searhData;
      totalPages = Math.ceil(data.length / perPage);
      updatePageInfo();
      renderTable(data, currentPage);
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API:", error);
      showNotification("Đã xảy ra lỗi");
    });
}

table.addEventListener("click", function (event) {
  if (event.target.id === "capNhat") {
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
      const ProductId = clickedRow.querySelector("td:first-child").textContent;
      document.getElementById("modalProductId").value = ProductId;

      fetch(`https://192.168.109.128/api/ProductDetail/getById/${ProductId}`)
        .then((response) => response.json())
        .then((ProductDetailData) => {
          const productDetailDiv = document.getElementById(
            "updateProductDetail"
          );

          let isActiveChecked = "";
          let isInactiveChecked = "";

          if (ProductDetailData.status === 1) {
            isActiveChecked = "checked";
          } else if (ProductDetailData.status === 0) {
            isInactiveChecked = "checked";
          }

          let productDetailHTML = `
          <div class="mb-3 col-6">
              <label class="form-label">Quantity</label>
              <input id="newQuantity" type="text" class="form-control" value="${ProductDetailData.quantity}">
          </div>
          <div class="mb-3 col-6">
              <label class="form-label">Price</label>
              <input  id="newPrice" type="text" class="form-control" value="${ProductDetailData.price}">
          </div>
          <div class="mb-3">
              <fieldset>
                  <legend>Trạng thái</legend>
                  <label>
                      <input type="radio" id="active" name="newStatus" value="1" ${isActiveChecked}>
                      Hoạt động
                  </label>
                  <label>
                      <input type="radio" id="inactive" name="newStatus" value="0" ${isInactiveChecked}>
                      Không hoạt động
                  </label>
              </fieldset>
          </div>
          `;

          productDetailDiv.innerHTML = productDetailHTML;
        });

      $("#confirmationModal").modal("show");
    }
  }
});

table.addEventListener("click", function (event) {
  if (event.target.id === "chiTiet") {
    const clickedRow = event.target.closest("tr");
    if (clickedRow) {
      const ProductId = clickedRow.querySelector("td:first-child").textContent;

      fetch(`https://192.168.109.128/api/ProductDetail/getPDByID/${ProductId}`)
        .then((response) => response.json())
        .then((productInfo) => {
          fetch(
            `https://192.168.109.128/api/ProductDetail/getImageChinhById/${ProductId}`
          )
            .then((response) => response.json())
            .then((imageChinhInfo) => {
              fetch(
                `https://192.168.109.128/api/ProductDetail/getImagePhuById/${ProductId}`
              )
                .then((response) => response.json())
                .then((imagePhuInfo) => {
                  let productDetailHTML = `
                    <h4 style="color: black;">Thông tin chi tiết sản phẩm</h4>
                    <p style="color: black;">Tên danh mục: ${productInfo.categoryName}</p>
                    <p style="color: black;">Tên thương hiệu: ${productInfo.brandName}</p>
                    <p style="color: black;">Tên sản phẩm: ${productInfo.productName}</p>
                    <p style="color: black;">Size: ${productInfo.sizeName}</p>
                    <p style="color: black;">Color: ${productInfo.colorName}</p>
                    <p style="color: black;">Sole: ${productInfo.soleName}</p>
                    <p style="color: black;">Ảnh sản phẩm</p>
                    <img src="https://192.168.109.128${imageChinhInfo.path}" alt="Hình ảnh sản phẩm" style="max-width: 100px; max-height: 100px;">
                  `;

                  for (const image of imagePhuInfo) {
                    productDetailHTML += `
                      <img src="https://192.168.109.128${image.path}" alt="Hình ảnh sản phẩm" style="max-width: 100px; max-height: 100px;">
                    `;
                  }

                  const productDetailDiv =
                    document.getElementById("productDetail");
                  productDetailDiv.innerHTML = productDetailHTML;

                  $("#detailModal").modal("show");
                });
            });
        })
        .catch((error) => {
          console.error("Lỗi khi tải dữ liệu từ API: ", error);
          showNotification("Đã xảy ra lỗi");
        });
    }
  }
});

function fetchProductById(styleId, callback) {
  // Đường dẫn API với ID
  const apiUrl = `https://192.168.109.128/api/ProductDetail/getById/${styleId}`;

  // Thực hiện yêu cầu GET đến API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error("Lỗi: " + error);
      showNotification("Đã xảy ra lỗi");
    });
}

var dataToUpdate;

document.getElementById("confirmUpdate").addEventListener("click", function () {
  const productIdFromModal = document.getElementById("modalProductId").value;

  fetchProductById(productIdFromModal, function (productData) {
    const newId = productData.id;

    const newQuantity = document.getElementById("newQuantity").value;
    if (newQuantity.trim() === "") {
      showNotification("Vui lòng điền số lượng");
      return;
    }

    const newPrice = document.getElementById("newPrice").value;
    if (newPrice.trim() === "") {
      showNotification("Vui lòng điền đơn giá");
      return;
    }

    const newStatus = document.querySelector(
      'input[name="newStatus"]:checked'
    ).value;

    fetch(
      `https://192.168.109.128/api/ProductDetail/update?id=${newId}&quantity=${newQuantity}&price=${newPrice}&status=${newStatus}`,
      {
        method: "PUT",
      }
    )
      .then((response) => {
        if (response.ok) {
          tbody.innerHTML = "";
          fetchDataAndPopulateTable();
          showNotification("Thành công");
        } else {
          response.text().then((data) => {
            console.log("Lỗi: " + data);
            showNotification("Đã xảy ra lỗi");
          });
        }
      })
      .catch((error) => {
        console.log("Lỗi: " + error.message);
        showNotification("Đã xảy ra lỗi");
      });

    $("#confirmationModal").modal("hide");
  });
});
