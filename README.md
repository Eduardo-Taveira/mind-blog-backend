# Blog API — Case Mind Group

API REST do sistema de blog desenvolvido como case técnico da Mind Group.

---

## Stack

- Node.js + Express
- TypeScript
- MySQL 8 (mysql2/promise — pool de conexões)
- bcrypt (hash de senhas, 10 salt rounds)
- JWT — jsonwebtoken (token de 7 dias)
- Multer (upload de banner via memoryStorage → LONGBLOB)
- CORS
- dotenv

---

## Pré-requisitos do ambiente

- Node.js 18+
- npm
- MySQL 8+

---

## Instalação

```bash
git clone <URL-DESTE-REPOSITÓRIO>
cd blog-backend
npm install
```

---

## Configuração do banco de dados

> ⚠️ **Passo crítico — faça isso antes de subir o servidor.**

**1. Crie o banco de dados:**

```bash
mysql -u root -p
```

```sql
CREATE DATABASE blog_db;
EXIT;
```

**2. Importe o dump:**

```bash
mysql -u root -p blog_db < dump.sql
```

O arquivo `dump.sql` já está na raiz do repositório e inclui o schema completo das tabelas (`users`, `articles`, `comments`) com dados de exemplo.

**3. Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o `.env` com os seus valores:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=blog_db
JWT_SECRET=alguma_chave_secreta
```

> ⚠️ **Nunca commite o `.env` real.** Ele está no `.gitignore`. Apenas o `.env.example` vai para o repositório.

---

## Rodando o projeto

**Modo desenvolvimento:**

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000/api`.

**Build para produção:**

```bash
npm run build
npm start
```

---

## Endpoints

### Auth

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| POST | `/api/auth/register` | ❌ | Cadastro de usuário |
| POST | `/api/auth/login` | ❌ | Login — retorna token JWT |
| GET | `/api/auth/profile` | ✅ | Retorna perfil do usuário logado |
| PUT | `/api/auth/profile` | ✅ | Atualiza nome, email, bio e avatar |

### Articles

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| GET | `/api/articles` | ❌ | Lista todos os artigos |
| GET | `/api/articles/:id` | ❌ | Retorna um artigo pelo ID (incrementa views) |
| POST | `/api/articles` | ✅ | Cria artigo (multipart/form-data com campo `banner`) |
| PUT | `/api/articles/:id` | ✅ | Edita artigo (apenas pelo autor) |
| DELETE | `/api/articles/:id` | ✅ | Remove artigo (apenas pelo autor) |
| POST | `/api/articles/:id/like` | ❌ | Incrementa likes do artigo |

### Comments

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| GET | `/api/articles/:id/comments` | ❌ | Lista comentários do artigo (com nome e avatar do autor) |
| POST | `/api/articles/:id/comments` | ✅ | Cria comentário no artigo |
| POST | `/api/articles/:id/comments/:id/like` | ❌ | Incrementa likes do comentário |

Rotas marcadas com ✅ exigem o header:
```
Authorization: Bearer <token>
```

---

## Exemplo de payload

**POST `/api/auth/register`**

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

Resposta `201`:

```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com"
}
```

---

## Funcionalidades implementadas

**Escopo base:**
- Cadastro e login com senha hashada via bcrypt
- Autenticação via JWT (7 dias de validade)
- CRUD completo de artigos com imagem banner em LONGBLOB
- Proteção de rotas por middleware JWT

**Funcionalidades adicionais (bônus):**
- Sistema de comentários em artigos (listar e criar)
- Curtidas em artigos e em comentários
- Contagem de visualizações por artigo
- Categorias (`category`) e tags (`tags` em JSON) nos artigos
- Atualização de perfil do usuário (bio e avatar via URL)
- JOIN entre comentários e usuários para retornar nome e avatar do autor

---

## Estrutura de pastas

```
src/
├── config/       # Configuração do pool de conexão com o MySQL
├── controllers/  # Handlers das requisições (auth, articles, comments)
├── middlewares/  # Middleware de autenticação JWT
├── models/       # Funções de acesso ao banco de dados
├── routes/       # Definição das rotas por recurso
└── services/     # Lógica de negócio (register, login com bcrypt/JWT)
```

---

## Frontend

O frontend deste projeto está em um repositório separado e consome esta API em `http://localhost:3000/api`.

Repositório do frontend: [REPO-FRONTEND-URL]