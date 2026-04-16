const express = require('express');
const app = express();

app.use(express.json());

const orderRoutes = require('./src/routes/orderRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const authRoutes = require('./src/routes/authRoutes');

app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));