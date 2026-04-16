// ========== CONFIGURAÇÃO =========
const API_BASE = 'http://localhost:5000'; // Ajuste conforme necessário
let currentUser = null;
let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
const itemsPerPage = 10;

// ========== ELEMENTOS DO DOM ==========
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const userRole = document.getElementById('userRole');

const menuItems = document.querySelectorAll('.menu-item');
const sections = {
  dashboard: document.getElementById('dashboardSection'),
  orders: document.getElementById('ordersSection'),
  users: document.getElementById('usersSection'),
  admin: document.getElementById('adminSection')
};

const pageTitle = document.getElementById('pageTitle');

// Modais
const loadingModal = document.getElementById('loadingModal');
const confirmModal = document.getElementById('confirmModal');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');

// ========== FUNÇÕES DE UTILIDADE ==========
function showLoading(text = 'Carregando...') {
  document.getElementById('loadingText').textContent = text;
  loadingModal.style.display = 'flex';
}

function hideLoading() {
  loadingModal.style.display = 'none';
}

function showSuccess(message) {
  document.getElementById('successMessage').textContent = message;
  successModal.style.display = 'flex';
}

function showError(message) {
  document.getElementById('errorMessage').textContent = message;
  errorModal.style.display = 'flex';
}

function showConfirm(title, message, callback) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMessage').textContent = message;
  
  confirmModal.style.display = 'flex';
  
  const confirmBtn = document.getElementById('confirmBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  
  const onConfirm = () => {
    callback(true);
    closeConfirmModal();
  };
  
  const onCancel = () => {
    callback(false);
    closeConfirmModal();
  };
  
  confirmBtn.onclick = onConfirm;
  cancelBtn.onclick = onCancel;
}

function closeConfirmModal() {
  confirmModal.style.display = 'none';
}

// Fechar modais ao clicar nos botões
document.getElementById('closeSuccessBtn').addEventListener('click', () => {
  successModal.style.display = 'none';
});

document.getElementById('closeErrorBtn').addEventListener('click', () => {
  errorModal.style.display = 'none';
});

// ========== AUTENTICAÇÃO ==========
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('loginName').value;
  const role = document.getElementById('loginRole').value;
  
  if (!nome || !role) {
    showLoginError('Preencha todos os campos');
    return;
  }
  
  try {
    showLoading('Autenticando...');
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, role })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      showLoginError(data.error || 'Erro ao fazer login');
      hideLoading();
      return;
    }
    
    currentUser = data.user;
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    hideLoading();
    showLoginSuccess();
  } catch (error) {
    console.error('Erro:', error);
    showLoginError('Erro ao conectar com o servidor');
    hideLoading();
  }
});

function showLoginError(message) {
  loginError.textContent = message;
  loginError.style.display = 'block';
}

function showLoginSuccess() {
  loginPage.style.display = 'none';
  dashboardPage.style.display = 'grid';
  updateUserInfo();
  setupAdminMenu();
  loadInitialData();
}

function updateUserInfo() {
  if (currentUser) {
    userName.textContent = currentUser.nome;
    userRole.textContent = currentUser.role === 'admin' ? 'Administrador' : 'Atendente';
  }
}

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('user');
  loginPage.style.display = 'flex';
  dashboardPage.style.display = 'none';
  loginForm.reset();
  loginError.style.display = 'none';
});

// Verificar se usuário está logado ao carregar
function checkAuth() {
  const saved = localStorage.getItem('user');
  if (saved) {
    currentUser = JSON.parse(saved);
    showLoginSuccess();
  }
}

// ========== NAVEGAÇÃO ==========
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    
    menuItems.forEach(m => m.classList.remove('active'));
    item.classList.add('active');
    
    Object.values(sections).forEach(sec => {
      sec.style.display = 'none';
    });
    
    sections[page].style.display = 'block';
    pageTitle.textContent = item.textContent.trim();
    
    if (page === 'dashboard') {
      loadDashboard();
    } else if (page === 'orders') {
      loadOrders();
    } else if (page === 'users') {
      loadUsers();
    }
  });
});

