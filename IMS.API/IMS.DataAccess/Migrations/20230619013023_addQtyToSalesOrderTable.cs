﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IMS.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addQtyToSalesOrderTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Quantity",
                table: "SalesOrders",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "SalesOrders");
        }
    }
}
