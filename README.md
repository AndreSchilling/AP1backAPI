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
```bash
dotnet build
dotnet run
```

O projeto usa **migrations** do EF Core. Elas são aplicadas automaticamente quando a aplicação inicia (`Migrate()`), então não é necessário rodar nenhum comando extra para criar o banco.


# URL
--urls http://localhost:5107

Interface web: http://localhost:5107/index.html


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
PUT:
```json
{
  "titulo": "Minecraft"
}
```

POST:
```json
{
  "titulo": "God of War"
}
```


# Estrutura do projeto
```
AP1back
├── Data
│   └── ApiDbContext.cs
├── DTOs
│   ├── JogoDto.cs
│   └── JogoEntradaDto.cs
├── Models
│   └── JogosEntity.cs
├── Migrations
├── Properties
├── bruno
│   └── API jogos copy
├── wwwroot
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
└── AP1back.csproj
```

- `Program.cs`: inicialização da aplicação, registro do contexto, tratamento de exceções, CORS e rotas (endpoints).
- `Models/`: a entidade `JogoEntity`, que representa a tabela de jogos no banco.
- `Data/`: o `ApiDbContext`, que conecta a aplicação ao SQLite pelo Entity Framework Core.
- `DTOs/`: `CriarJogoDto` (formato do JSON enviado no POST e no PUT) e `JogoDto` (formato de saída).
- `Migrations/`: migrations do EF Core que criam a tabela de jogos.
- `Properties/`: configurações de execução do projeto (`launchSettings.json`).
- `wwwroot/`: frontend (HTML, CSS e JavaScript).
- `bruno/`: Collection do Bruno com os testes da API.
- `appsettings.json`: configurações, incluindo a string de conexão do banco.
- `api-jogos.db`: banco SQLite, criado automaticamente ao iniciar a API (não é versionado).


# Caminho da Colection do Bruno
`bruno/API jogos copy`

Para usar: abra o Bruno, escolha **Open Collection**, selecione essa pasta, escolha o ambiente local e confirme a porta 5107.





# Vídeo de demonstração
LINK DO VÍDEO: https://youtu.be/czAK1DEcvG4

