# Personal Trainer Website

Este projeto consiste em uma página web para um personal trainer, com frontend em React e backend em .NET.

## Estrutura do Projeto

- `frontend/` - Aplicação React com Vite
- `Controllers/` - API .NET para receber mensagens de contato
- `Program.cs` - Configuração principal da aplicação .NET

## Como Executar

### 1. Backend (.NET)

1. Certifique-se de ter o .NET 9.0 instalado
2. Na pasta raiz do projeto, execute:
   ```bash
   dotnet run
   ```
3. O backend estará disponível em `https://localhost:5000`

### 2. Frontend (React)

1. Certifique-se de ter o Node.js instalado
2. Na pasta `frontend`, execute:
   ```bash
   npm install
   npm run dev
   ```
3. O frontend estará disponível em `http://localhost:3000`

## Configuração do Email

Para que as mensagens de contato sejam enviadas por email, configure as seguintes informações no arquivo `appsettings.json`:

```json
{
  "Email": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "Username": "seu-email@gmail.com",
    "Password": "sua-senha-de-app",
    "FromEmail": "seu-email@gmail.com",
    "ToEmail": "personal@example.com"
  }
}
```

### Configuração do Gmail

1. Ative a verificação em duas etapas na sua conta Google
2. Gere uma senha de aplicativo:
   - Vá em Configurações da Conta Google
   - Segurança > Verificação em duas etapas > Senhas de app
   - Gere uma nova senha para "Email"
3. Use essa senha no campo `Password` do appsettings.json

### Alternativa: Apenas Log

Se não configurar o email, as mensagens serão salvas em um arquivo de log (`contact_logs.txt`) na pasta raiz do projeto.

## Personalização

### Dados do Personal Trainer

Edite o arquivo `frontend/src/App.jsx` para personalizar:

- Nome do personal trainer
- Descrição
- Estatísticas
- Serviços oferecidos
- Informações de contato

### Estilos

Os estilos estão em:
- `frontend/src/index.css` - Estilos globais
- `frontend/src/App.css` - Estilos específicos dos componentes

## Funcionalidades

- **Página de apresentação** com hero section
- **Seção "Sobre"** com estatísticas
- **Seção "Serviços"** com cards dos serviços oferecidos
- **Formulário de contato** que envia mensagens para o backend
- **Design responsivo** para mobile e desktop
- **Efeitos visuais** modernos com gradientes e glassmorphism

## Tecnologias Utilizadas

### Frontend
- React 18
- Vite
- CSS3 com efeitos modernos

### Backend
- .NET 9
- ASP.NET Core Web API
- SMTP para envio de emails

## Estrutura da API

### POST /api/contact
Recebe mensagens de contato do formulário.

**Body:**
```json
{
  "name": "Nome do cliente",
  "email": "email@cliente.com",
  "phone": "(11) 99999-9999",
  "message": "Mensagem do cliente"
}
```

**Response:**
```json
{
  "message": "Mensagem enviada com sucesso! Entraremos em contato em breve."
}
```

## Deploy

### Frontend
Para fazer o build de produção:
```bash
cd frontend
npm run build
```

### Backend
Para fazer o build de produção:
```bash
dotnet publish -c Release
```

## Suporte

Em caso de dúvidas ou problemas, verifique:
1. Os logs de erro em `error_logs.txt`
2. As mensagens de contato em `contact_logs.txt`
3. A configuração do email no `appsettings.json` 