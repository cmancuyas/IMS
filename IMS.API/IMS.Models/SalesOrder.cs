using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace IMS.Models
{
    public class SalesOrder
    {
        [Key]
        public int Id { get; set; }
        [Required]
      
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    
        public double Quantity { get; set; }
        [Required]
  
        public int CustomerId { get; set; }
        [ForeignKey(nameof(CustomerId))]    
        public Customer Customer { get; set; }
        [Required]
        public DateTime OrderDate { get; set; }
     
        public double Subtotal { get; set; }
   
        public double Tax { get; set; }

        public double Total { get; set; }

        public int SalesOrderStatusId { get; set; }
        [ForeignKey("SalesOrderStatusId")]
        public SalesOrderStatus SalesOrderStatus { get; set; }
    }
}
