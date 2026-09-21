var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

List<JogoDto> jogos = new()
{
    new JogoDto(1, "Forza Horizon 6"),
    new JogoDto(2, "Forza Motorsport 8")
};

int proximoId = 3;

app.MapGet("/", () => Results.Ok(new { Mensagem = "API de Jogos está online!", Status = "OK" }));

app.MapGet("/api/jogos", () => Results.Ok(jogos));

app.MapGet("/api/jogos/{id:int}", (int id) =>
{
    var jogo = jogos.FirstOrDefault(j => j.Id == id);
    return jogo is not null 
    ? Results.Ok(jogo) 
    // codigo 200 e nome do jogo

    : Results.NotFound(new { Mensagem = "Jogo não encontrado." });
});
    // 404 automatico

app.MapPost("/api/jogos", (CriarJogoDto dto) =>
{
    var novoJogo = new JogoDto(proximoId++, dto.Titulo);
    jogos.Add(novoJogo);
    return Results.Created($"/api/jogos/{novoJogo.Id}", novoJogo);
});

app.MapPut("/api/jogos/{id:int}", (int id, CriarJogoDto dto) =>
{
    var index = jogos.FindIndex(j => j.Id == id);
    if (index == -1)
    {
        return Results.NotFound(new { Mensagem = "Jogo não encontrado." });
    }

    jogos[index] = new JogoDto(id, dto.Titulo);
    return Results.Ok(jogos[index]);
});

app.MapDelete("/api/jogos/{id:int}", (int id) =>
{
    int removidos = jogos.RemoveAll(j => j.Id == id);
    return removidos > 0 ? Results.NoContent() : Results.NotFound(new { Mensagem = "Jogo não encontrado." });
});

app.Run();

public record JogoDto(int Id, string Titulo);
public record CriarJogoDto(string Titulo);