// ========== DASHBOARD ==========
async function loadInitialData() {
  try {
    showLoading('Carregando dados iniciais...');
    await loadOrders();
    hideLoading();
    loadDashboard();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    hideLoading();
  }
}

async function loadDashboard() {
  try {
    // Carregar ordens
    const ordersResponse = await fetch(`${API_BASE}/orders`);
    allOrders = await ordersResponse.json();
    
    // Carregar usuários
    const usersResponse = await fetch(`${API_BASE}/auth/users`);
    const users = await usersResponse.json();
    
    // Atualizar estatísticas
    updateDashboardStats(allOrders, users);
    
    // Atualizar distribuição por status
    updateStatusDistribution(allOrders);
    
    // Atualizar ordens por atendente
    updateOrdersByAttendant(allOrders);
    
    // Habilitar ações rápidas se for admin
    setupQuickActions(users);
    
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    showError('Erro ao carregar dashboard');
  }
}

function updateDashboardStats(orders, users) {
  const totalOrders = orders.length;
  const delayedOrders = orders.filter(o => o.status === 'atrasado').length;
  const completedOrders = orders.filter(o => o.status === 'finalizado').length;
  const onlineCount = users.filter(u => u.online).length;
  
  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('delayedOrders').textContent = delayedOrders;
  document.getElementById('completedOrders').textContent = completedOrders;
  document.getElementById('onlineUsers').textContent = onlineCount;
}

function updateStatusDistribution(orders) {
  const statusMap = {
    'pendente': 'Pendente',
    'atrasado': 'Atrasado',
    'finalizado': 'Finalizado',
    'cancelado': 'Cancelado',
    'nao_concluido': 'Não Concluído',
    'suspenso': 'Suspenso'
  };
  
  const statusCount = {};
  orders.forEach(order => {
    const status = order.status || 'pendente';
    statusCount[status] = (statusCount[status] || 0) + 1;
  });
  
  const distributionDiv = document.getElementById('statusDistribution');
  distributionDiv.innerHTML = '';
  
  Object.entries(statusCount).forEach(([status, count]) => {
    const item = document.createElement('div');
    item.className = 'status-item';
    item.innerHTML = `
      <span class="status-badge status-badge-${status}">${statusMap[status]}</span>
      <span></span>
      <span class="status-count">${count}</span>
    `;
    distributionDiv.appendChild(item);
  });
}

function updateOrdersByAttendant(orders) {
  const attendantCount = {};
  orders.forEach(order => {
    if (order.responsavel) {
      attendantCount[order.responsavel] = (attendantCount[order.responsavel] || 0) + 1;
    }
  });
  
  const assigneesDiv = document.getElementById('ordersByAttendant');
  assigneesDiv.innerHTML = '';
  
  if (Object.keys(attendantCount).length === 0) {
    assigneesDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhuma ordem atribuída</p>';
    return;
  }
  
  Object.entries(attendantCount).forEach(([name, count]) => {
    const initials = name.split(' ').map(n => n[0]).join('');
    const item = document.createElement('div');
    item.className = 'assignee-item';
    item.innerHTML = `
      <div class="assignee-avatar">${initials}</div>
      <div>${name}</div>
      <span class="assignee-count">${count}</span>
    `;
    assigneesDiv.appendChild(item);
  });
}

function setupQuickActions(users) {
  const quickActionsDiv = document.getElementById('quickActionsDiv');
  if (currentUser.role === 'admin') {
    quickActionsDiv.style.display = 'grid';
  }
}

// ========== ORDENS ==========
async function loadOrders() {
  try {
    const response = await fetch(`${API_BASE}/orders`);
    allOrders = await response.json();
    filteredOrders = [...allOrders];
    currentPage = 1;
    
    // Populare filtros
    populateFilters(allOrders);
    
    // Renderizar tabela
    renderOrdersTable();
  } catch (error) {
    console.error('Erro ao carregar ordens:', error);
    showError('Erro ao carregar ordens');
  }
}

