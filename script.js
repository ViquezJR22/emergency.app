// --- ELEMENTOS DEL DOM ---
const menuIcon = document.getElementById('menuIcon');
const userPanel = document.getElementById('userPanel');
const avatarImage = document.getElementById('avatarImage');
const fileInput = document.getElementById('fileInput');
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");
const toggleChatBtn = document.getElementById("toggleChatBtn");
const chatForm = document.getElementById("chatForm");

// --- PANEL DE USUARIO ---
menuIcon.addEventListener('click', () => userPanel.classList.toggle('show'));

document.addEventListener('click', e => {
  if (!userPanel.contains(e.target) && !menuIcon.contains(e.target)) {
    userPanel.classList.remove('show');
  }
});

// Cambiar foto de perfil
document.getElementById('changePhoto').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    avatarImage.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Cambiar idioma
document.getElementById('changeLanguage').addEventListener('click', () => {
  const currentLang = document.documentElement.lang || 'es';
  document.documentElement.lang = currentLang === 'es' ? 'en' : 'es';
  alert(`Idioma cambiado a ${document.documentElement.lang}`);
});

// Cambiar cuenta / Logout / Inicio
document.getElementById('switchAccount').addEventListener('click', () => window.location.href = '/login');
document.getElementById('logout').addEventListener('click', () => {
  alert('Sesión cerrada');
  window.location.href = '/login';
});
document.getElementById('goHome').addEventListener('click', () => window.location.href = '/');

// --- GESTIÓN DE PANTALLAS ---
const screens = document.querySelectorAll(".screen");
const toggleButtons = document.querySelectorAll(".toggle-screen");
toggleButtons.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const targetId = btn.dataset.target;
    screens.forEach(s => s.classList.remove("active"));
    document.getElementById(targetId).classList.add("active");
  });
});

// --- LOCALFORAGE CONFIG ---
localforage.config({ name: "EmergencyApp", storeName: "users" });

// --- REGISTRO ---
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const password = document.getElementById("regPassword").value;
  const question = document.getElementById("regSecurityQuestion").value;
  const answer = document.getElementById("regSecurityAnswer").value.trim();

  if (!name || !email || !password || !question || !answer) {
    alert("Completa todos los campos.");
    return;
  }

  const existing = await localforage.getItem(email);
  if (existing) {
    alert("Usuario ya registrado.");
    return;
  }

  const user = { name, email, password, question, answer };
  await localforage.setItem(email, user);
  alert("Usuario registrado con éxito.");

  screens.forEach(s => s.classList.remove("active"));
  document.getElementById("login").classList.add("active");
});

// --- LOGIN ---
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const user = await localforage.getItem(email);
  if (!user || user.password !== password) {
    alert("Correo o contraseña incorrectos.");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById("main").classList.add("active");
  alert(`Bienvenido ${user.name}`);
});

// --- OLVIDÉ CONTRASEÑA ---
document.getElementById("checkSecurityBtn").addEventListener("click", async () => {
  const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
  const user = await localforage.getItem(email);
  if (!user) { alert("Usuario no encontrado."); return; }
  document.getElementById("displaySecurityQuestion").textContent = user.question;
  document.getElementById("securityQuestionSection").style.display = "block";
});

document.getElementById("resetPasswordBtn").addEventListener("click", async () => {
  const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
  const answer = document.getElementById("forgotAnswer").value.trim();
  const user = await localforage.getItem(email);
  if (user.answer !== answer) { alert("Respuesta incorrecta."); return; }
  const newPassword = prompt("Ingresa tu nueva contraseña:");
  if (newPassword) {
    user.password = newPassword;
    await localforage.setItem(email, user);
    alert("Contraseña actualizada.");
    screens.forEach(s => s.classList.remove("active"));
    document.getElementById("login").classList.add("active");
  }
});

// --- TOGGLE PASSWORD ---
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = document.getElementById(icon.dataset.target);
    input.type = input.type === "password" ? "text" : "password";
  });
});

