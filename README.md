# Food Explorer Backend

![Capa do Projeto](./capa%20do%20projeto.png)

O backend do **Food Explorer** fornece a API que suporta o sistema de gerenciamento de pratos e usuários para um restaurante. Ele permite operações como criação, atualização, exclusão e recuperação de pratos, bem como gerenciamento de usuários e sessões.

## Funcionalidades

### Endpoints da API

#### **Sessões**

- **POST /sessions**
  - **Descrição:** Cria uma nova sessão para um usuário autenticado.
  - **Corpo da Requisição:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - **Resposta:**
    ```json
    {
      "user": { ... },
      "token": "string"
    }
    ```

#### **Usuários**

- **POST /users**
  - **Descrição:** Cria um novo usuário.
  - **Corpo da Requisição:**
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string",
      "role": "string" (Não disponível no frontend. Padrão "user")
    }
    ```
  - **Resposta:** `{status(201)}`

- **PUT /users**
  - **Descrição:** Atualiza as informações do usuário autenticado. (Apenas pelo Backend)
  - **Corpo da Requisição:**
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string",
      "old_password": "string",
      "role": "string"
    }
    ```
  - **Resposta:** `{status(201)}`

#### **Pratos**

- **GET /dishes/index**
  - **Descrição:** Recupera todos os pratos ou pratos que correspondem a um termo de pesquisa.
  - **Parâmetros:** `{ "term": "string" }`
  - **Resposta:** `[ { ... }, { ... }, ... ]`

- **POST /dishes/newdish**
  - **Descrição:** Cria um novo prato.
  - **Corpo da Requisição:**
    ```json
    {
      "name": "string",
      "category": "string",
      "price": "number",
      "description": "string",
      "tags": "[\"string\"]"
    }
    ```
  - **Arquivo:** `image`
  - **Resposta:** 
    ```json
    {
      "message": "Prato criado com sucesso."
    }
    ```

- **PUT /dishes/editdish/:id**
  - **Descrição:** Atualiza um prato existente.
  - **Parâmetros:** `id` (ID do prato)
  - **Corpo da Requisição:**
    ```json
    {
      "name": "string",
      "category": "string",
      "price": "number",
      "description": "string",
      "tags": "[\"string\"]"
    }
    ```
  - **Arquivo:** `image`
  - **Resposta:**
    ```json
    {
      "message": "Prato atualizado com sucesso."
    }
    ```

- **DELETE /dishes/:id**
  - **Descrição:** Remove um prato existente.
  - **Parâmetros:** `id` (ID do prato)
  - **Resposta:**
    ```json
    {
      "message": "Prato deletado com sucesso."
    }
    ```

- **GET /dishes/:id**
  - **Descrição:** Recupera detalhes de um prato específico.
  - **Parâmetros:** `id` (ID do prato)
  - **Resposta:**
    ```json
    {
      "id": "number",
      "name": "string",
      "category": "string",
      "price": "number",
      "description": "string",
      "tags": "[\"string\"]"
    }
    ```

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução para JavaScript no servidor.
- **Express.js** - Framework para construção de APIs em Node.js.
- **Knex.js** - Query Builder para Node.js.
- **SQLite** - Banco de dados utilizado para armazenamento.
- **Multer** - Middleware para upload de arquivos.
- **bcryptjs** - Biblioteca para hashing de senhas.
- **jsonwebtoken** - Biblioteca para criação e verificação de tokens JWT.
- **cors** - Middleware para habilitar CORS (Cross-Origin Resource Sharing).
- **dotenv** - Carregamento de variáveis de ambiente a partir de um arquivo `.env`.
- **pm2** - Gerenciador de processos para Node.js.
- **swagger-jsdoc** - Documentação de API usando Swagger.
- **swagger-ui-express** - Interface gráfica para a documentação Swagger.

## Documentação da API

- **Site no ar em Produção no Netlify** [Link para o Frontend](https://foodexplorerbycristianvalim.netlify.app/) 
- **API em Produção no Render:** [Link para a API](https://foodexplorer-api-a607.onrender.com) 

## Autores

- **Cristian Valim** - Desenvolvimento
- **Rocketseat** - Design

## Licença

Este projeto é licenciado pela Rocketseat.

## Links Adicionais

- **Figma do Projeto:** [Food Explorer no Figma](https://www.figma.com/design/oIO8asqIql3ZEpTxlMUfxt/food-explorer-v2-(Community)?node-id=201-1532&t=z3lUeE0ugd3CSY23-0)
- **GitHub do Backend:** [Repositório do Backend](https://github.com/CristianValim/foodexplorerbe)

![Logo Rocketseat](./Rocketseat.png)
