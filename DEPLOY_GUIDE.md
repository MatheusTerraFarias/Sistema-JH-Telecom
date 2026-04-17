# 🚀 Guia de Deploy - Sistema JH Telecom

## 📋 Estrutura do Projeto

```
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── vercel.json
├── backend/
│   ├── server.js (desenvolvimento)
│   ├── index.js (production/serverless)
│   ├── vercel.json
│   ├── package.json
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── data/
│       └── models/
└── prisma/
    └── schema.prisma
```

---

## 🌐 Frontend - Vercel

### Status: ✅ DEPLOYADO

**URL:** https://sistema-jh-telecom.vercel.app

#### Como fazer deploy/atualizar:

1. Commit e push das mudanças:
```bash
git add .
git commit -m "Descrição da mudança"
git push origin main
```

2. Vercel redeploy automaticamente! ✨

#### Requisitos:
- Vercel conectado ao repositório GitHub
- Arquivo `frontend/vercel.json` configurado

---

## 🔧 Backend - Render.com

### Status: ⏳ PRECISA DEPLOY

#### Passo 1: Criar conta no Render
- Acesse: https://render.com
- Cadastre-se com GitHub

#### Passo 2: Criar novo Web Service
1. Clique em **New +** → **Web Service**
2. Conecte o repositório: `Sistema-JH-Telecom`
3. Configure:
   - **Name**: `sistema-jh-telecom-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (ou Starter se preferir)
   - **Env Variables**: 
     - `NODE_ENV` = `production`

#### Passo 3: Deploy
- Clique **Create Web Service**
- Render fará o deploy automaticamente
- Pegue a URL gerada (algo como: `https://sistema-jh-telecom-backend.onrender.com`)

#### Passo 4: Atualizar Frontend
No arquivo `frontend/app.js`, atualize a linha:
```javascript
const API_BASE = isProduction 
  ? 'https://sistema-jh-telecom-backend.onrender.com'  // ← URL DO SEU BACKEND
  : 'http://localhost:5000';
```

#### Passo 5: Fazer Push
```bash
git add frontend/app.js
git commit -m "Update backend API URL for Render deployment"
git push origin main
```

Vercel redeploy automaticamente com a nova URL! 🎉

---

## 🧪 Teste Local

### Backend
```bash
cd backend
npm install
npm start
# Servidor rodando em http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install  # ou apenas abra o index.html em um browser
node -m http.server 8000
# Abra http://localhost:8000
```

### Teste de Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jhtelecom.com","senha":"admin123"}'
```

**Resposta esperada:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "nome": "Admin",
    "email": "admin@jhtelecom.com",
    "role": "admin",
    "online": true
  }
}
```

---

## 👥 Credenciais de Teste

| Email | Senha | Role |
|-------|-------|------|
| admin@jhtelecom.com | admin123 | admin |
| joao@jhtelecom.com | joao123 | atendente |
| maria@jhtelecom.com | maria123 | atendente |
| carlos@jhtelecom.com | carlos123 | atendente |

---

## 🔄 Fluxo de Desenvolvimento

### Fazer mudanças locais:
```bash
# Frontend
cd frontend
# Edite index.html, app.js ou styles.css

# Backend
cd backend
# Edite controllers, routes, etc.
```

### Testar localmente:
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && node -m http.server 8000
# ou abra index.html no browser
```

### Deploy em Produção:
```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
# Vercel e Render fazem deploy automático ✨
```

---

## 🛠 Troubleshooting

### "Erro 404 no login"
- Verifica se o backend está rodando (`npm start` dentro de `backend/`)
- Verifica se a URL do backend em `app.js` está correta

### "CORS Error"
- Verifica o CORS middleware em `backend/index.js`
- O backend deve ter `Access-Control-Allow-Origin: *`

### "Porta já em uso"
```bash
# Kill processo na porta 5000
lsof -ti:5000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :5000   # Windows
```

### Backend não faz deploy no Render
- Verifica se o `backend/package.json` existe
- Verifica se tem `"start": "node index.js"`
- Verifica os logs no dashboard do Render

---

## 📝 Detalhes Técnicos

### Frontend (Vercel)
- SPA com Vanilla JavaScript
- Rota única em `vercel.json` para suportar hash routing
- API_BASE detecta ambiente automaticamente

### Backend (Node.js + Express)
- `server.js` para desenvolvimento local
- `index.js` para serverless (Vercel/Render)
- CORS configurado para aceitar requisições de qualquer origem
- Rotas: `/auth`, `/orders`, `/admin`

### Banco de Dados
- ⚠️ Atualmente em **memória apenas**
- Para produção, integre com Prisma + PostgreSQL (veja `prisma/schema.prisma`)

---

## 🚀 Próximos Passos

- [ ] Integrar Prisma + PostgreSQL para persistência
- [ ] Autenticação com JWT tokens
- [ ] Validação de dados robusta
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Documentação da API (Swagger)

