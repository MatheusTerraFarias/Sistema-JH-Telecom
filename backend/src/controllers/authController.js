const users = require('../data/users');

// 🔐 LOGIN simples (sem JWT por enquanto)
exports.login = (req, res) => {
  const { nome, role } = req.body;

  if (!nome || !role) {
    return res.status(400).json({ error: 'Campos "nome" e "role" são obrigatórios' });
  }

  const user = users.find(u => u.nome === nome && u.role === role);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  res.json({
    message: 'Login realizado com sucesso',
    user: {
      id: user.id,
      nome: user.nome,
      role: user.role
    }
  });
};

// 📋 LISTAR USUÁRIOS
exports.getUsers = (req, res) => {
  const result = users.map(({ id, nome, role, online }) => ({
    id, nome, role, online
  }));
  res.json(result);
};