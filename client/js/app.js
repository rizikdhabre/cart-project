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

function goProducts() {
  window.location.href = "/products.html";
}
function goHome() {
  window.location.href = "/home.html";
}
function goCart() {
  window.location.href = "/cart.html";
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
    const loggedInUser = data.user;
    storageService.setUser(loggedInUser);
    window.location.href = "/home.html";
  } catch (error) {
    console.log(error);
  }
}

function logout() {
  storageService.clearAll();
  window.location.href = "/login.html";
}

function initLogin() {
  const user = storageService.getUser();
  if (user) {
    window.location.href = "/home.html";
  }
}

function initAdminPage() {
  const user = storageService.getUser();
  if (user === null) {
    window.location.href = "login.html";
    return;
  } else {
    if (!(user.username === "admin")) {
      window.location.href = "home.html";
      return;
    } else {
      const username = user.username;
      document.getElementById("curr-userName").textContent = username;
      renderItemsForAdmin();
    }
  }
}

async function init() {
  try {
    const user = storageService.getUser();
    if (user === null) {
      window.location.href = "login.html";
      return;
    }
    const username = user.username;
    document.getElementById("curr-userName").textContent = username;
    if (username === "admin") {
      window.location.href = "admin.html";
    }
    const items = storageService.getItems();
    if (items.length > 0) {
      renderItems(items);
    } else {
      const response = await fetch(`/api/item?userId=${user._id}`);
      const data = await response.json();
      if (!data.success) return alert(data.message);
      const loadedItems = data.items;
      if (loadedItems || loadedItems.length > 0) {
        storageService.setItems(loadedItems);
        renderItems(loadedItems);
      }
    }
  } catch (error) {
    console.log(error);
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

async function addToCart(itemId, price) {
  try {
    const loggedInUser = storageService.getUser();
    const newItem = {
      itemId: itemId,
      price: price,
      creatorId: loggedInUser._id,
      quantity: 1,
    };
    const response = await fetch("/api/addItems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    const data = await response.json();
    if (!data.success) {
      alert(data.message);
      return;
    }
    if (data.updated) {
      storageService.updateitem(data.item._id, data.item.quantity);
    } else {
      storageService.addOneItem(data.item);
      const updateditems = storageService.getItems();
      renderItems(updateditems);
    }
  } catch (error) {
    console.log(error);
  }
}

async function removeItem(itemObjId) {
  try {
    const response = await fetch(`/api/item/${itemObjId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!data.success) {
      alert(data.message);
      return;
    }
    storageService.removeOneItem(itemObjId);
    const updatedItems = storageService.getItems();
    renderItems(updatedItems);
  } catch (error) {
    console.log(error);
  }
}

function renderItems(items) {
  const tableRowsElement = document.querySelector(".table-rows");
  if (!tableRowsElement) {
    return;
  }
  const strHTMLSs = items.map((item) => {
    return `<tr>
    <th>${item.itemId}</th>
    <th>${item.quantity}</th>
    <th>${item.price}</th>
    <th class="total-price-cloumn">${item.price * item.quantity}</th>
    <th><button class="remove-btn button-style" onclick="removeItem('${
      item._id
    }')">Remove</button></th>
  </tr>`;
  });
  const totalPrice = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  const totalLine = `<tr>
    <th>Total price</th>
    <th class="final-total-price"></th>
    <th class="final-total-price"></th>
    <th class="final-total-price">${totalPrice}</th>
    <th class="final-total-price"><button class="buy-items button-style">Purchase</button></th>
  </tr>`;

  document.querySelector(".table-rows").innerHTML =
    strHTMLSs.join("") + totalLine;
}

async function renderItemsForAdmin() {
  try {
    const username = storageService.getUser();
    const response = await fetch(`/api/getAllItems/${username.username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!data.success) {
      return;
    }
    const allUsers = data.details;
    const strHTMLSs = allUsers.flatMap((user) => {
        if(user.items.length>0){
      const totalPrice = user.items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);
    
      return [
        ...user.items.map((item) => {
          return `<tr>
            <th>${user.username}</th>
            <th>${item.itemId}</th>
            <th>${item.quantity}</th>
            <th>${item.price}</th>
            <th class="total-price-column">${item.price * item.quantity}</th>
          </tr>`;
        }),
        `<tr>
          <th></th>
          <th class="final-total-price"></th>
          <th class="final-total-price"></th>
          <th class="final-total-price"></th>
          <th class="final-total-price"> Total price:${totalPrice}</th>
        </tr>`
      ];
    
    }
    });
    
    document.querySelector(".table-rows").innerHTML =
      (strHTMLSs.length > 0 ? strHTMLSs.join("") : "<tr><th colspan='5'>No items</th></tr>");
    
    

  } catch (error) {
    console.log(error);
  }
}