// --- MODAL DE REPORTE ---
function showReport() { document.getElementById('reportModal').style.display = 'flex'; }
function closeReportModal() { document.getElementById('reportModal').style.display = 'none'; }

// --- SUBIDA DE IMAGEN ---
const uploadBox = document.getElementById('uploadBox');
const uploadInner = document.getElementById('uploadInner');

uploadBox.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    uploadBox.style.backgroundImage = `url(${reader.result})`;
    uploadBox.style.backgroundSize = 'cover';
    uploadBox.style.backgroundPosition = 'center';
    uploadInner.style.display = 'none';
  };
  reader.readAsDataURL(file);
});

// --- SELECCIÓN DE SERVICIO ---
let selectedService = '';
document.querySelectorAll('.svc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.svc-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedService = btn.textContent.trim();
  });
});
document.getElementById('btnAceptar').addEventListener('click', () => {
  alert(selectedService ? `Servicio seleccionado: ${selectedService}` : 'Selecciona un servicio.');
  closeReportModal();
});

// --- CONTACTOS ---
const contactsModal = document.getElementById("contactsModal");
function showContactsModal() { contactsModal.style.display = "flex"; }
function closeContactsModal() { contactsModal.style.display = "none"; }
function callNumber(num) { alert(`Llamando al número: ${num}`); }
function addContact() {
  const name = prompt("Nombre del contacto:");
  const number = prompt("Número del contacto:");
  if (name && number) {
    const grid = document.getElementById("highPriorityGrid");
    const btn = document.createElement("button");
    btn.innerHTML = `<span class="icon">⭐</span>${name} (${number})`;
    btn.onclick = () => callNumber(number);
    grid.style.display = "grid";
    grid.appendChild(btn);
  }
}

// --- CHATBOT FUNCIONAL ---
const tree = {
  start: { message: "Hola! ¿Cuál es tu síntoma principal?", options: ["Fiebre", "Dolor de cabeza", "Tos"] },
  "Fiebre": { message: "¿Desde cuándo tienes fiebre?", options: ["1-2 días", "Más de 3 días"] },
  "Dolor de cabeza": { message: "¿El dolor de cabeza es intenso o leve?", options: ["Intenso", "Leve"] },
  "Tos": { message: "¿Es seca o con flema?", options: ["Seca", "Con flema"] },
  "1-2 días": { message: "Puede ser una infección viral leve." },
  "Más de 3 días": { message: "Te recomendamos acudir al médico." },
  "Intenso": { message: "Podría ser migraña. Descansa e hidrátate." },
  "Leve": { message: "Puedes tomar analgésicos y descansar." },
  "Seca": { message: "Mantente hidratado y vigila si aparece fiebre." },
  "Con flema": { message: "Podría ser una infección respiratoria, consulta al médico." }
};

let currentNode = "start";

function showMessage(text, isUser=false) {
  const div = document.createElement("div");
  div.className = isUser ? "user-message" : "bot-message";
  div.innerText = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showOptions(node) {
  const n = tree[node];
  if (!n.options) return;
  const container = document.createElement("div");
  container.className = "options-container";
  n.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.className = "chat-option";
    btn.onclick = () => {
      showMessage(opt, true);
      container.remove();
      currentNode = opt;
      showMessage(tree[opt].message);
      showOptions(opt);
    };
    container.appendChild(btn);
  });
  chatMessages.appendChild(container);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function initChat() {
  currentNode = "start";
  chatMessages.innerHTML = "";
  showMessage(tree.start.message);
  showOptions("start");
}

// Enviar mensaje
sendBtn.addEventListener("click", () => {
  const text = chatInput.value.trim();
  if (!text) return;
  showMessage(text, true);
  chatInput.value = "";
  initChat();
});

// Toggle chat
toggleChatBtn.addEventListener("click", () => {
  chatBox.style.display = chatBox.style.display === "block" ? "none" : "block";
});

// Inicializar chat
initChat();
