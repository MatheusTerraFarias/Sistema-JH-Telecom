const users = require('../data/users');
const { getOrdersData } = require('./orderController');

// 🔁 Distribuição round-robin
function distribuirOrdens(ordens, atendentes) {
  ordens.forEach((ordem, index) => {
    const atendente = atendentes[index % atendentes.length];
    ordem.responsavel = atendente.nome;
  });
}

// 📤 DISTRIBUIR ORDENS
exports.distribuir = (req, res) => {
  const orders = getOrdersData();

  if (orders.length === 0) {
    return res.status(400).json({ error: 'Nenhuma ordem carregada. Importe o backlog primeiro.' });
  }

  const atendentesOnline = users.filter(
    u => u.role === 'atendente' && u.online
  );

  if (atendentesOnline.length === 0) {
    return res.status(400).json({ error: 'Nenhum atendente online' });
  }

  const ordensSemResp = orders.filter(o => !o.responsavel);

  if (ordensSemResp.length === 0) {
    return res.status(400).json({ error: 'Todas as ordens já possuem responsável' });
  }

  distribuirOrdens(ordensSemResp, atendentesOnline);

  res.json({
    message: 'Ordens distribuídas com sucesso',
    total: ordensSemResp.length,
    atendentes: atendentesOnline.map(a => a.nome)
  });
};

// 🟢 ONLINE / OFFLINE
exports.setOnline = (req, res) => {
  const { id, online } = req.body;

  if (id === undefined || online === undefined) {
    return res.status(400).json({ error: 'Campos "id" e "online" são obrigatórios' });
  }

  const user = users.find(u => u.id == id);

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  user.online = online;

  res.json({
    message: `Usuário ${user.nome} está ${online ? 'online' : 'offline'}`
  });
};

// 📊 DASHBOARD
exports.dashboard = (req, res) => {
  const orders = getOrdersData();

  const total = orders.length;
  const atrasadas = orders.filter(o => o.status === 'atrasado').length;
  const pendentes = orders.filter(o => o.status === 'pendente').length;
  const finalizadas = orders.filter(o => o.status === 'finalizado').length;

  const porAtendente = {};
  orders.forEach(o => {
    if (o.responsavel) {
      porAtendente[o.responsavel] = (porAtendente[o.responsavel] || 0) + 1;
    }
  });

  res.json({
    total,
    atrasadas,
    pendentes,
    finalizadas,
    porAtendente
  });
};