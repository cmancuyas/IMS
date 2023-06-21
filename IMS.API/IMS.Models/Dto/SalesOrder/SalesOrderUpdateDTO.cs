using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models
{
    public class SalesOrderUpdateDTO
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public double Quantity { get; set; }
        [Required]
        public int CustomerId { get; set; }
        [Required]
        public DateTime OrderDate { get; set; }
        [Required]
        public double Subtotal { get; set; }
        [Required]
        public double Tax { get; set; }
        [Required]
        public double Total { get; set; }
        [Required]
        public int SalesOrderStatusId { get; set; }
    }
}
