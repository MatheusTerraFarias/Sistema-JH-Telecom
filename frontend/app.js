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
  agendamento: document.getElementById('agendamentoSection'),
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
  
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;
  
  if (!email || !senha) {
    showLoginError('Preencha todos os campos');
    return;
  }
  
  try {
    showLoading('Autenticando...');
    console.log('🔄 Enviando requisição para:', `${API_BASE}/auth/login`);
    console.log('📤 Dados:', { email, senha: '***' });
    
    // Simulação de login para teste (remover quando o backend estiver funcionando)
    const mockUsers = [
      { email: 'admin@jhtelecom.com', senha: 'admin123', user: { id: 1, nome: 'Admin', email: 'admin@jhtelecom.com', role: 'admin', online: true } },
      { email: 'joao@jhtelecom.com', senha: 'joao123', user: { id: 2, nome: 'João', email: 'joao@jhtelecom.com', role: 'atendente', online: true } },
      { email: 'maria@jhtelecom.com', senha: 'maria123', user: { id: 3, nome: 'Maria', email: 'maria@jhtelecom.com', role: 'atendente', online: true } }
    ];
    
    const userData = mockUsers.find(u => u.email === email && u.senha === senha);
    
    if (userData) {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('📨 Resposta simulada - status: 200');
      console.log('📨 Dados simulados:', { message: 'Login realizado com sucesso', user: userData.user });
      
      currentUser = userData.user;
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      hideLoading();
      showLoginSuccess();
      return;
    }
    
    // Se não encontrou usuário, tentar conexão real com o backend
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    
    console.log('📨 Resposta status:', response.status);
    console.log('📨 Resposta ok:', response.ok);
    
    const data = await response.json();
    console.log('📨 Dados recebidos:', data);
    
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
    console.error('❌ Erro de conexão:', error);
    console.error('❌ Mensagem:', error.message);
    showLoginError('Erro ao conectar com o servidor: ' + error.message);
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
    let url = `${API_BASE}/orders`;
    
    // Se for atendente, buscar apenas suas ordens
    if (currentUser.role === 'atendente') {
      url = `${API_BASE}/orders/minhas-ordens?atendente=${encodeURIComponent(currentUser.nome)}`;
    }
    
    const response = await fetch(url);
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
document.getElementById('searchGeral').addEventListener('keyup', applyFilters);

function applyFilters() {
  const status = document.getElementById('filterStatus').value;
  const responsavel = document.getElementById('filterResponsavel').value;
  const fila = document.getElementById('filterFila').value;
  const prioridade = document.getElementById('filterPrioridade').value;
  const bairro = document.getElementById('filterBairro').value.toLowerCase();
  const contrato = document.getElementById('filterContrato').value.toLowerCase();
  const searchGeral = document.getElementById('searchGeral').value.toLowerCase();

  const normalize = value => String(value || '').toLowerCase();
  
  filteredOrders = allOrders.filter(order => {
    if (status && order.status !== status) return false;
    if (responsavel && order.responsavel !== responsavel) return false;
    if (fila && order.fila !== fila) return false;
    if (prioridade && order.prioridade !== prioridade) return false;
    if (bairro && !normalize(order.bairro).includes(bairro)) return false;
    if (contrato && !normalize(order.contrato).includes(contrato)) return false;
    
    // Busca geral em múltiplos campos
    if (searchGeral) {
      const camposBusca = [
        normalize(order.cliente),
        normalize(order.contrato),
        normalize(order.bairro),
        normalize(order.fila),
        normalize(order.responsavel),
        normalize(order.contato),
        normalize(order.os),
        normalize(order.territorio),
        normalize(order.grupo_regiao)
      ];
      
      const encontrado = camposBusca.some(campo => campo.includes(searchGeral));
      if (!encontrado) return false;
    }
    
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
      <td>${order.contato || '-'}</td>
      <td>${order.contrato || '-'}</td>
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
      <td>
        <button class="btn btn-small agendarBtn" data-os="${order.os}" data-contrato="${order.contrato}" data-cliente="${order.cliente}" data-contato="${order.contato}">
          📅 Agendar
        </button>
      </td>
    </tr>
  `).join('');
  
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  
  // Adicionar listeners aos botões de agendar
  document.querySelectorAll('.agendarBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const os = e.target.dataset.os;
      const contrato = e.target.dataset.contrato;
      const cliente = e.target.dataset.cliente;
      const contato = e.target.dataset.contato;
      openAgendamentoModal(os, contrato, cliente, contato);
    });
  });
  
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
  const agendamentoBtnMenu = document.getElementById('agendamentoBtnMenu');
  
  if (currentUser.role === 'admin') {
    adminMenuBtn.style.display = 'flex';
  }
  
  // Mostrar agendamento para atendentes
  if (currentUser.role === 'atendente') {
    agendamentoBtnMenu.style.display = 'flex';
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

// ========== CONFIGURAÇÃO DE ATENDENTES POR TIPO DE SERVIÇO ==========
let atendentesDisponiveis = [];

async function setupConfigAtendentes() {
  try {
    showLoading('Carregando configurações...');
    
    // Carregar tipos de serviço
    const typesRes = await fetch(`${API_BASE}/orders/tipos-servico`);
    const tiposServico = await typesRes.json();
    
    // Carregar configuração atual
    const configRes = await fetch(`${API_BASE}/orders/atendente-servico`);
    const configAtual = await configRes.json();
    
    // Carregar lista de atendentes (a partir das users)
    atendentesDisponiveis = ['João', 'Maria', 'Carlos'];
    
    hideLoading();
    
    // Renderizar a interface
    const configDiv = document.getElementById('configAtendentesDiv');
    configDiv.innerHTML = '';
    
    tiposServico.forEach(tipo => {
      const atendentesSelecionados = configAtual[tipo] || [];
      
      const div = document.createElement('div');
      div.className = 'servico-config';
      
      let htmlSelects = '<div style="flex: 1;">';
      htmlSelects += `<div class="servico-config-label">📋 ${tipo}</div>`;
      htmlSelects += '<select multiple class="servico-config-select" data-tipo="' + tipo + '">';
      
      atendentesDisponiveis.forEach(atendente => {
        const selected = atendentesSelecionados.includes(atendente) ? 'selected' : '';
        htmlSelects += `<option value="${atendente}" ${selected}>${atendente}</option>`;
      });
      
      htmlSelects += '</select>';
      htmlSelects += '<small style="color: var(--text-secondary); margin-top: 5px; display: block;">Ctrl+Click para selecionar múltiplos</small>';
      htmlSelects += '</div>';
      
      div.innerHTML = htmlSelects;
      configDiv.appendChild(div);
    });
    
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    hideLoading();
    showError('Erro ao carregar configurações de atendentes');
  }
}

async function saveConfigAtendentes() {
  try {
    showLoading('Salvando configuração...');
    
    const selects = document.querySelectorAll('.servico-config-select');
    const mapeamento = {};
    
    selects.forEach(select => {
      const tipo = select.dataset.tipo;
      const atendentes = Array.from(select.selectedOptions).map(opt => opt.value);
      mapeamento[tipo] = atendentes;
    });
    
    const response = await fetch(`${API_BASE}/orders/atendente-servico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mapeamento })
    });
    
    const data = await response.json();
    hideLoading();
    
    if (response.ok) {
      showSuccess(`Configuração salva! ${data.totalOrdensDist} ordens foram redistribuídas.`);
      await loadOrders();
    } else {
      showError(data.error || 'Erro ao salvar configuração');
    }
  } catch (error) {
    console.error('Erro:', error);
    hideLoading();
    showError('Erro ao salvar configuração');
  }
}

