# ApiJogos - Catálogo de Jogos em .NET 10
API de gerenciamento de uma biblioteca de jogos, com banco de dados SQLite (EF Core) e interface web integrada.


## Tema e Objetivo
Criar um http capaz de fazer as operações de CRUD em uma biblioteca de jogos, salvando os dados em um banco SQLite com Entity Framework Core. A interface web fica na pasta `wwwroot` e é entregue pela própria API (mesma origem).


## Requisitos
SDK: .NET 10 SDK

IDE / Editor: VS Code	

Cliente API: app Bruno

Banco de dados: SQLite (arquivo `api-jogos.db`, criado automaticamente)


# Comandos
dotnet build
dotnet run 

As migrations são aplicadas automaticamente quando a aplicação inicia (`Migrate()`), então não é necessário rodar nenhum comando extra para criar o banco.


# URL
--urls http://localhost:5050

Interface web: http://localhost:5050/index.html


# Tabela
| Método | Endpoint | Descrição | Status Esperado |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Status da API | `200 OK` |
| **GET** | `/api/jogos` | Listar jogos | `200 OK` |
| **GET** | `/api/jogos/{id}` | Buscar jogo por ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/jogos` | Cadastrar novo jogo | `201 Created` |
| **PUT** | `/api/jogos/{id}` | Atualizar jogo | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/jogos/{id}` | Remover jogo por ID | `204 No Content` / `404 Not Found` |
| **GET** | `/api/jogos/{id}` | Confirmar se o jogo foi deletado por id | `404 Not Found` |


# JSON do PUT e do POST
Put: 
{
  "titulo": "Minecraft"
}

Post:
{
  "titulo": "God of War"
}


# Estrutura do projeto
- `Program.cs`: rotas, Model (`JogoEntity`) e DbContext (`ApiDbContext`)
- `Migrations`: migrations do EF Core que criam a tabela de jogos
- `wwwroot`: frontend (HTML, CSS e JavaScript)
- `bruno`: Collection do Bruno
- `api-jogos.db`: banco SQLite


# Caminho da Colection do Bruno
/bruno


# Vídeo de demonstração
LINK DO VÍDEO: 

