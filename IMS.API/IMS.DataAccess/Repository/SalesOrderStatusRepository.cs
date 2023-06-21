using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.DataAccess.Repository
{
    public class SalesOrderStatusRepository : Repository<SalesOrderStatus>, ISalesOrderStatusRepository
    {
        private readonly ApplicationDbContext _db;

        public SalesOrderStatusRepository(ApplicationDbContext db):base(db)
        {
            _db = db;
        }
        public async Task<SalesOrderStatus> UpdateAsync(SalesOrderStatus entity)
        {
            _db.SalesOrderStatuses.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
