using AutoMapper;
using IMS.DataAccess;
using IMS.Models;
using IMS.Models.Utility;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using IMS.DataAccess.Repository.IRepository;
using System.Text.Json;
using IMS.Models.Dto.Customer;

namespace IMS.API.Controllers
{
    [Route("api/customers")]
    [ApiController]
    public class CustomerController : Controller
    {
        private readonly ICustomerRepository _dbCustomer;
        private readonly IMapper _mapper;
        protected APIResponse _response;

        public CustomerController(ICustomerRepository dbCustomer, IMapper mapper)
        {
            _dbCustomer = dbCustomer;
            _mapper = mapper;
            _response = new();
        }

        [HttpGet]
        //[ResponseCache(CacheProfileName = "Default30")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<APIResponse>> GetCustomers(
                                                        [FromQuery] string? search,
                                                         int pageSize = 0,
                                                         int pageNumber = 1
                                                                    )
        {
            try
            {
                IEnumerable<Customer> customerList;

                customerList = await _dbCustomer.GetAllAsync(pageSize: pageSize, pageNumber: pageNumber);

                Pagination pagination = new()
                {
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                };

                Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

                _response.Result = _mapper.Map<List<CustomerDTO>>(customerList);
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
        [HttpGet("{id:int}", Name = "GetCustomer")]
        //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> GetCustomer(int id)
        {
            try
            {
                if (id == 0)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest(_response);
                }
                var customer = await _dbCustomer.GetAsync(x => x.Id == id);
                if (customer == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return NotFound(_response);
                }

                _response.Result = _mapper.Map<Customer>(customer);
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
        public async Task<ActionResult<APIResponse>> CreateCustomer([FromBody] CustomerCreateDTO createDTO)
        {
            try
            {
                if (await _dbCustomer.GetAsync(x => x.FirstName.ToLower() == createDTO.FirstName.ToLower()) != null
                       && _dbCustomer.GetAsync(x => x.LastName.ToLower() == createDTO.LastName.ToLower()) != null
                    )
                {
                    ModelState.AddModelError("CustomError", "Customer already exists");
                    return BadRequest(ModelState);
                }

                if (await _dbCustomer.GetAsync(x => x.EmailAddress.ToLower() == createDTO.EmailAddress.ToLower()) != null)
                {
                    ModelState.AddModelError("CustomError", "Email Address already exists");
                    return BadRequest(ModelState);
                }

                if (createDTO == null)
                {
                    return BadRequest(createDTO);
                }

                Customer customer = _mapper.Map<Customer>(createDTO);

                await _dbCustomer.CreateAsync(customer);
                await _dbCustomer.SaveAsync();

                _response.Result = _mapper.Map<CustomerDTO>(customer);
                _response.StatusCode = HttpStatusCode.Created;
                //return CreatedAtRoute("GetCustomer", new { id = customer.Id }, _response);
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string>() { ex.ToString() };
            }
            return _response;
        }

        [HttpDelete("{id:int}", Name = "DeleteCustomer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        //[Authorize(Roles = "admin")]
        public async Task<ActionResult<APIResponse>> DeleteCustomer(int id)
        {
            try
            {
                if (id == 0)
                {
                    return BadRequest();
                }
                var customer = await _dbCustomer.GetAsync(x => x.Id == id);
                if (customer == null)
                {
                    return NotFound();
                }

                await _dbCustomer.RemoveAsync(customer);
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
        [HttpPut("{id:int}", Name = "UpdateCustomer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<APIResponse>> UpdateCustomer(int id, [FromBody] CustomerUpdateDTO updateDto)
        {
            try
            {
                if (updateDto == null || id != updateDto.Id)
                {
                    return BadRequest();
                }
                Customer customer = _mapper.Map<Customer>(updateDto);

                await _dbCustomer.UpdateAsync(customer);
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
}
