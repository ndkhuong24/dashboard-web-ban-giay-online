const token = getCookie("token");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function clearAllCookies() {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

function checkCookie() {
  var cookieName = getCookie("token");
  if (cookieName === undefined) {
    window.location.href = "/login.html";
  }
}
window.addEventListener("load", checkCookie);


//logout
document.getElementById("logoutButton").addEventListener("click", function () {
  if (token) {
    fetch("http://localhost:8081/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "You've been signed out!") {
          clearAllCookies();

          var cookieNow = getCookie("token");
          if (cookieNow === undefined) {
            window.location.href = "/login.html";
          }

          localStorage.removeItem("userData");
        } else {
          console.error("Lỗi khi đăng xuất:");
        }
      })
      .catch((error) => {
        console.log(error);
        console.error("Đăng xuất thất bại");
      });
  }
});

// const userData = localStorage.getItem("userData");
// if (userData) {
//   document.getElementById("fullname").innerText = userData;
// }

//getDS product
document.addEventListener('DOMContentLoaded', function () {

  const pagination = {
    currentPage: 0,
    totalPages: 1,
  };

  function fetchProducts(page = 0) {
    const apiUrl = `http://localhost:8081/api/Product?page=${page}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        displayProducts(data.content);
        updatePagination(data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }

  function displayProducts(products) {
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    for (const product of products) {
      const row = `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.code}</td>
                    <td>${product.name}</td>
                    <td>${product.style_id}</td>
                    <td>${product.brand_id}</td>
                    <td>${product.category_id}</td>
                    <td>${product.description}</td>
                    <td>${product.status === 1 ? 'Active' : 'Inactive'}</td>
                    <td>
                        <button class="btn btn-primary btn-sm editProductBtn" style="border-radius: 6px;" type="button" data-toggle="modal" data-target="#AddModal" data-product-id="${product.id}"">Sửa</button>
                         <br></br>
                        <button class="btn btn-danger btn-sm" style="border-radius: 6px;" type="button"  onclick="deleteProduct(${product.id})">Xóa</button>
                    </td>
                </tr>
            `;
      tableBody.insertAdjacentHTML('beforeend', row);
    }
  }

  function updatePagination(data) {
    pagination.currentPage = data.number;
    pagination.totalPages = data.totalPages;

    const currentPageElement = document.getElementById('currentPage');
    currentPageElement.textContent = `${pagination.currentPage + 1}/${pagination.totalPages}`;
  }

  function handlePaginationButtonClick(buttonId) {
    if (buttonId === 'prev-button' && pagination.currentPage > 0) {
      fetchProducts(pagination.currentPage - 1);
    } else if (buttonId === 'next-button' && pagination.currentPage < pagination.totalPages - 1) {
      fetchProducts(pagination.currentPage + 1);
    }
  }

  document.getElementById('prev-button').addEventListener('click', () => handlePaginationButtonClick('prev-button'));
  document.getElementById('next-button').addEventListener('click', () => handlePaginationButtonClick('next-button'));

  fetchProducts();

});

//load data brand,category,style
async function fetchDataForDropdown(apiUrl, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = '';

  // Add a default option
  const defaultOption = document.createElement('option');
  dropdown.add(defaultOption);

  // Fetch data from API
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }

  const data = await response.json();

  // Populate the dropdown with data
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.text = item.name;
    dropdown.add(option);
  });
}

async function fetchDropdownData() {
  try {
    // Fetch data for the Style dropdown
    await fetchDataForDropdown('http://localhost:8081/api/Style', 'style_id');

    // Fetch data for the Brand dropdown
    await fetchDataForDropdown('http://localhost:8081/api/Brand', 'brand_id');

    // Fetch data for the Category dropdown
    await fetchDataForDropdown('http://localhost:8081/api/Category', 'category_id');
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Fetch data for the dropdowns during the initial load
    await fetchDropdownData();

    // ... (Other code from your existing script)
  } catch (error) {
    console.error('Error:', error);
  }
});
var isUpdateOperation = false;

// Sự kiện mở modal
$('#AddModal').on('show.bs.modal', function (event) {
  // ... (các dòng mã khác không thay đổi)

  // Kiểm tra xem có phải là hoạt động cập nhật hay thêm mới
  isUpdateOperation = $(event.relatedTarget).data('product-id') !== undefined;

  // Thay đổi văn bản của nút dựa trên trạng thái hoạt động
  var saveChangesButton = document.getElementById('saveChanges');
  saveChangesButton.innerText = isUpdateOperation ? 'Sửa' : 'Thêm';
});

document.addEventListener('DOMContentLoaded', function () {
  // Function to open modal for creating or updating a product
  function openModalForEdit(productId) {

    // Reset modal fields
    $('#code').val('');
    $('#name').val('');
    $('#description').val('');
    $('#style_id').val('');
    $('#brand_id').val('');
    $('#category_id').val('');
    $('#active').prop('checked', true);

    // Load data for update if productId is provided
    if (productId) {
      var modalTitle = document.getElementById('modalTitle');
      modalTitle.textContent = 'Cập nhật sản phẩm';

      // Call your API to get product details by ID using Fetch
      fetch(`http://localhost:8081/api/Product/${productId}`)
        .then(response => response.json())
        .then(data => {
          // Populate modal fields with existing data
          $('#code').val(data.code);
          $('#name').val(data.name);
          $('#description').val(data.description);
          $('#style_id').val(data.style_id.id);
          $('#brand_id').val(data.brand_id.id);
          $('#category_id').val(data.category_id.id);
          $(`input[name='status'][value='${data.status}']`).prop('checked', true);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      document.getElementById('modalTitle').textContent = 'Thêm sản phẩm';
    }

    // Đặt ID sản phẩm vào trường ẩn để tham chiếu
    $('#modalProductId').val(productId);
    $('#AddModal').modal('show');
    // Sự kiện khi cửa sổ modal được hiển thị
  }
  // Event listener for the "Thêm" button
  document.getElementById('saveChanges').addEventListener('click', function () {
    // Get data from modal fields
    var productData = {
      code: $('#code').val(),
      name: $('#name').val(),
      description: $('#description').val(),
      style_id: {
        id: $('#style_id').val(),
        name: $('#style_id option:selected').text() // Lấy text của option được chọn
      },
      brand_id: {
        id: $('#brand_id').val(),
        name: $('#brand_id option:selected').text()
      },
      category_id: {
        id: $('#category_id').val(),
        name: $('#category_id option:selected').text()
      },
      status: $("input[name='status']:checked").val()
    };
    var productId = $('#modalProductId').val();

    // Check if it's an update or create operation
    var apiEndpoint = productId ? `http://localhost:8081/api/Product` : 'http://localhost:8081/api/Product';

    // Use Fetch API to send data to the API
    fetch(apiEndpoint, {
      method: productId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productId ? { id: productId, ...productData } : productData),
    })
      .then(response => response.json())
      .then(response => {
        // Handle success (close modal, update UI, etc.)
        $('#AddModal').modal('hide');
        // Additional logic for updating UI if needed
      })
      .catch(error => {
        // Handle error (show error message, etc.)
        console.error('Error:', error);
      });
  });

  // // Event listener for modal opening
  $('#AddModal').on('show.bs.modal', function (event) {
    // Get the product ID from the button that triggered the modal
    console.log('Setting title for modal display');
    var productId = $(event.relatedTarget).data('product-id');
    openModalForEdit(productId);
  });
  // // Function to open modal for updating a product
  // window.openUpdateModal = function (productId) {
  //   openModalForEdit(productId);
  // };
});