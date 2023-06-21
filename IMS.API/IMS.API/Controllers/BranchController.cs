using AutoMapper;
using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using IMS.Models.Dto.Branch;
using IMS.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Data;
using System.Net;
using System.Text.Json;

namespace IMS.API.Controllers;

[Route("api/branches")]
[ApiController]
//Deprecated = true
public class BranchController : Controller
{
    protected APIResponse _response;
    private readonly IBranchRepository _dbBranch;
    private readonly IMapper _mapper;

    public BranchController(IBranchRepository dbBranch, IMapper mapper)
    {
        _dbBranch = dbBranch;
        _mapper = mapper;
        _response = new();
    }

    [HttpGet]
    //[ResponseCache(CacheProfileName = "Default30")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> GetBranches(
        [FromQuery] string? search,
         int pageSize = 0,
         int pageNumber = 1
        )
    {
        try
        {
            IEnumerable<Branch> branchList;

            branchList = await _dbBranch.GetAllAsync(pageSize: pageSize, pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<BranchDTO>>(branchList);
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
    [HttpGet("{id:int}", Name = "GetBranch")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetBranch(int id)
    {
        try
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return BadRequest(_response);
            }
            var branch = await _dbBranch.GetAsync(x => x.Id == id);
            if (branch == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<Branch>(branch);
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
    public async Task<ActionResult<APIResponse>> CreateBranch([FromBody] BranchCreateDTO createDTO)
    {
        try
        {
            if (await _dbBranch.GetAsync(x => x.Name.ToLower() == createDTO.Name.ToLower()) != null)
            {
                ModelState.AddModelError("CustomError", "Branch already exists");
                return BadRequest(ModelState);
            }

            if (createDTO == null)
            {
                return BadRequest(createDTO);
            }

            Branch branch = _mapper.Map<Branch>(createDTO);

            await _dbBranch.CreateAsync(branch);
            await _dbBranch.SaveAsync();

            _response.Result = _mapper.Map<BranchDTO>(branch);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetBranch", new { id = branch.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteBranch")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteBranch(int id)
    {
        try
        {
            if (id == 0)
            {
                return BadRequest();
            }
            var branch = await _dbBranch.GetAsync(x => x.Id == id);
            if (branch == null)
            {
                return NotFound();
            }

            await _dbBranch.RemoveAsync(branch);
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
    [HttpPut("{id:int}", Name = "UpdateBranch")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateBranch(int id, [FromBody] BranchUpdateDTO updateDto)
    {
        try
        {
            if(updateDto == null || id != updateDto.Id)
            {
                return BadRequest();
            }
            Branch branch = _mapper.Map<Branch>(updateDto);

            await _dbBranch.UpdateAsync(branch);
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
