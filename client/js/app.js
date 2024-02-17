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

function goProducts(){
    window.location.href="/products.html"
}
function goHome(){
  window.location.href="/home.html"
}
function goCart(){
  window.location.href="/cart.html"
}



async function login(event) {
  try {
    event.preventDefault();
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
      if (!errorDiv) {
        const passwordInput = document.getElementById("password");
        showError(passwordInput, "incorrect username or password");
        return;
      }
      return;
    }
    const loggedInUser=data.user
    storageService.setUser(loggedInUser)
    window.location.href = "/home.html"
  } catch (error) {
    console.log(error);
  }
}

function logout() {
  storageService.clearAll()
  window.location.href = "/login.html"
}

function  initLogin(){
  const user=storageService.getUser()
  if(user){
    window.location.href="/home.html"
  }
}

async function init(){
  try {
    const user = storageService.getUser()
  if (user===null) {
    window.location.href = "login.html"
    return
  }
  const username=user.username
  document.getElementById("curr-userName").textContent=username
  const response = await fetch(`/api/item?userId=${user._id}`)
  const data = await response.json()
  if (!data.success) return alert(data.message)
  const loadedItems = data.items
  if (loadedItems || loadedItems.length > 0) {
    storageService.setItems(loadedItems)
    renderItems(loadedItems)
  }
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

async function addToCart(itemId,price){
  try {
    const loggedInUser = storageService.getUser()
    const newItem={
      itemId:itemId,
      price:price,
      creatorId: loggedInUser._id,
    }
    const response=await fetch("/api/addItems",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify(newItem),
    })
    const data=await response.json()
    if (!data.success) {
      alert(data.message)
      return
    }
    storageService.addOneItem(data.item)
    const updateditems = storageService.getItems()
    renderItems(updateditems)
  } catch (error) {
      console.log(error)
  }
}


function renderItems(items) {
  const strHTMLSs = items.map((item) => {
    return `<tr>
    <th>${item.itemId}</th>
    <th>Quantity</th>
    <th>${item.price}</th>
  </tr>`
  })
  document.querySelector(".table-rows").innerHTML = strHTMLSs.join("")
return
}
