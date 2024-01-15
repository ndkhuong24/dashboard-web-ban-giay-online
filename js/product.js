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
                    <td>${product.style}</td>
                    <td>${product.brand}</td>
                    <td>${product.category}</td>
                    <td>${product.description}</td>
                    <td>${product.createDate}</td>
                    <td>${product.status === 1 ? 'Active' : 'Inactive'}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="editProduct(${product.id})">Sửa</button>
                        <br></br>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Xóa</button>
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
//thêm product



