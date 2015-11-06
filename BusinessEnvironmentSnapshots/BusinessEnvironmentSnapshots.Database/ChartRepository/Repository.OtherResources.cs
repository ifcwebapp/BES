using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        public List<OtherResource> GetOtherResources(string countryCode)
        {
            return LogTime(() =>
            {
                var db = new DatabaseRepository();
                var data = db.GetOtherResources(countryCode);

                return
                    data.Select(d => new OtherResource {Name = d.Name, Link = d.Link, OrderId = d.OrderId})
                        .ToList();
            }, "other resources request for country {0}", countryCode);
        }
    }
}
