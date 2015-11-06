using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.DB
{
    public class GetValuesResult
    {
        public int IndicatorId { get; set; }
        public int CountryId { get; set; }
        public int Year { get; set; }
        public decimal? IndicatorValue { get; set; }
    }
}
