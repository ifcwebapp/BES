using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.DB
{
    public class GetValuesForCountryResult
    {
        public string CountryCode { get; set; }
        public int IndicatorId { get; set; }
        public int CountryId { get; set; }
        public int Year { get; set; }
        public decimal? IndicatorValue { get; set; }
        public string CountryName { get; set; }
        public string IndicatorName { get; set; }
        public string IndicatorAlias { get; set; }
        public string CountryAlias { get; set; }
        public int? IndicatorRankIndicatorId { get; set; }
        public bool IsRankIndicator { get; set; }
    }
}
