using AP1back.Models;
using AP1back.Dto;
using AP1back.Data;

using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
builder.Services.AddDbContext<ApiDbContext> (options => 
options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);


var app = builder.Build();
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "aplication/json";
        await context.Response.WriteAsJsonAsync( new{ error = "Ocorreu um erro interno no servidor." } );
    });
});



// cria o banco / aplica as migrations ao iniciar
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApiDbContext>();
    db.Database.Migrate();
}


app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());


app.UseStaticFiles();


app.MapGet("/", () => Results.Ok(new { Mensagem = "API de Jogos está online!", Status = "OK" }));
// rota raiz 


app.MapGet("/api/jogos", async (ApiDbContext db) =>
{
    var jogos = await db.Jogos.ToListAsync();
    return Results.Ok(jogos); 

});


app.MapGet("/api/jogos/{id:int}", async (int id, ApiDbContext db) =>
{
    var jogo = await db.Jogos.FirstOrDefaultAsync(j => j.Id == id);
    
    return jogo is not null 
    ? Results.Ok(jogo) 
    // codigo 200 e nome do jogo

    : Results.NotFound(new { Mensagem = "Jogo não encontrado." });
});
    // 404 automatico

app.MapPost("/api/jogos", async (CriarJogoDto dto, ApiDbContext db) =>
{
    var jogo = new JogoEntity { Titulo = dto.Titulo };
    db.Jogos.Add(jogo);
    await db.SaveChangesAsync();
    return Results.Created($"/api/jogos/{jogo.Id}", jogo);
});
    // 201 Created


app.MapPut("/api/jogos/{id:int}", async (int id, CriarJogoDto dto, ApiDbContext db) =>
{
    var jogo = await db.Jogos.FindAsync(id);
    if (jogo is null)
    {
        return Results.NotFound(new { Mensagem = "Jogo não encontrado." });
    }

    jogo.jogo = dto.Titulo;
    await db.SaveChangesAsync();
    return Results.Ok(jogo);
});
    // 200 OK ou 404 Not Found


app.MapDelete("/api/jogos/{id:int}", async (int id, ApiDbContext db) =>
{
    var jogo = await db.Jogos.FindAsync(id);
    if (jogo is null) return Results.NotFound();
    db.Jogos.Remove(jogo);
    await db.SaveChangesAsync();
    return Results.NoContent();
});
    //204 No Content ou 404 Not Found



app.Run();

