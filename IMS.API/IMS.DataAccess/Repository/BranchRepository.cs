using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace IMS.DataAccess.Repository
{
    public class BranchRepository : Repository<Branch>, IBranchRepository
    {
        private readonly ApplicationDbContext _db;
        public BranchRepository(ApplicationDbContext db):base(db) 
        {
            _db = db;
        }

        public async Task<Branch> UpdateAsync(Branch entity)
        {
            _db.Branches.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
