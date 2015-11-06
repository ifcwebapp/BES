using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database
{
    public partial class GetCountriesInfo_Result
    {
        public int? GetRegionId(string acronim, bool isIncomeRegion = false, bool isWorldRegion = false, bool isHighIncome = false)
        {
            if (!isHighIncome)
            {
                switch (acronim.ToLower())
                {
                    case "avg":
                        return isIncomeRegion ? AvgIncomeId : AvgRegionId;
                    case "avgd":
                        return AvgdRegionId;
                    case "es":
                        return isIncomeRegion ? EsIncomeId : (isWorldRegion ? EsWorldId : EsRegionId);
                    case "wdi":
                        return isIncomeRegion ? WdiIncomeId : (isWorldRegion ? WdiWorldId : WdiRegionId);
                    default:
                        return null;
                }
            }
            else
            {
                switch (acronim.ToLower())
                {
                    case "avg":
                    case "avgd":
                        return AvgIncomeId;
                    case "es":
                        return EsIncomeId;
                    case "wdi":
                        return WdiIncomeId;
                    default:
                        return null;
                }
            }
        }

        public string Name
        {
            get { return CountryAlias ?? CountryName; }
        }
    }
}
