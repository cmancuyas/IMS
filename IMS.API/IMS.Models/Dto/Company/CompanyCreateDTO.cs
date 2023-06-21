using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models.Dto.Company
{
    public class CompanyCreateDTO
    {
        [Required]
        [MaxLength(30)]
        public string Name { get; set; }
        [MaxLength(100)]
        [Required]
        public string Description { get; set; }
    }
}
