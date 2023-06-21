using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        public string? ImageName { get; set; }
        [Required]
        public int ProductCategoryId { get; set; }
        [ForeignKey("ProductCategoryId")]
        public ProductCategory ProductCategory { get; set; }
        [Required]
        public double PurchasePrice { get; set; }
        [Required]
        public double SalesPrice { get; set; }
        public int QtyInStock { get; set; }
        public double ValueOnHand { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
