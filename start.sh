#!/bin/bash

# ========================================
# JH Telecom - Script de Inicialização
# ========================================

echo "🚀 Iniciando JH Telecom Sistema..."
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js não encontrado. Por favor, instale Node.js primeiro.${NC}"
    exit 1
fi

echo -e "${BLUE}✅ Node.js encontrado: $(node --version)${NC}"
echo ""

# Iniciar Backend
echo -e "${BLUE}📡 Iniciando Backend...${NC}"
echo "Executando: cd backend && npm install && npm start"
echo ""

cd backend

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependências...${NC}"
    npm install
fi

echo -e "${GREEN}✅ Backend pronto!${NC}"
echo "Backend rodando em: http://localhost:5000"
echo ""
echo -e "${BLUE}📝 Frontend:${NC}"
echo "Abra o arquivo: frontend/index.html"
echo "Ou use: python -m http.server 8000"
echo ""
echo "🎉 Acesse: http://localhost:8000"
echo ""

# Iniciar Backend em background
npm start &
BACKEND_PID=$!

echo "Backend iniciado com PID: $BACKEND_PID"
echo ""
echo -e "${YELLOW}💡 Dica: Para parar o servidor, pressione Ctrl+C${NC}"

# Manter o script rodando
wait $BACKEND_PID
