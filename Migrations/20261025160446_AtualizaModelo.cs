using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AP1back.Migrations
{
    /// <inheritdoc />
    public partial class AtualizaModelo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Jogo",
                table: "Jogos",
                newName: "jogo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "jogo",
                table: "Jogos",
                newName: "Jogo");
        }
    }
}
