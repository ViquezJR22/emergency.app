// script.js

// Navegación de pantallas
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function goToLogin() {
  showScreen("login");
}

function logout() {
  showScreen("welcome");
}

function goToMap() {
  alert("Función START no implementada aún.");
}

function toggleChat() {
  const chatBox = document.getElementById("chatBox");
  chatBox.style.display = chatBox.style.display === "none" ? "flex" : "none";
}

// LocalForage configuración
localforage.config({
  name: "EmergencyApp",
  storeName: "users"
});

// Registro de usuario
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const question = document.getElementById("regSecurityQuestion").value;
  const answer = document.getElementById("regSecurityAnswer").value.toLowerCase();

  const user = { name, email, password, question, answer };
  await localforage.setItem(email, user);
  alert("Usuario registrado correctamente.");
  showScreen("login");
});

// Inicio de sesión
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const user = await localforage.getItem(email);

  if (!user) {
    alert("Usuario no encontrado.");
    return;
  }

  if (user.password !== password) {
    alert("Contraseña incorrecta.");
    return;
  }

  showScreen("main");
});

// Olvidé mi contraseña
async function checkSecurityQuestion() {
  const email = document.getElementById("forgotEmail").value;
  const user = await localforage.getItem(email);

  if (!user) {
    alert("Usuario no encontrado.");
    return;
  }

  document.getElementById("displaySecurityQuestion").innerText = user.question;
  document.getElementById("securityQuestionSection").style.display = "block";
}

async function resetPassword() {
  const email = document.getElementById("forgotEmail").value;
  const answer = document.getElementById("forgotAnswer").value.toLowerCase();
  const user = await localforage.getItem(email);

  if (user.answer === answer) {
    const newPass = prompt("Respuesta correcta. Ingresa nueva contraseña:");
    if (newPass) {
      user.password = newPass;
      await localforage.setItem(email, user);
      alert("Contraseña restablecida.");
      showScreen("login");
    }
  } else {
    alert("Respuesta incorrecta.");
  }
}