function populateFilters(orders) {
  // Extrair valores únicos
  const responsaveis = [...new Set(orders.map(o => o.responsavel).filter(Boolean))];
  const filas = [...new Set(orders.map(o => o.fila).filter(Boolean))];
  const prioridades = [...new Set(orders.map(o => o.prioridade).filter(Boolean))];
  
  // Popular Responsável
  const responsavelSelect = document.getElementById('filterResponsavel');
  responsavelSelect.innerHTML = '<option value="">Todos</option>';
  responsaveis.forEach(r => {
    const option = document.createElement('option');
    option.value = r;
    option.textContent = r;
    responsavelSelect.appendChild(option);
  });
  
  // Popular Fila
  const filaSelect = document.getElementById('filterFila');
  filaSelect.innerHTML = '<option value="">Todas</option>';
  filas.forEach(f => {
    const option = document.createElement('option');
    option.value = f;
    option.textContent = f;
    filaSelect.appendChild(option);
  });
  
  // Popular Prioridade
  const prioridadeSelect = document.getElementById('filterPrioridade');
  prioridadeSelect.innerHTML = '<option value="">Todas</option>';
  prioridades.forEach(p => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = p;
    prioridadeSelect.appendChild(option);
  });
}

document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);

function applyFilters() {
  const status = document.getElementById('filterStatus').value;
  const responsavel = document.getElementById('filterResponsavel').value;
  const fila = document.getElementById('filterFila').value;
  const prioridade = document.getElementById('filterPrioridade').value;
  const bairro = document.getElementById('filterBairro').value;
  
  filteredOrders = allOrders.filter(order => {
    if (status && order.status !== status) return false;
    if (responsavel && order.responsavel !== responsavel) return false;
    if (fila && order.fila !== fila) return false;
    if (prioridade && order.prioridade !== prioridade) return false;
    if (bairro && !order.bairro?.toLowerCase().includes(bairro.toLowerCase())) return false;
    return true;
  });
  
  currentPage = 1;
  renderOrdersTable();
}

function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  const noOrdersMsg = document.getElementById('noOrdersMsg');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const pageInfo = document.getElementById('pageInfo');
  
  if (filteredOrders.length === 0) {
    tbody.innerHTML = '';
    noOrdersMsg.style.display = 'block';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }
  
  noOrdersMsg.style.display = 'none';
  
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageOrders = filteredOrders.slice(start, end);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  
  tbody.innerHTML = pageOrders.map((order, index) => `
    <tr>
      <td class="th-small">${start + index + 1}</td>
      <td>${order.cliente || '-'}</td>
      <td>${order.os || '-'}</td>
      <td>${order.fila || '-'}</td>
      <td>${order.prioridade || '-'}</td>
      <td>${order.bairro || '-'}</td>
      <td>
        <span class="status-cell status-badge-${order.status || 'pendente'}">
          ${getStatusLabel(order.status)}
        </span>
      </td>
      <td>${order.responsavel || 'Não atribuído'}</td>
      <td>${order.dias_em_aberto || 0} dias</td>
    </tr>
  `).join('');
  
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderOrdersTable();
    }
  };
  
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderOrdersTable();
    }
  };
}

function getStatusLabel(status) {
  const labels = {
    'pendente': 'Pendente',
    'atrasado': 'Atrasado',
    'finalizado': 'Finalizado',
    'cancelado': 'Cancelado',
    'nao_concluido': 'Não Concluído',
    'suspenso': 'Suspenso'
  };
  return labels[status] || 'Desconhecido';
}