document.getElementById('salvarConfigBtn').addEventListener('click', saveConfigAtendentes);

// Carregar configuração ao clicar no admin
let configAtendentesLoaded = false;
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    
    if (page === 'admin' && currentUser.role === 'admin' && !configAtendentesLoaded) {
      setupConfigAtendentes();
      configAtendentesLoaded = true;
    }
  });
});

// ========== AGENDAMENTO ===========
// ========== MODAL DE AGENDAMENTO ==========
const agendamentoModal = document.getElementById('agendamentoModal');
const agendamentoForm = document.getElementById('agendamentoForm');

function openAgendamentoModal(os, contrato, cliente, telefone) {
  document.getElementById('modalContrato').value = contrato;
  document.getElementById('modalOS').value = os;
  document.getElementById('modalCliente').value = cliente;
  document.getElementById('modalTelefone').value = telefone;
  document.getElementById('modalDataAgendamento').value = '';
  document.getElementById('modalHoraAgendamento').value = '';
  document.getElementById('modalObservacoes').value = '';
  
  agendamentoModal.style.display = 'flex';
}

function closeAgendamentoModal() {
  agendamentoModal.style.display = 'none';
}

document.getElementById('cancelAgendamentoBtn').addEventListener('click', closeAgendamentoModal);

// Fechar modal ao clicar fora
agendamentoModal.addEventListener('click', (e) => {
  if (e.target === agendamentoModal) {
    closeAgendamentoModal();
  }
});

