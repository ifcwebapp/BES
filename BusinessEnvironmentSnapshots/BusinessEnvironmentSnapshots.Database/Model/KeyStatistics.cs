using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.Model
{
    public class Stat
    {
        public string Title { get; set; }
        public decimal? CountryValue { get; set; }
        public int? CountryYear { get; set; }
        public decimal? RegionValue { get; set; }
        public int? RegionYear { get; set; }
        public string RegionName { get; set; }
        public string SourceName { get; set; }
        public string SourceLink { get; set; }
        public string ValueSuffix { get; set; }
    }

    public class AllKeyStatistics
    {
        public Stat GrouthRate { get; set; }
        public Stat PerCapita { get; set; }
        public Stat UnemploymentRate { get; set; }
        public Stat PopulationUnder { get; set; }
        public Stat ForeignInvestment { get; set; }
        public Stat TotalInvestment { get; set; }
        public Stat Inflation { get; set; }
        public Stat GiniIndex { get; set; }
    }

    public class KeyStatistics
    {
        public string CountryName { get; set; }
        public string RegionName { get; set; }
        public AllKeyStatistics Stats { get; set; }
    }
}
