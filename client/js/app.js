"use strict";
let errorDiv;
async function signup(event) {
  try {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;

    resetErrorMessages();
    if (username === "" || password === "" || email === "") {
      alert("one of the elemnts is not valid");
      return;
    }
    const credentials = {
      username,
      password,
      email,
    };

    const validationError = validationFunc(email, password);
    if (validationError === 1) {
      const emailInput = document.getElementById("email");
      showError(emailInput, "Invalid email format");
      return;
    }
    if (validationError === 2) {
      const passwordInput = document.getElementById("password");
      showError(passwordInput, "Password must be at least 8 characters");
      return;
    }

    const response = await fetch("api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    window.location.href = "login.html";
  } catch (error) {
    console.log(error);
  }
}

async function login(event) {
 try {

    event.preventDefault()
    resetErrorMessages;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    if (!data.success) {
        if(!errorDiv){
        const passwordInput = document.getElementById("password");
      showError(passwordInput, "incorrect account or password");
      return
        }
        return
    }
    window.location.href = "/home.html";
    
 } catch (error) {
        console.log(error)
 }
}

function validationFunc(email, password) {
  if (email.indexOf("@") === -1) {
    return 1;
  }
  if (password.length < 8) {
    return 2;
  }
  return 0;
}
function showError(inputElement, errorMessage) {
   errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = errorMessage;
  errorDiv.style.color = "red";
  errorDiv.style.fontFamily = "sans-serif";
  inputElement.parentNode.appendChild(errorDiv);
}

function resetErrorMessages() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => errorMessage.remove());
}


