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

const token = getCookie("token");

document.addEventListener("DOMContentLoaded", function () {
  if (token) {
    var selectElement = document.getElementById("categoryID");
    fetch("http://localhost:8080/api/Category/getAll/active", {
      method: "GET",
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
  } else {
    console.error("Không tìm thấy token.");
    window.location.href = "/login.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (token) {
    var selectElement = document.getElementById("brandID");
    fetch("http://localhost:8080/api/Brand/getAll/active", {
      method: "GET",
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
  } else {
    console.error("Không tìm thấy token.");
    window.location.href = "/login.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (token) {
    var selectElement = document.getElementById("sizeID");
    fetch("http://localhost:8080/api/Size/getAll/active", {
      method: "GET",
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
  } else {
    console.error("Không tìm thấy token.");
    window.location.href = "/login.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (token) {
    var selectElement = document.getElementById("colorID");
    fetch("http://localhost:8080/api/Color/getAll/active", {
      method: "GET",
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
  } else {
    console.error("Không tìm thấy token.");
    window.location.href = "/login.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (token) {
    var selectElement = document.getElementById("soleID");
    fetch("http://localhost:8080/api/Sole/getAll/active", {
      method: "GET",
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
  } else {
    console.error("Không tìm thấy token.");
    window.location.href = "/login.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (token) {
    var selectElement = document.getElementById("materialID");
    fetch("http://localhost:8080/api/Material/getAll/active", {
      method: "GET",
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
  } else {
    console.error("Không tìm thấy token.");
    window.location.href = "/login.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var selectElement = document.getElementById("productID");

  function loadStyles(styleId) {
    return fetch("http://localhost:5192/api/Style/id/" + styleId)
      .then((response) => response.json())
      .then((styleData) => styleData.name)
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu Style từ API: " + error);
      });
  }

  fetch("http://localhost:5192/api/Product")
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
