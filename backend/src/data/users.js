// ⚠️ Dados em memória — substituir por banco de dados (Prisma) futuramente
const users = [
  { id: 1, nome: "Admin", role: "admin", online: true },
  { id: 2, nome: "João", role: "atendente", online: true },
  { id: 3, nome: "Maria", role: "atendente", online: true },
  { id: 4, nome: "Carlos", role: "atendente", online: false }
];

module.exports = users;