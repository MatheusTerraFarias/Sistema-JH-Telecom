# 📡 JH Telecom - Sistema de Gestão de Ordens

Um sistema completo de gestão de ordens de serviço para empresas de telecomunicações, desenvolvido com **Express.js** no backend e **HTML5/CSS3/JavaScript** no frontend.

## 📋 Funcionalidades

### 🔐 Autenticação
- Login seguro com nome e tipo de acesso (Admin/Atendente)
- Sessão persistente com localStorage
- Controle de acesso baseado em roles

### 📊 Dashboard
- Estatísticas em tempo real:
  - Total de ordens
  - Ordens atrasadas
  - Ordens finalizadas
  - Atendentes online
- Distribuição por status
- Ordens por atendente
- Ações rápidas (Distribuir, Importar, Atualizar)

### 📋 Gerenciamento de Ordens
- **Visualização:** Table responsiva com paginação
- **Filtros avançados:**
  - Status (Pendente, Atrasado, Finalizado, etc)
  - Responsável
  - Fila
  - Prioridade
  - Bairro
- **Campos visíveis:**
  - Cliente, Número da OS
  - Fila, Prioridade, Bairro
  - Status, Responsável
  - Dias em aberto

### 👥 Gerenciamento de Usuários
- Lista de usuários cadastrados
- Status online/offline
- Informação de role (Admin/Atendente)

### ⚙️ Administração (Admin Only)
- **Importar Backlog:** Carregue arquivo Excel (backlog.xlsx)
- **Importar Finalizados:** Carregue arquivo CSV (finalizados.csv)
- **Distribuir Ordens:** Distribuição automática round-robin entre atendentes online
- **Gerenciar Usuários:** Toggle online/offline para atendentes
- **Estatísticas:** Resumo de status de ordens

## 🎨 Interface

### Componentes Principais
- **Navbar:** Logo, título da página, informações do usuário
- **Sidebar:** Menu de navegação com rutas (Dashboard, Ordens, Usuários, Admin)
- **Cards:** Estatísticas, informações de status
- **Tabelas:** Listagem de ordens com paginação
- **Filtros:** Busca avançada com múltiplos critérios
- **Modais:** Confirmação, sucesso, erro, carregamento

### Design Responsivo
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (< 768px)
- ✅ Pequenos dispositivos (< 480px)

## 🚀 Como Usar

### 1. Preparação do Backend
Certifique-se de que o backend está rodando em `http://localhost:5000`

```bash
cd backend
npm install
npm start
```

### 2. Abrir o Frontend
Abra o arquivo `frontend/index.html` em um navegador moderno ou use um servidor local:

```bash
# Usando Python
python -m http.server 8000

# Ou com Node.js (http-server)
npx http-server frontend
```

Acesse: `http://localhost:8000`

### 3. Fazer Login
Use uma das contas pré-configuradas:

| Usuário | Role | Permissões |
|---------|------|-----------|
| Admin | admin | Todas as funcionalidades |
| João | atendente | Dashboard, Ordens, Usuários |
| Maria | atendente | Dashboard, Ordens, Usuários |
| Carlos | atendente | Dashboard, Ordens, Usuários |

### 4. Usar o Sistema

#### Como Usuário Atendente
1. Faça login com sua conta
2. Veja o Dashboard com suas ordens
3. Acesse a aba "Ordens" para filtrar e visualizar
4. Veja usuários online na aba "Usuários"

#### Como Admin
1. Faça login como Admin
2. **Dashboard:** Visualize todas as estatísticas
3. **Administração:** 
   - Importe backlog em Excel
   - Importe finalizados em CSV
   - Distribua ordens entre atendentes
   - Manage status de usuários

## 📁 Estrutura de Arquivos

```
frontend/
├── index.html          # Arquivo principal HTML
├── styles.css          # Estilos CSS (responsivo)
├── app.js              # Lógica JavaScript e API
└── README.md           # Este arquivo
```

## 🔌 API Endpoints Utilizados

### Autenticação
- `POST /auth/login` - Fazer login

### Usuários
- `GET /auth/users` - Listar usuários

### Ordens
- `GET /orders` - Listar ordens com filtros
- `POST /orders/import-excel` - Importar backlog
- `POST /orders/import-finalizados` - Importar finalizados

### Admin
- `POST /admin/distribuir` - Distribuir ordens

## 🎯 Status de Ordens

| Status | Cor | Significado |
|--------|-----|------------|
| Pendente | Cinza | Ordem aguardando atendimento |
| Atrasado | Amarelo | Ordem vencida (> 7 dias) |
| Finalizado | Verde | Ordem concluída |
| Cancelado | Vermelho | Ordem cancelada |
| Não Concluído | Cinza | Ordem não finalizada |
| Suspenso | Roxo | Ordem suspensa temporarily |

## 🎨 Paleta de Cores

```
Primária:     #2563eb (Azul)
Secundária:   #64748b (Cinza)
Sucesso:      #10b981 (Verde)
Aviso:        #f59e0b (Amarelo)
Perigo:       #ef4444 (Vermelho)
Info:         #06b6d4 (Ciano)
```

## 🔒 Segurança

- Autenticação simples (sem JWT neste momento)
- Dados armazenados em localStorage
- Controle de acesso por role
- Validação básica de campos

## 📱 Navegadores Suportados

- ✅ Chrome/Edge (versões recentes)
- ✅ Firefox (versões recentes)
- ✅ Safari (versões recentes)
- ✅ Mobile browsers

## ⚙️ Configuração

Para alterar a URL da API, edite o arquivo `app.js`:

```javascript
const API_BASE = 'http://localhost:5000'; // Altere aqui
```

## 🐛 Troubleshooting

### "Erro ao conectar com o servidor"
- Verifique se o backend está rodando em `http://localhost:5000`
- Verifique se a porta 5000 não está bloqueada pelo firewall

### Dados não carregam
- Abra o console (F12) e verifique erros
- Verifique as conexões de rede
- Recarregue a página (Ctrl+F5)

### Logout automático
- Dados são armazenados em localStorage
- Limpar cache do navegador logout automático
- Verifique as configurações de armazenamento local

## 📝 Notas

- A aplicação usa localStorage para manter a sessão
- Os dados de ordens são carregados da API
- Importação de arquivos requer que os arquivos estejam na pasta `backend/files/`

## 👨‍💻 Desenvolvedor

Sistema desenvolvido para **JH Telecom**

## 📄 Licença

ISC
