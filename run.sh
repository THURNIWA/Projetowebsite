#!/bin/bash

echo "🚀 Iniciando o projeto Personal Trainer..."

# Verificar se estamos no diretório correto
if [ ! -f "FolderApi.csproj" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Carregar NVM e Node.js
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 2>/dev/null || nvm use 24 2>/dev/null || echo "⚠️  Usando Node.js disponível"

# Matar processos que possam estar usando a porta 5063
echo "🔄 Verificando processos na porta 5063..."
lsof -ti:5063 | xargs kill -9 2>/dev/null || true

# Compilar o frontend
echo "📦 Compilando o frontend..."
cd frontend
npm run build
cp -r dist/* ../wwwroot/
cd ..

# Rodar o backend
echo "🖥️  Iniciando o servidor..."
echo "✅ Projeto rodando em: http://localhost:5063"
echo "🔧 Área administrativa: Clique no botão ⚙️ no menu"
echo "👤 Login: admin / 123456"
echo ""
echo "Pressione Ctrl+C para parar o servidor"

dotnet run --project FolderApi.csproj
