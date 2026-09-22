# AVISO!!
Dados ficam somente na memória local, pois não foi feito o uso de um banco de dados!








# ApiJogos - Catálogo de Jogos em .NET 10
API de gerenciamento de uma biblioteca de jogos.


## Tema e Objetivo
Criar um http capaz de fazer as operações de CRUD em uma biblioteca de jogos.


## Requisitos
SDK: .NET 10 SDK

IDE / Editor: VS Code	

Cliente API: app Bruno


# Comandos
dotnet build
dotnet run 


# URL
--urls http://localhost:5050


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


# Caminho da Colection do Bruno
/bruno


# Vídeo de demonstração
LINK DO VÍDEO: https://youtu.be/SxHDkz3nTUk

