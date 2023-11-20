const token = getCookie("token");

document.getElementById("logoutButton").addEventListener("click", function () {
  if (token) {
    fetch("http://localhost:8080/api/auth/logout", {
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

const userData = localStorage.getItem("userData");
if (userData) {
  //   console.log(userData);
  document.getElementById("fullname").innerText = userData;
}