// Submeter formulário de agendamento
agendamentoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const os = document.getElementById('modalOS').value;
  const data_agendamento = document.getElementById('modalDataAgendamento').value;
  const hora = document.getElementById('modalHoraAgendamento').value;
  const observacoes = document.getElementById('modalObservacoes').value;
  
  if (!os || !data_agendamento || !hora) {
    showError('Preencha os campos obrigatórios (OS, data e hora)');
    return;
  }
  
  try {
    showLoading('Agendando ordem...');
    const response = await fetch(`${API_BASE}/orders/agendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ os, data_agendamento, hora, observacoes })
    });
    
    const data = await response.json();
    hideLoading();
    
    if (response.ok) {
      showSuccess('Ordem agendada com sucesso!');
      closeAgendamentoModal();
      loadAgendamentos();
      // Recarregar tabela de ordens se estiver visível
      if (document.getElementById('ordersSection').style.display !== 'none') {
        renderOrdersTable();
      }
    } else {
      showError(data.error || 'Erro ao agendar ordem');
    }
  } catch (error) {
    console.error('Erro:', error);
    hideLoading();
    showError('Erro ao agendar ordem');
  }
});

// Carregar agendamentos na página de agendamentos
// ========== AGENDAMENTOS ==========
let allAgendamentos = [];
let filteredAgendamentos = [];

async function loadAgendamentos() {
  try {
    let url = `${API_BASE}/orders/agendamentos`;
    
    // Se for atendente, filtrar por suas ordens
    if (currentUser.role === 'atendente') {
      url = `${API_BASE}/orders/agendamentos?atendente=${encodeURIComponent(currentUser.nome)}`;
    }
    
    const response = await fetch(url);
    allAgendamentos = await response.json();
    
    const agendamentosSection = document.getElementById('agendamentoSection');
    
    if (agendamentosSection.style.display === 'none') {
      return; // Não carregar se a página não está visível
    }
    
    // Preencher o select de responsáveis
    populateAgendamentoFilters();
    
    // Aplicar filtros e exibir
    applyAgendamentosFilters();
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error);
  }
}

function populateAgendamentoFilters() {
  const responsavelSelect = document.getElementById('filterAgendamentoResponsavel');
  const responsaveis = [...new Set(allAgendamentos.map(a => a.responsavel).filter(Boolean))];
  
  responsavelSelect.innerHTML = '<option value="">Todos</option>';
  responsaveis.forEach(r => {
    const option = document.createElement('option');
    option.value = r;
    option.textContent = r;
    responsavelSelect.appendChild(option);
  });
}

function applyAgendamentosFilters() {
  const cliente = document.getElementById('filterAgendamentoCliente').value.toLowerCase();
  const responsavel = document.getElementById('filterAgendamentoResponsavel').value;
  const dataDe = document.getElementById('filterAgendamentoDataDe').value;
  const dataAte = document.getElementById('filterAgendamentoDataAte').value;
  
  filteredAgendamentos = allAgendamentos.filter(agendamento => {
    if (cliente && !agendamento.cliente?.toLowerCase().includes(cliente)) return false;
    if (responsavel && agendamento.responsavel !== responsavel) return false;
    
    if (dataDe) {
      const dataAgend = new Date(agendamento.data_agendamento);
      const dataFiltro = new Date(dataDe);
      if (dataAgend < dataFiltro) return false;
    }
    
    if (dataAte) {
      const dataAgend = new Date(agendamento.data_agendamento);
      const dataFiltro = new Date(dataAte);
      if (dataAgend > dataFiltro) return false;
    }
    
    return true;
  });
  
  renderAgendamentosTable();
}

function renderAgendamentosTable() {
  const tbody = document.getElementById('agendamentosTableBody');
  const noMsg = document.getElementById('noAgendamentosMsg');
  
  if (filteredAgendamentos.length === 0) {
    tbody.innerHTML = '';
    noMsg.style.display = 'block';
    return;
  }
  
  noMsg.style.display = 'none';
  tbody.innerHTML = filteredAgendamentos.map(agendamento => `
    <tr>
      <td>${agendamento.contrato || agendamento.os || '-'}</td>
      <td>${agendamento.cliente || '-'}</td>
      <td>${agendamento.contato || '-'}</td>
      <td>${agendamento.data_agendamento || '-'}</td>
      <td>${agendamento.hora || '-'}</td>
      <td>${agendamento.responsavel || '-'}</td>
      <td>${agendamento.observacoes || '-'}</td>
    </tr>
  `).join('');
}

// Event listeners dos filtros
document.getElementById('applyAgendamentosFiltersBtn').addEventListener('click', applyAgendamentosFilters);
document.getElementById('filterAgendamentoCliente').addEventListener('keyup', applyAgendamentosFilters);
document.getElementById('filterAgendamentoResponsavel').addEventListener('change', applyAgendamentosFilters);
document.getElementById('filterAgendamentoDataDe').addEventListener('change', applyAgendamentosFilters);
document.getElementById('filterAgendamentoDataAte').addEventListener('change', applyAgendamentosFilters);

// Handler para quando clica no menu Agendamento
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    
    if (page === 'agendamento' && currentUser) {
      loadAgendamentos();
    }
  });
});

// ========== INICIALIZAÇÃO =========
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
