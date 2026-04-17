// ⚠️ Dados em memória — substituir por banco de dados (Prisma) futuramente

const users = [
  { 
    id: 1, 
    nome: "Admin", 
    email: "admin@jhtelecom.com", 
    senha: "admin123", // Em produção, fazer hash com bcrypt
    role: "admin", 
    online: false 
  },
  { 
    id: 2, 
    nome: "João", 
    email: "joao@jhtelecom.com", 
    senha: "joao123", 
    role: "atendente", 
    online: false 
  },
  { 
    id: 3, 
    nome: "Maria", 
    email: "maria@jhtelecom.com", 
    senha: "maria123", 
    role: "atendente", 
    online: false 
  },
  { 
    id: 4, 
    nome: "Carlos", 
    email: "carlos@jhtelecom.com", 
    senha: "carlos123", 
    role: "atendente", 
    online: false 
  }
];

module.exports = users;