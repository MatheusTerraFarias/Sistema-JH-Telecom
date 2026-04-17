# 🚀 Sistema JH Telecom - Deploy no Render (Passo-a-Passo)

## ⚠️ PROBLEMA ATUAL

- ✅ Frontend está em produção: https://sistema-jh-telecom.vercel.app
- ❌ Backend NÃO está deployado no Render (recebendo erro 404)

---

## ✅ SOLUÇÃO: Deploy no Render em 5 Minutos

### 1. Abra o Navegador
Acesse: **https://render.com**

### 2. Faça Login ou Cadastro
- Clique em **Sign Up**
- Use sua conta do GitHub

### 3. Crie um Web Service
- Clique em **New +** (canto superior direito)
- Selecione **Web Service**

### 4. Conecte o Repositório
- Busque por: `Sistema-JH-Telecom`
- Clique **Connect**

### 5. Configure o Deploy

Preencha assim:

| Campo | Valor |
|-------|-------|
| **Name** | `sistema-jh-telecom-backend` |
| **Environment** | `Node` |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Instance Type** | `Free` |

### 6. Clique em **Create Web Service**

**Aguarde 2-3 minutos.**

Você verá uma URL do tipo:
```
https://sistema-jh-telecom-backend.onrender.com
```

### 7. ✅ Sucesso!

O backend está agora em produção!

---

## 🧪 Teste

1. Acesse: https://sistema-jh-telecom.vercel.app
2. Faça login com:
   - Email: `admin@jhtelecom.com`
   - Senha: `admin123`
3. Pronto! 🎉

---

## 🆘 Problemas?

### "Build failed"
- Verifica se o `backend/package.json` existe
- Verifica se tem `"start": "node index.js"`

### "Application failed to start"
- Veja os logs no dashboard do Render
- Verifica se o `backend/index.js` existe
- Verifica se as rotas estão carregando sem erro

### "Still getting 404"
- Aguarde 5 minutos (Render está iniciando)
- Tente acessar: `https://seu-backend-url.onrender.com/api/test`
- Você deve ver: `{"message": "Backend funcionando!"}`

---

## 📝 Como Encontrar a URL do Backend

No dashboard do Render:
1. Clique no seu serviço
2. Veja no topo a URL (algo como `https://sistema-jh-telecom-backend.onrender.com`)
3. Pronto! Essa é sua URL

---

## 💡 Alternativa: Usar Railway.app

Se o Render não funcionar:

1. Acesse: https://railway.app
2. Clique **Start a New Project**
3. Selecione **GitHub Repo**
4. Escolha `Sistema-JH-Telecom`
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Node environment**: `production`
6. Deploy!

Railway é frequentemente mais rápido que Render para Node.js

