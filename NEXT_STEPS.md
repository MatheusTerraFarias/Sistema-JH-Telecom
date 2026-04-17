# 🎯 Sistema JH Telecom - Próximos Passos

## ✅ Concluído

- ✅ Frontend deployado em Vercel: https://sistema-jh-telecom.vercel.app
- ✅ Backend configurado e pronto para deploy
- ✅ Código atualizado no GitHub
- ✅ Guia de deployment criado

---

## ⏳ Falta Fazer: Deploy do Backend no Render

### 1️⃣ Acesse https://render.com
- Clique em **Sign Up** (ou Login se já tem conta)
- Conecte sua conta GitHub

### 2️⃣ Crie um novo Web Service
- Clique em **New +** no canto superior direito
- Selecione **Web Service**
- Busque e selecione: `Sistema-JH-Telecom`
- Clique em **Connect**

### 3️⃣ Configure o Service
- **Name**: `sistema-jh-telecom-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Instance Type**: `Free`

### 4️⃣ Deploy
- Clique em **Create Web Service**
- Espere 2-3 minutos enquanto o Render faz o deploy
- Você receberá uma URL como: `https://sistema-jh-telecom-backend.onrender.com`

### 5️⃣ Atualizar URL do Backend
Após receber a URL do Render, edite `frontend/app.js` linha 5:

```javascript
const API_BASE = isProduction 
  ? 'https://YOUR-BACKEND-URL-HERE.onrender.com'  // ← COLE AQUI
  : 'http://localhost:5000';
```

### 6️⃣ Fazer Push
```powershell
cd c:\Users\mathe\OneDrive\Área de Trabalho\Sistema_JH_Telecom
git add .
git commit -m "Update backend URL after Render deployment"
git push origin main
```

Pronto! Vercel redeploy o frontend automaticamente! 🚀

---

## 🧪 Teste

Após todos os passos:

1. Acesse: https://sistema-jh-telecom.vercel.app
2. Faça login com:
   - Email: `admin@jhtelecom.com`
   - Senha: `admin123`
3. Pronto! 🎉

---

## 📝 Credenciais de Teste

| Email | Senha |
|-------|-------|
| admin@jhtelecom.com | admin123 |
| joao@jhtelecom.com | joao123 |
| maria@jhtelecom.com | maria123 |
| carlos@jhtelecom.com | carlos123 |

---

## 🆘 Problemas?

- Veja o arquivo `DEPLOY_GUIDE.md` para troubleshooting detalhado
- Verifica os logs do Render no dashboard
- Testa o backend localmente: `cd backend && npm start`

