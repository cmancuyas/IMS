using AutoMapper;
using IMS.Models;
using IMS.Models.Dto.Branch;
using IMS.Models.Dto.Company;
using IMS.Models.Dto.Customer;
using IMS.Models.Dto.ProductCategory;
using IMS.Models.Dto.SalesOrderStatus;

namespace IMS.API.Mapper
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            // Branch
            CreateMap<Branch, BranchDTO>();
            CreateMap<BranchDTO, Branch>();

            CreateMap<Branch, BranchCreateDTO>().ReverseMap();
            CreateMap<Branch, BranchUpdateDTO>().ReverseMap();

            // Customer
            CreateMap<Customer, CustomerDTO>();
            CreateMap<CustomerDTO, Customer>();

            CreateMap<Customer, CustomerCreateDTO>().ReverseMap();
            CreateMap<Customer, CustomerUpdateDTO>().ReverseMap();

            //Product Category
            CreateMap<ProductCategory, ProductCategoryDTO>();
            CreateMap<ProductCategoryDTO, ProductCategory>();

            CreateMap<ProductCategory, ProductCategoryCreateDTO>().ReverseMap();
            CreateMap<ProductCategory, ProductCategoryUpdateDTO>().ReverseMap();

            //Company
            CreateMap<Company, CompanyDTO>();
            CreateMap<CompanyDTO, Company>();

            CreateMap<Company, CompanyCreateDTO>().ReverseMap();
            CreateMap<Company, CompanyUpdateDTO>().ReverseMap();

            //Product
            CreateMap<Product, ProductDTO>();
            CreateMap<ProductDTO, Product>();

            CreateMap<Product, ProductCreateDTO>().ReverseMap();
            CreateMap<Product, ProductUpdateDTO>().ReverseMap();

            //Sales Order Status
            CreateMap<SalesOrderStatus, SalesOrderStatusDTO>();
            CreateMap<SalesOrderStatusDTO, SalesOrderStatus>();

            CreateMap<SalesOrderStatus, SalesOrderStatusCreateDTO>().ReverseMap();
            CreateMap<SalesOrderStatus, SalesOrderStatusUpdateDTO>().ReverseMap();

            //Sales Order
            CreateMap<SalesOrder, SalesOrderDTO>();
            CreateMap<SalesOrderDTO, SalesOrder>();

            CreateMap<SalesOrder, SalesOrderCreateDTO>().ReverseMap();
            CreateMap<SalesOrder, SalesOrderUpdateDTO>().ReverseMap();
        }
    }
}
