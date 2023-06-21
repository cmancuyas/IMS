using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace IMS.Models;

public class ProductDTO
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
    [Required]
    public double PurchasePrice { get; set; }
    [Required]
    public double SalesPrice { get; set; }
    public int QtyInStock { get; set; }
    public double ValueOnHand { get; set; }

    [NotMapped]
    public IFormFile? ImageFile { get; set; }
}
