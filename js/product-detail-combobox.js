document.addEventListener("DOMContentLoaded", function () {
  var selectElement = document.getElementById("categoryID");
  fetch("http://localhost:8080/api/Category/getAll/active", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu từ API: " + error);
    });
  // if (token) {
  //   fetch("http://localhost:8080/api/Category/getAll/active", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       data.forEach((item) => {
  //         var option = document.createElement("option");
  //         option.value = item.id;
  //         option.text = item.name;
  //         selectElement.appendChild(option);
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi tải dữ liệu từ API: " + error);
  //     });
  // } else {
  //   // Xử lý trường hợp không có token (nếu cần)
  //   console.error("Không tìm thấy token.");
  //   // Ví dụ: Chuyển hướng đến trang đăng nhập
  //   window.location.href = "/login.html";
  // }
});
//brandID
document.addEventListener("DOMContentLoaded", function () {
  var selectElement = document.getElementById("brandID");

  fetch("http://localhost:8080/api/Brand/getAll/active")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu từ API: " + error);
    });
});
//sizeID
document.addEventListener("DOMContentLoaded", function () {
  var selectElement = document.getElementById("sizeID");

  fetch("http://localhost:8080/api/Size/getAll/active")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu từ API: " + error);
    });
});
//colorID
document.addEventListener("DOMContentLoaded", function () {
  var selectElement = document.getElementById("colorID");

  fetch("http://localhost:8080/api/Color/getAll/active")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu từ API: " + error);
    });
});
//soleID
document.addEventListener("DOMContentLoaded", function () {
  var selectElement = document.getElementById("soleID");

  fetch("http://localhost:8080/api/Sole/getAll/active")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu từ API: " + error);
    });
});
//materialID
document.addEventListener("DOMContentLoaded", function () {
  var selectElement = document.getElementById("materialID");

  fetch("http://localhost:8080/api/Material/getAll/active")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu từ API: " + error);
    });
});
document.addEventListener("DOMContentLoaded", function () {
  var selectElement = document.getElementById("productID");

  // Hàm để tải danh sách Style từ API
  function loadStyles(styleId) {
    return fetch("https://192.168.109.128/api/Style/id/" + styleId)
      .then((response) => response.json())
      .then((styleData) => styleData.name)
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu Style từ API: " + error);
      });
  }

  fetch("https://192.168.109.128/api/Product")
    .then((response) => response.json())
    .then((data) => {
      data.forEach(async (item) => {
        var option = document.createElement("option");
        option.value = item.id;

        // Sử dụng hàm loadStyles để lấy tên Style
        const styleName = await loadStyles(item.style_id);
        option.text = item.name + " - " + styleName;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu từ API: " + error);
    });
});
// Hàm để lấy giá trị của cookie theo tên
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