// ========== USUÁRIOS ==========
async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE}/auth/users`);
    const users = await response.json();
    
    renderUsersList(users);
    renderOnlineStatus(users);
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    showError('Erro ao carregar usuários');
  }
}

function renderUsersList(users) {
  const usersList = document.getElementById('usersList');
  usersList.innerHTML = users.map(user => `
    <div class="user-item">
      <div class="user-avatar">${user.nome.split(' ').map(n => n[0]).join('')}</div>
      <div class="user-info-text">
        <div class="user-name-text">${user.nome}</div>
        <div class="user-role-text">${user.role === 'admin' ? 'Administrador' : 'Atendente'}</div>
      </div>
      <div class="${user.online ? 'online-badge' : 'offline-badge'}"></div>
    </div>
  `).join('');
}

function renderOnlineStatus(users) {
  const onlineStatus = document.getElementById('onlineStatus');
  onlineStatus.innerHTML = users.map(user => `
    <div class="status-user-item">
      <div class="user-avatar">${user.nome.split(' ').map(n => n[0]).join('')}</div>
      <div>${user.nome}</div>
      <span class="status-badge ${user.online ? 'status-badge-finalizado' : 'status-badge-cancelado'}">
        ${user.online ? '🟢 Online' : '🔴 Offline'}
      </span>
    </div>
  `).join('');
}

// ========== ADMIN ==========
function setupAdminMenu() {
  const adminMenuBtn = document.getElementById('adminMenuBtn');
  if (currentUser.role === 'admin') {
    adminMenuBtn.style.display = 'flex';
  }
}

// Importar Backlog
document.getElementById('importBacklogBtnAdmin').addEventListener('click', () => {
  document.getElementById('backlogFileInput').click();
});

document.getElementById('backlogFileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    showLoading('Importando backlog...');
    const response = await fetch(`${API_BASE}/orders/import-excel`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    hideLoading();
    
    if (response.ok) {
      showSuccess(`Backlog importado com sucesso! ${data.total} ordens carregadas.`);
      await loadOrders();
    } else {
      showError(data.error || 'Erro ao importar backlog');
    }
  } catch (error) {
    console.error('Erro:', error);
    hideLoading();
    showError('Erro ao importar backlog');
  }
  
  e.target.value = '';
});

// Importar Finalizados
document.getElementById('importFinalizadosBtnAdmin').addEventListener('click', () => {
  document.getElementById('finalizadosFileInput').click();
});

document.getElementById('finalizadosFileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    showLoading('Importando finalizados...');
    const response = await fetch(`${API_BASE}/orders/import-finalizados`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    hideLoading();
    
    if (response.ok) {
      showSuccess(`Finalizados importados! ${data.atualizadas} ordens atualizadas.`);
      await loadOrders();
    } else {
      showError(data.error || 'Erro ao importar finalizados');
    }
  } catch (error) {
    console.error('Erro:', error);
    hideLoading();
    showError('Erro ao importar finalizados');
  }
  
  e.target.value = '';
});

// Distribuir Ordens
document.getElementById('distributeBtnAdmin').addEventListener('click', () => {
  showConfirm(
    'Distribuir Ordens',
    'Deseja distribuir as ordens entre os atendentes online?',
    async (confirmed) => {
      if (!confirmed) return;
      
      try {
        showLoading('Distribuindo ordens...');
        const response = await fetch(`${API_BASE}/admin/distribuir`, {
          method: 'POST'
        });
        
        const data = await response.json();
        hideLoading();
        
        if (response.ok) {
          showSuccess(`Ordens distribuídas! ${data.total} ordens foram atribuídas.`);
          await loadOrders();
          await loadDashboard();
        } else {
          showError(data.error || 'Erro ao distribuir ordens');
        }
      } catch (error) {
        console.error('Erro:', error);
        hideLoading();
        showError('Erro ao distribuir ordens');
      }
    }
  );
});

// Botões no Dashboard
document.getElementById('distributeBtn').addEventListener('click', () => {
  document.getElementById('distributeBtnAdmin').click();
});

document.getElementById('importBacklogBtn').addEventListener('click', () => {
  document.getElementById('importBacklogBtnAdmin').click();
});

document.getElementById('importFinalizadosBtn').addEventListener('click', () => {
  document.getElementById('importFinalizadosBtnAdmin').click();
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
  showLoading('Atualizando dados...');
  await loadOrders();
  await loadDashboard();
  hideLoading();
});

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
