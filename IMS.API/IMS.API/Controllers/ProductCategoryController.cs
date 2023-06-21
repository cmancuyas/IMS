using AutoMapper;
using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using IMS.Models.Dto.ProductCategory;
using IMS.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Data;
using System.Net;
using System.Text.Json;

namespace IMS.API.Controllers;

[Route("api/product-categories")]
[ApiController]
//Deprecated = true
public class ProductCategoryController : Controller
{
    protected APIResponse _response;
    private readonly IProductCategoryRepository _dbProductCategory;
    private readonly IMapper _mapper;

    public ProductCategoryController(IProductCategoryRepository dbProductCategory, IMapper mapper)
    {
        _dbProductCategory = dbProductCategory;
        _mapper = mapper;
        _response = new();
    }

    [HttpGet]
    //[ResponseCache(CacheProfileName = "Default30")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> GetProductCategories(
        [FromQuery] string? search,
         int pageSize = 0,
         int pageNumber = 1
        )
    {
        try
        {
            IEnumerable<ProductCategory> productCategoryList;

            productCategoryList = await _dbProductCategory.GetAllAsync(pageSize: pageSize, pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<ProductCategoryDTO>>(productCategoryList);
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;

    }
    [HttpGet("{id:int}", Name = "GetProductCategory")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetProductCategory(int id)
    {
        try
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return BadRequest(_response);
            }
            var productCategory = await _dbProductCategory.GetAsync(x => x.Id == id);
            if (productCategory == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<ProductCategory>(productCategory);
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpPost]
    //[Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<APIResponse>> CreateProductCategory([FromBody] ProductCategoryCreateDTO createDTO)
    {
        try
        {
            if (await _dbProductCategory.GetAsync(x => x.Name.ToLower() == createDTO.Name.ToLower()) != null)
            {
                ModelState.AddModelError("CustomError", "ProductCategory already exists");
                return BadRequest(ModelState);
            }

            if (createDTO == null)
            {
                return BadRequest(createDTO);
            }

            ProductCategory productCategory = _mapper.Map<ProductCategory>(createDTO);

            await _dbProductCategory.CreateAsync(productCategory);
            await _dbProductCategory.SaveAsync();

            _response.Result = _mapper.Map<ProductCategoryDTO>(productCategory);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetProductCategory", new { id = productCategory.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteProductCategory")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteProductCategory(int id)
    {
        try
        {
            if (id == 0)
            {
                return BadRequest();
            }
            var productCategory = await _dbProductCategory.GetAsync(x => x.Id == id);
            if (productCategory == null)
            {
                return NotFound();
            }

            await _dbProductCategory.RemoveAsync(productCategory);
            _response.StatusCode = HttpStatusCode.NoContent;
            _response.IsSuccess = true;
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }
    //[Authorize(Roles = "admin")]
    [HttpPut("{id:int}", Name = "UpdateProductCategory")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateProductCategory(int id, [FromBody] ProductCategoryUpdateDTO updateDto)
    {
        try
        {
            if(updateDto == null || id != updateDto.Id)
            {
                return BadRequest();
            }
            ProductCategory productCategory = _mapper.Map<ProductCategory>(updateDto);

            await _dbProductCategory.UpdateAsync(productCategory);
            _response.StatusCode = HttpStatusCode.NoContent;
            _response.IsSuccess = true;
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess= false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

}
