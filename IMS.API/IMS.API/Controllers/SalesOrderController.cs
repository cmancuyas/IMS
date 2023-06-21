using AutoMapper;
using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using IMS.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Data;
using System.Net;
using System.Text.Json;

namespace IMS.API.Controllers;

[Route("api/sales-orders")]
[ApiController]
//Deprecated = true
public class SalesOrderController : Controller
{
    protected APIResponse _response;
    private readonly ISalesOrderRepository _dbSalesOrder;
    private readonly IProductRepository _dbProduct;
    private readonly IMapper _mapper;

    public SalesOrderController(
        ISalesOrderRepository dbSalesOrder,
        IProductRepository dbProduct,
        IMapper mapper)
    {
        _dbSalesOrder = dbSalesOrder;
        _dbProduct = dbProduct;
        _mapper = mapper;
        _response = new();
    }

    [HttpGet]
    //[ResponseCache(CacheProfileName = "Default30")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> GetSalesOrders(
        [FromQuery] string? search,
         int pageSize = 0,
         int pageNumber = 1
        )
    {
        try
        {
            IEnumerable<SalesOrder> salesOrderList;

            salesOrderList = await _dbSalesOrder.GetAllAsync(pageSize: pageSize,
                                                            pageNumber: pageNumber,
                                                            includeProperties: "Customer,Product,SalesOrderStatus");

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<SalesOrderDTO>>(salesOrderList);
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
    [HttpGet("{id:int}", Name = "GetSalesOrder")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetSalesOrder(int id)
    {
        try
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return BadRequest(_response);
            }
            var salesOrder = await _dbSalesOrder.GetAsync(x => x.Id == id, includeProperties: "Customer,Product,SalesOrderStatus");
            if (salesOrder == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<SalesOrder>(salesOrder);
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
    public async Task<ActionResult<APIResponse>> CreateSalesOrder([FromBody] SalesOrderCreateDTO createDTO)
    {
        try
        {

            if (createDTO == null)
            {
                return BadRequest(createDTO);
            }

            Product product = await _dbProduct.GetAsync(x => x.Id == createDTO.ProductId);

            if(product.QtyInStock <= 0)
            {
                ModelState.AddModelError("CustomError", "No more quantity left in stock");
                return BadRequest(ModelState);
            }

            product.QtyInStock -= createDTO.Quantity;
            product.ValueOnHand = product.QtyInStock * product.SalesPrice;

            await _dbProduct.UpdateAsync(product);
            await _dbProduct.SaveAsync();

            SalesOrder salesOrder = _mapper.Map<SalesOrder>(createDTO);

            await _dbSalesOrder.CreateAsync(salesOrder);
            await _dbSalesOrder.SaveAsync();

            _response.Result = _mapper.Map<SalesOrderDTO>(salesOrder);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetSalesOrder", new { id = salesOrder.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteSalesOrder")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteSalesOrder(int id)
    {
        try
        {
            if (id == 0)
            {
                return BadRequest();
            }
            var salesOrder = await _dbSalesOrder.GetAsync(x => x.Id == id);
            if (salesOrder == null)
            {
                return NotFound();
            }

            await _dbSalesOrder.RemoveAsync(salesOrder);
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
    [HttpPut("{id:int}", Name = "UpdateSalesOrder")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateSalesOrder(int id, [FromBody] SalesOrderUpdateDTO updateDto)
    {
        try
        {
            if (updateDto == null || id != updateDto.Id)
            {
                return BadRequest();
            }
            SalesOrder salesOrder = _mapper.Map<SalesOrder>(updateDto);

            await _dbSalesOrder.UpdateAsync(salesOrder);
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

}
