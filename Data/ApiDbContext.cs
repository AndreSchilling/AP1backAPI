namespace AP1back.Data;
using Microsoft.EntityFrameworkCore;
using AP1back.Models;

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions <ApiDbContext> options) : base(options)
    {
        
    }
    public DbSet<JogoEntity> Jogos => Set<JogoEntity>();
 }