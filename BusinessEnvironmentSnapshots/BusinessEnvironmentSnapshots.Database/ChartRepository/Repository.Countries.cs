using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        public IList<Model.Country> GetCountries()
        {
            var db = new DatabaseRepository();
            return
                db.GetCountries()
                    .Select(
                        c =>
                            new Model.Country
                            {
                                Code = c.CountryCode,
                                Name = c.CountryAlias ?? c.CountryName,
                                IsHighIncome = c.IncomeId == 3 || c.IncomeId == 5
                            })
                    .OrderBy(c => c.IsHighIncome)
                    .ThenBy(c => c.Name)
                    .ToList();
        }
    }
}
