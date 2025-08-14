#!/bin/bash

echo "🚀 Iniciando projeto Personal Trainer..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instalando..."
    
    # Tentar instalar Node.js via nvm
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
        nvm install node
        nvm use node
    else
        echo "❌ NVM não encontrado. Por favor, instale o Node.js manualmente:"
        echo "   brew install node"
        echo "   ou visite: https://nodejs.org/"
        exit 1
    fi
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar se as dependências do frontend estão instaladas
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    cd frontend
    npm install
    cd ..
fi

# Compilar o frontend
echo "🔨 Compilando frontend..."
cd frontend
npm run build
cd ..

# Copiar arquivos compilados
echo "📁 Copiando arquivos compilados..."
cp -r frontend/dist/* wwwroot/

# Executar o projeto
echo "🎯 Executando projeto..."
dotnet run
