using AutoMapper;
using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using IMS.Models.Dto.SalesOrderStatus;
using IMS.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Data;
using System.Net;
using System.Text.Json;

namespace IMS.API.Controllers;

[Route("api/sales-order-status")]
[ApiController]
//Deprecated = true
public class SalesOrderStatusController : Controller
{
    protected APIResponse _response;
    private readonly ISalesOrderStatusRepository _dbSalesOrderStatus;
    private readonly IMapper _mapper;

    public SalesOrderStatusController(ISalesOrderStatusRepository dbSalesOrderStatus, IMapper mapper)
    {
        _dbSalesOrderStatus = dbSalesOrderStatus;
        _mapper = mapper;
        _response = new();
    }

    [HttpGet]
    //[ResponseCache(CacheProfileName = "Default30")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> GetSalesOrderStatuses(
        [FromQuery] string? search,
         int pageSize = 0,
         int pageNumber = 1
        )
    {
        try
        {
            IEnumerable<SalesOrderStatus> salesOrderStatusList;

            salesOrderStatusList = await _dbSalesOrderStatus.GetAllAsync(pageSize: pageSize, pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<SalesOrderStatusDTO>>(salesOrderStatusList);
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
    [HttpGet("{id:int}", Name = "GetSalesOrderStatus")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetSalesOrderStatus(int id)
    {
        try
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return BadRequest(_response);
            }
            var salesOrderStatus = await _dbSalesOrderStatus.GetAsync(x => x.Id == id);
            if (salesOrderStatus == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<SalesOrderStatus>(salesOrderStatus);
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
    public async Task<ActionResult<APIResponse>> CreateSalesOrderStatus([FromBody] SalesOrderStatusDTO createDTO)
    {
        try
        {
            if (await _dbSalesOrderStatus.GetAsync(x => x.Name.ToLower() == createDTO.Name.ToLower()) != null)
            {
                ModelState.AddModelError("CustomError", "SalesOrder Status already exists");
                return BadRequest(ModelState);
            }

            if (createDTO == null)
            {
                return BadRequest(createDTO);
            }

            SalesOrderStatus salesOrderStatus = _mapper.Map<SalesOrderStatus>(createDTO);

            await _dbSalesOrderStatus.CreateAsync(salesOrderStatus);
            await _dbSalesOrderStatus.SaveAsync();

            _response.Result = _mapper.Map<SalesOrderStatusDTO>(salesOrderStatus);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetSalesOrderStatus", new { id = salesOrderStatus.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteSalesOrderStatus")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteSalesOrderStatus(int id)
    {
        try
        {
            if (id == 0)
            {
                return BadRequest();
            }
            var salesOrderStatus = await _dbSalesOrderStatus.GetAsync(x => x.Id == id);
            if (salesOrderStatus == null)
            {
                return NotFound();
            }

            await _dbSalesOrderStatus.RemoveAsync(salesOrderStatus);
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
    [HttpPut("{id:int}", Name = "UpdateSalesOrderStatus")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateSalesOrderStatus(int id, [FromBody] SalesOrderStatusDTO updateDto)
    {
        try
        {
            if(updateDto == null || id != updateDto.Id)
            {
                return BadRequest();
            }
            SalesOrderStatus salesOrderStatus = _mapper.Map<SalesOrderStatus>(updateDto);

            await _dbSalesOrderStatus.UpdateAsync(salesOrderStatus);
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
