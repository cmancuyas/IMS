using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IMS.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addSalesOrderStatusToSalesOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SalesOrderStatusId",
                table: "SalesOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrders_SalesOrderStatusId",
                table: "SalesOrders",
                column: "SalesOrderStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_SalesOrders_SalesOrderStatuses_SalesOrderStatusId",
                table: "SalesOrders",
                column: "SalesOrderStatusId",
                principalTable: "SalesOrderStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SalesOrders_SalesOrderStatuses_SalesOrderStatusId",
                table: "SalesOrders");

            migrationBuilder.DropIndex(
                name: "IX_SalesOrders_SalesOrderStatusId",
                table: "SalesOrders");

            migrationBuilder.DropColumn(
                name: "SalesOrderStatusId",
                table: "SalesOrders");
        }
    }
}
