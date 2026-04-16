# 🔧 Guia de Configuração - JH Telecom

## 📋 Índice
1. [Requisitos](#requisitos)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Executar Sistema](#executar-sistema)
5. [Primeiros Passos](#primeiros-passos)
6. [Troubleshooting](#troubleshooting)

---

## 📦 Requisitos

### Obrigatório
- **Node.js** 14+ ([Download](https://nodejs.org/))
- **npm** (vem com Node.js)
- **Navegador moderno** (Chrome, Firefox, Edge, Safari)

### Opcional
- **Python 3** (para servir o frontend)
- **Git** (para controle de versão)

---

## 📥 Instalação

### 1️⃣ Clonar ou Baixar o Repositório

```bash
# Com Git
git clone https://github.com/MatheusTerraFarias/Sistema-JH-Telecom.git
cd Sistema-JH-Telecom

# Ou extrair o ZIP
```

### 2️⃣ Instalar Dependências do Backend

```bash
cd backend
npm install
```

As seguintes dependências serão instaladas:
- ✅ Express 5.2.1
- ✅ Prisma 7.7.0
- ✅ bcrypt 6.0.0
- ✅ jsonwebtoken 9.0.3
- ✅ date-fns 4.1.0
- ✅ xlsx 0.18.5
- ✅ csv-parser 3.2.0
- ✅ nodemon 3.1.14

---

## ⚙️ Configuração

### Backend (server.js)

O arquivo `backend/server.js` deve estar configurado para rodar na porta `5000`:

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

### Frontend (app.js)

O arquivo `frontend/app.js` precisa da URL correta do backend:

```javascript
const API_BASE = 'http://localhost:5000'; // ← Altere se necessário
```

---

## 🚀 Executar Sistema

### Opção 1: Terminal Único (Recomendado)

#### Windows (PowerShell):
```powershell
cd backend
npm start
```

Deixe rodando. Em outro terminal:
```powershell
python -m http.server 8000
```

#### Linux/Mac:
```bash
cd backend
npm start

# Em outro terminal:
cd frontend
python -m http.server 8000
```

### Opção 2: Script de Inicialização

#### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

#### Windows (PowerShell):
```powershell
# Execute manualmente os comandos do start.sh
cd backend
npm install
npm start
```

### Opção 3: Manual Completo

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```

Saída esperada:
```
✅ Servidor rodando em http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 8000
```

Saída esperada:
```
Serving HTTP on 0.0.0.0 port 8000
```

---

## 🎯 Primeiros Passos

### 1. Abrir a Aplicação

Acesse em seu navegador:
```
http://localhost:8000
```

### 2. Fazer Login

Use uma das contas de teste:

```
Usuário: Admin
Tipo: admin
Senha: (simplesmente clique em "Entrar")
```

**Outras contas disponíveis:**
- João / atendente
- Maria / atendente
- Carlos / atendente

### 3. Explorar Dashboard

- 📊 **Dashboard:** Veja estatísticas gerais
- 📋 **Ordens:** Gerencie ordens (vazio até importar)
- 👥 **Usuários:** Veja usuários cadastrados

### 4. Importar Dados (Admin Only)

Vá para **Administração** e:

1. **Importar Backlog**
   - Clique "Selecionar Arquivo"
   - Carregue `backend/files/backlog.xlsx`
   - Aguarde a confirmação

2. **Importar Finalizados**
   - Clique "Selecionar Arquivo"
   - Carregue `backend/files/finalizados.csv`
   - Aguarde a confirmação

### 5. Distribuir Ordens

1. Certifique-se de que alguns atendentes estão **Online**
2. Clique "Distribuir Agora" na seção de Administração
3. Ordens será distribuídas entre atendentes online

---

## 🔑 Usuários Padrão

| Nome | Role | ID |
|------|------|----|
| Admin | admin | 1 |
| João | atendente | 2 |
| Maria | atendente | 3 |
| Carlos | atendente | 4 |

**Para adicionar/modificar usuários:** Edite `backend/src/data/users.js`

---

## 📁 Estrutura do Projeto

```
Sistema-JH-Telecom/
│
├── frontend/
│   ├── index.html          # Interface principal HTML
│   ├── styles.css          # Estilos CSS (responsivo)
│   ├── app.js              # Lógica JavaScript
│   └── README.md           # Documentação frontend
│
├── backend/
│   ├── server.js           # Servidor Express
│   ├── package.json        # Dependências
│   ├── prisma.config.ts    # Configuração Prisma
│   │
│   ├── files/
│   │   ├── backlog.xlsx    # Dados de exemplo
│   │   └── finalizados.csv # Dados de exemplo
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── orderController.js
│   │   │   └── adminController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── adminRoutes.js
│   │   │
│   │   ├── models/         # (Futuro: modelos Prisma)
│   │   └── data/
│   │       └── users.js    # Dados de usuários
│   │
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco de dados
│   │
│   └── generated/          # Código gerado Prisma
│
├── package.json            # Dependências do projeto
├── README.md               # Documentação geral
├── SETUP.md               # Este arquivo
└── start.sh               # Script de inicialização
```

---

## 🌐 Acessos

| Serviço | URL | Porta |
|---------|-----|-------|
| Backend API | http://localhost:5000 | 5000 |
| Frontend | http://localhost:8000 | 8000 |
| Python Server | http://localhost:8000 | 8000 |

---

## 📋 Rotas da API

### Autenticação
```
POST   /auth/login         - Fazer login
GET    /auth/users         - Listar usuários
```

### Ordens
```
GET    /orders             - Listar ordens
POST   /orders/import-excel - Importar backlog
POST   /orders/import-finalizados - Importar finalizados
```

### Administração
```
POST   /admin/distribuir   - Distribuir ordens
POST   /admin/users/online - Alterar status de usuário
```

---

## 🐛 Troubleshooting

### ❌ "Cannot find module 'express'"
**Solução:**
```bash
cd backend
npm install
```

### ❌ "Port 5000 already in use"
**Solução:**
```bash
# Encontre o processo
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Mate o processo
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

### ❌ "Cannot GET /orders"
**Causas:**
- Backend não está rodando
- URL da API está incorreta em `app.js`
- Porta está errada

**Solução:**
1. Verifique se backend rodando: `http://localhost:5000`
2. Confirme que `API_BASE` em `app.js` está correto
3. Recarregue frontend (Ctrl+F5)

### ❌ Dados não carregam no Dashboard
**Solução:**
1. Abra DevTools (F12)
2. Vá para "Console" e procure por erros
3. Verifique se há CORS issues
4. Se sim, ative CORS no `server.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

### ❌ "Password incorrect" ao fazer login
**Solução:**
- Sistema NÃO usa senha, apenas nome e role
- Certifique-se de que nome existe em `backend/src/data/users.js`
- Verifique a ortografia (case-sensitive para role)

### ❌ Arquivo não encontrado ao importar
**Verificações:**
- Arquivo está em `backend/files/` ?
- Nome do arquivo é exato (backlog.xlsx, finalizados.csv)?
- Arquivo não está corrompido?

---

## 💾 Salvar Dados

O sistema atualmente usa dados **em memória**. Para persistência:

```bash
# Configure o Prisma
npx prisma init
npx prisma migrate dev --name init
```

Mais informações: Ver `prisma/schema.prisma`

---

## 🎨 Personalização

### Alterar Cores
Edite `frontend/styles.css`:
```css
:root {
  --primary: #2563eb;        /* Azul */
  --success: #10b981;        /* Verde */
  --warning: #f59e0b;        /* Amarelo */
  --danger: #ef4444;         /* Vermelho */
}
```

### Alterar Porta do Backend
Edite `backend/server.js`:
```javascript
const PORT = 3000; // Altere aqui
```
E em `frontend/app.js`:
```javascript
const API_BASE = 'http://localhost:3000';
```

### Adicionar Usuários
Edite `backend/src/data/users.js`:
```javascript
const users = [
  { id: 5, nome: "Novo Usuário", role: "atendente", online: false },
  // ...
];
```

---

## ✅ Checklist Final

- [ ] Node.js instalado (`node --version`)
- [ ] npm funcionando (`npm --version`)
- [ ] Backend iniciado e rodando em :5000
- [ ] Frontend acessível em :8000
- [ ] Conseguiu fazer login
- [ ] Dashboard carrega sem erros
- [ ] Pode acessar aba "Ordens"
- [ ] Pode acessar aba "Usuários"
- [ ] (Admin) Pode acessar "Administração"

---

## 📚 Próximos Passos

1. **Configurar Banco de Dados Persistente**
   - Configure PostgreSQL
   - Configure Prisma ORM
   - Migre dados

2. **Adicionar Autenticação JWT**
   - Substitua autenticação simples
   - Implemente tokens

3. **Deploy em Produção**
   - Use Heroku, Vercel, ou AWS
   - Configure variáveis de ambiente
   - Setup CI/CD

4. **Melhorias de UI/UX**
   - Adicione mais gráficos
   - Implemente dark mode
   - Otimize para mobile

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique a aba **Console** no DevTools (F12)
2. Leia a documentação em `README.md`
3. Verifique as logs do backend no terminal
4. Reporte issues no repositório

---

## 📞 Contato

**Desenvolvedor:** Matheus Terra Farias  
**Email:** [seu-email]  
**GitHub:** [seu-github]

---

**Bom uso! 🚀**
