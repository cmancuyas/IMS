using AutoMapper;
using IMS.DataAccess.Repository;
using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using IMS.Models.Dto.Company;
using IMS.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Data;
using System.Net;
using System.Text.Json;

namespace IMS.API.Controllers;

[Route("api/companies")]
[ApiController]
//Deprecated = true
public class CompanyController : Controller
{
    protected APIResponse _response;
    private readonly ICompanyRepository _dbCompany;
    private readonly IMapper _mapper;

    public CompanyController(ICompanyRepository dbCompany, IMapper mapper)
    {
        _dbCompany = dbCompany;
        _mapper = mapper;
        _response = new();
    }

    [HttpGet]
    //[ResponseCache(CacheProfileName = "Default30")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> GetCompanies(
        [FromQuery] string? search,
         int pageSize = 0,
         int pageNumber = 1
        )
    {
        try
        {
            IEnumerable<Company> companyList;

            companyList = await _dbCompany.GetAllAsync(pageSize: pageSize, pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<CompanyDTO>>(companyList);
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
    [HttpGet("{id:int}", Name = "GetCompany")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetCompany(int id)
    {
        try
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return BadRequest(_response);
            }
            var company = await _dbCompany.GetAsync(x => x.Id == id);
            if (company == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<Company>(company);
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
    public async Task<ActionResult<APIResponse>> CreateCompany([FromBody] CompanyCreateDTO createDTO)
    {
        try
        {
            if (await _dbCompany.GetAsync(x => x.Name.ToLower() == createDTO.Name.ToLower()) != null)
            {
                ModelState.AddModelError("CustomError", "Company already exists");
                return BadRequest(ModelState);
            }

            if (createDTO == null)
            {
                return BadRequest(createDTO);
            }

            Company company = _mapper.Map<Company>(createDTO);

            await _dbCompany.CreateAsync(company);
            await _dbCompany.SaveAsync();

            _response.Result = _mapper.Map<CompanyDTO>(company);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetCompany", new { id = company.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteCompany")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteCompany(int id)
    {
        try
        {
            if (id == 0)
            {
                return BadRequest();
            }
            var company = await _dbCompany.GetAsync(x => x.Id == id);
            if (company == null)
            {
                return NotFound();
            }

            await _dbCompany.RemoveAsync(company);
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
    [HttpPut("{id:int}", Name = "UpdateCompany")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateCompany(int id, [FromBody] CompanyUpdateDTO updateDto)
    {
        try
        {
            if(updateDto == null || id != updateDto.Id)
            {
                return BadRequest();
            }
            Company company = _mapper.Map<Company>(updateDto);

            await _dbCompany.UpdateAsync(company);
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
