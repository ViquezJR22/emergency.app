// Variables para simular usuario registrado
const users = [];

// Mostrar u ocultar pantallas
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }
  // Mostrar/ocultar chat solo en main
  const chatWrapper = document.getElementById('chatWrapper');
  chatWrapper.style.display = (screenId === 'main') ? 'block' : 'none';
}

// Ir a login desde bienvenida
function goToLogin() {
  showScreen('login');
}

// Login
function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert('Por favor ingresa correo y contraseña.');
    return;
  }

  // Verificar usuario (simulación)
  const userExists = users.find(u => u.email === email && u.password === password);
  if (!userExists) {
    alert('Correo o contraseña incorrectos.');
    return;
  }

  showScreen('main');
}

// Registro
function register() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  if (!name || !email || !password) {
    alert('Por favor completa todos los campos.');
    return;
  }

  // Validar que email no esté registrado
  if (users.find(u => u.email === email)) {
    alert('Este correo ya está registrado.');
    return;
  }

  users.push({ name, email, password });
  alert('Cuenta creada con éxito. Ahora inicia sesión.');
  showScreen('login');
}

// Chat toggle
function toggleChat() {
  const chat = document.getElementById('chatBox');
  if (chat.style.display === 'flex') {
    chat.style.display = 'none';
  } else {
    chat.style.display = 'flex';
  }
}

// Enviar mensaje en chat
document.getElementById('sendBtn').addEventListener('click', () => {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (msg) {
    const chatMessages = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.textContent = 'Tú: ' + msg;
    chatMessages.appendChild(div);
    input.value = '';
    input.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('sendBtn').click();
  }
});

// Función START (ejemplo)
function goToMap() {
  alert('Función START activada.');
}

// Hacer funciones accesibles para HTML
window.showScreen = showScreen;
window.login = login;
window.register = register;
window.toggleChat = toggleChat;
window.goToMap = goToMap;
window.goToLogin = goToLogin;

// Inicializar, ocultar chat y bienvenida visible
document.addEventListener('DOMContentLoaded', () => {
  showScreen('welcome');
  document.getElementById('chatWrapper').style.display = 'none';
});
