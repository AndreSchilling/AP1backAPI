namespace AP1back.Models;



class JogoEntity
{
    public int Id { get; set; }
    public String jogo { get; set; } = string.Empty;
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public String Titulo { get => jogo; set => jogo = value; }
}
